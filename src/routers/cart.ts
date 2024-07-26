import { createClient } from "@vercel/postgres";
import express, { Response, Request } from "express";
import { config } from "dotenv";
import { authenticateToken, JwtRequest } from "../middleware/authenticateToken";

export const routerCart = express.Router();

config()

const client = createClient({
  connectionString: process.env.DATABASE_URL,
});

client.connect();

// Restituisce il contenuto attuale del carrello dell'utente.

routerCart.get("", (req: Request, res: Response) => {
});

// Aggiunge un prodotto al carrello dell'utente.

routerCart.post("/add/:id", authenticateToken, (req: JwtRequest, res: Response) => {
  const access = req.user as any;
  const admin = access.user.admin;
  const {id}=req.params
  const {productid,quantity}=req.body

  if (admin === true) {
    client.query(
      `INSERT INTO carts (userid, productid, quantity) VALUES ($1, $2, $3)`,
      [id,productid,quantity],
      function (error, response) {
        if (error) {
          return res.status(500).json({ error });
        } else {
          return res.status(200).json({ message: "Prodotto aggiunto nel carrello con successo" });
        }
      }
    );
  } else {
    return res.status(403).json({ message: "Non sei autorizzato" }); // Usa il codice di stato 403 per "Forbidden"
  }
});

// Rimuove un prodotto dal carrello dell'utente.

routerCart.delete("/remove/:id", authenticateToken, (req: JwtRequest, res: Response) => {
  const access = req.user as any;

  if (!access) {
    return res.status(401).json({ message: "Utente non autenticato" });
  }

  const admin = access.user.admin;
  const { id } = req.params;

  if (admin === true) {
    client.query(
      `DELETE FROM carts WHERE id = $1`,
      [id],
      function (error, response) {
        if (error) {
          return res.status(500).json({ error });
        } else {
          return res.status(200).json({ message: "Prodotto rimosso dal carrello con successo" });
        }
      }
    );
  } else {
    return res.status(403).json({ message: "Non sei autorizzato" });
  }
});

// Svuota il carrello dell'utente.


routerCart.delete("/clear", authenticateToken, (req: JwtRequest, res: Response) => {
  const access = req.user as any;

  if (!access) {
    return res.status(401).json({ message: "Utente non autenticato" });
  }

  const admin = access.user.admin;

  if (admin === true) {
    client.query(`DELETE FROM carts`, function (error, response) {
      if (error) {
        return res.status(500).json({ error });
      } else {
        return res.status(200).json({ message: "Carrello svuotato con successo" });
      }
    });
  } else {
    return res.status(403).json({ message: "Non sei autorizzato" });
  }
});