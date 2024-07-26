import { createClient } from "@vercel/postgres";
import express, { Response, Request } from "express";
import { config } from "dotenv";
import { authenticateToken, JwtRequest } from "../JWT/authenticateToken";
export const routerCart = express.Router();

const client = createClient({
  connectionString: process.env.DATABASE_URL,
});
client.connect();

// Restituisce il contenuto attuale del carrello dell'utente.

routerCart.get("", (req: Request, res: Response) => {
  client.query(`SELECT * FROM carts`, function (error, response) {
    res.status(200).json(response.rows);
  });
});

// Aggiunge un prodotto al carrello dell'utente.

routerCart.post(
  "/add/:id",
  authenticateToken,
  (req: JwtRequest, res: Response) => {
    const access = req.user as { id: number; admin: boolean };

    if (access.admin === true) {
      client.query(
        `INSERT INTO carts (userid, productid, quantity) VALUES ($1, $2, $3)`,
        [req.params.id, req.body.productid, req.body.quantity],
        function (error, response) {
          if (error) res.status(500).json({ error });
          else res.status(200).json(response.rows);
        }
      );
      res.status(200).json({ message: "Avvenuta con successo" });
    } else {
      res.status(200).json({ message: "Non sei autorizzato" });
    }
  }
);

// Rimuove un prodotto dal carrello dell'utente.

routerCart.delete("/remove/:id", (req: JwtRequest, res: Response) => {
  const access = req.user as { id: number; admin: boolean };
  if (access.admin === true) {
    client.query(
      `DELETE FROM carts WHERE id = $1`,
      [req.params.id],
      function (error, response) {
        if (error) res.status(500).json({ error });
        else res.status(200).json(response.rows);
      }
    );
    res.status(200).json({ message: "Operazione avvenuta con successo" });
  }
});

// Svuota il carrello dell'utente.

routerCart.delete("/clear", (req: JwtRequest, res: Response) => {
  const access = req.user as { id: number; admin: boolean };
  if (access.admin === true) {
    client.query(`DELETE FROM carts`, function (error, response) {
      if (error) res.status(500).json({ error });
      else res.status(200).json(response.rows);
    });
    res.status(200).json({ message: "Operazione avvenuta con successo" });
  } else res.status(400).json({ message: "Non sei autorizzato" });
});
