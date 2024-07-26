import { createClient } from "@vercel/postgres";
import express, { Response, Request } from "express";
import { config } from "dotenv";
import { authenticateToken, JwtRequest } from "../middleware/authenticateToken";
export const routerOrders = express.Router();

config();

const client = createClient({
  connectionString: process.env.DATABASE_URL,
});

//Apertura connessione database
client.connect();

// Restituisce lo storico degli ordini dell'utente.

routerOrders.get("/:id", authenticateToken, (req: Request, res: Response) => {
  const { idUser } = req.params;
  client.query(
    `SELECT * FROM orders WHERE userid = $1`,
    [idUser],
    function (error, response) {
      res.json(response.rows);
    }
  );
});

//Permette agli utenti di creare un nuovo ordine a partire dai prodotti presenti attualmente nel carrello
routerOrders.post("/:id", authenticateToken, (req: Request, res: Response) => {
  const { userid, quantity, status, productid } = req.body;

  client.query(
    `SELECT * FROM carts WHERE userid = $1`,
    [userid],
    (error, response) => {
      if (error) {
        return res.status(400).json({ error });
      } else {
        client.query(
          `INSERT INTO orders (userid, quantity, status, productid) VALUES ($1, $2, $3, $4)`,
          [userid, quantity, status, productid],
          (error, response) => {
            if (error) {
              return res.status(400).json({ error });
            } else {
              client.query(
                `DELETE FROM carts WHERE userid = $1`,
                [userid],
                (error, deleteResponse) => {
                  if (error) {
                    return res.status(400).json({ error });
                  } else {
                    return res.status(200).json({
                      message: "Order placed successfully",
                    });
                  }
                }
              );
            }
          }
        );
      }
    }
  );
});

// Restituisce i dettagli di un singolo ordine identificato dal suo ID.
routerOrders.get("/:id", authenticateToken, (req: Request, res: Response) => {
  const { id } = req.params;
  client.query(
    `SELECT * FROM  orders WHERE id= $1`,
    [id],
    function (error, response) {
      return res.status(200).json(response.rows);
    }
  );
});

//Consente agli amministratori di aggiornare lo stato di un ordine esistente.
routerOrders.patch(
  "/:id",
  authenticateToken,
  (req: JwtRequest, res: Response) => {
    const { id } = req.params;
    const { status } = req.body;
    const access = req.user as any;
    const admin = access.user.admin;
    if (admin === true) {
      client.query(
        `UPDATE orders SET status = $1 WHERE id= $2`,
        [status, id],
        function (error, response) {
          if (error) res.status(400).json({ error });
          else return res.status(200).json({ message: "status updated" });
        }
      );
    } else res.status(400).json({ message: "Non sei autorizzato" });
  }
);

// Permette agli amministratori di cancellare un ordine
routerOrders.delete(
  "/:id",
  authenticateToken,
  (req: JwtRequest, res: Response) => {
    const { id } = req.params;
    const statusconsegnato = "consegnato";
    const access = req.user as any;
    const admin = access.user.admin;
    if (admin === true) {
      client.query(
        `UPDATE orders SET status = $2 WHERE id= $1`,
        [id, statusconsegnato],
        function (error, response) {
          if (error) res.status(400).json({ error });
          else return res.status(200).json({ message: "order deleted" });
        }
      );
    } else res.status(400).json({ message: "Non sei autorizzato" });
  }
);
