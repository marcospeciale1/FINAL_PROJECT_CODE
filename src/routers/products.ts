import { createClient } from "@vercel/postgres";
import express, { Response, Request } from "express";
import { config } from "dotenv";
import { authenticateToken, JwtRequest } from "../JWT/authenticateToken";
export const routerProducts = express.Router();

config();

const client = createClient({
  connectionString: process.env.DATABASE_URL,
});

client.connect();

routerProducts.get("", async (req: Request, res: Response) => {
  const products = await client.query("SELECT * FROM products");
  res.status(200).json(products.rows);
});

// create
routerProducts.post("", authenticateToken, (req: JwtRequest, res: Response) => {
  const { title, price, category, description, image } = req.body;
  const access = req.user as any;
  const admin = access.user.admin
  if (admin === true) {
    client.query(
      "INSERT INTO products ( title, price, category, description, image) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [title, price, category, description, image],
      (err, result) => {
        if (err) return res.status(400).json({ err });
        else return res.status(200).json(result.rows);
      }
    );
    res.status(200).json({ message: "prodotto aggiunto con successo" });
  } else res.status(400).json({ message: "Non sei autorizzato" });
});

// reade
routerProducts.get("/:id", (req: Request, res: Response) => {
  const productId = req.params.id;

  client.query(
    "SELECT * FROM products WHERE id = $1",
    [productId],
    (err, result) => {
      if (err) return res.status(400).json({ err });
      else return res.status(200).json(result.rows[0]);
    }
  );
});

// update
routerProducts.put(
  "/:id",
  authenticateToken,
  (req: JwtRequest, res: Response) => {
    const productId = req.params.id;
    const { title, price, category, description, image } = req.body;
    const access = req.user as any;
    const admin = access.user.admin
    if (admin === true) {
      client.query(
        "UPDATE products SET title = $1, price = $2, category = $3, description = $4, image = $5 WHERE id = $6 RETURNING *",
        [title, price, category, description, image, productId],
        (err, result) => {
          if (err) return res.status(400).json({ err });
          else return res.status(200).json(result.rows);
        }
      );
      res.status(200).json({ message: "prodotto aggiornato con successo" });
    } else res.status(400).json({ message: "Non sei autorizzato" });
  }
);

// delete
routerProducts.delete(
  "/:id",
  authenticateToken,
  (req: JwtRequest, res: Response) => {
    const productId = req.params.id;
    const access = req.user as any;
    const admin = access.user.admin
    if (admin === true) {
      client.query(
        "DELETE FROM products WHERE id = $1",
        [productId],
        (err, result) => {
          if (err) return res.status(400).json({ err });
          else return res.status(200).json(result.rows);
        }
      );
      res.status(200).json({ message: "Avvenuta con successo" });
    } else res.status(400).json({ message: "Non sei autorizzato" });
  }
);
