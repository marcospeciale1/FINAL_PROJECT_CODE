import { createClient } from "@vercel/postgres";
import express, { Response, Request } from "express";
import { config } from 'dotenv';
import "dotenv/config"
export const routerCart = express.Router();



const client = createClient({
    connectionString: process.env.DATABASE_URL,
  });
  client.connect();

// Restituisce il contenuto attuale del carrello dell'utente.

routerCart.get("/api/cart",(req: Request, res:Response) =>{
    client.query(`SELECT * FROM carts`, function (error, response) {
          res.status(200).json(response.rows);
      });
})

// Aggiunge un prodotto al carrello dell'utente.

 routerCart.post("/api/cart/add/:id", (req: Request, res: Response) => {
    console.log(req.params)
    client.query(`INSERT INTO carts (userid, productid, quantity) VALUES ($1, $2, $3)`, 
        [ req.params.id, req.body.productid,req.body.quantity],
         function (error, response) {
        if(error) res.status(500).json({ error });
        else res.status(200).json(response.rows);
    })
})

// Rimuove un prodotto dal carrello dell'utente.

 routerCart.delete("/api/cart/remove/:id", (req: Request, res: Response) => {
    client.query(`DELETE FROM carts WHERE id = $1`, [req.params.id], function (error, response) {
        if(error) res.status(500).json({ error });
        else res.status(200).json(response.rows);
    })
})

// Svuota il carrello dell'utente.

 routerCart.delete("/api/cart/clear", (req: Request, res: Response) => {
    client.query(`DELETE FROM carts`, function (error, response) {
        if(error) res.status(500).json({ error });
        else res.status(200).json(response.rows);
       
    })
})