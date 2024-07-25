import { createClient } from "@vercel/postgres";
import express, { Response, Request } from "express";
import { config } from "dotenv";
import "dotenv/config";
import { authenticateToken } from "../JWT/authenticateToken";
export const routerProducts = express.Router();
const client = createClient({
  connectionString: process.env.DATABASE_URL,
});

routerProducts.get("/api/products", async (req: Request, res: Response) => {
  const products = await client.query("SELECT * FROM products");
  res.status(200).json(products.rows);
});

// create
routerProducts.post(
  "/api/products",
  authenticateToken,
  (req: Request, res: Response) => {
    const { title, price, category, description, image } = req.body;

    client.query(
      "INSERT INTO products ( title, price, category, description, image) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [title, price, category, description, image],
      (err, result) => {
        if (err) return res.status(400).json({ err });
        else return res.status(200).json(result.rows);
      }
    );
  }
);

// reade
routerProducts.get("/api/products/:id", (req: Request, res: Response) => {
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
  "/api/products/:id",
  authenticateToken,
  (req: Request, res: Response) => {
    const productId = req.params.id;

    const { title, price, category, description, image } = req.body;

    client.query(
      "UPDATE products SET title = $1, price = $2, category = $3, description = $4, image = $5 WHERE id = $6 RETURNING *",
      [title, price, category, description, image, productId],
      (err, result) => {
        if (err) return res.status(400).json({ err });
        else return res.status(200).json(result.rows);
      }
    );
  }
);

// delete
routerProducts.delete(
  "/api/products/:id",
  authenticateToken,
  (req: Request, res: Response) => {
    const productId = req.params.id;

    client.query(
      "DELETE FROM products WHERE id = $1",
      [productId],
      (err, result) => {
        if (err) return res.status(400).json({ err });
        else return res.status(200).json(result.rows);
      }
    );
  }
);
