import { createClient } from "@vercel/postgres";
import express, { Response, Request } from "express";
import { config } from 'dotenv';
import "dotenv/config"
export const routerCart = express.Router();

/*app.get("/api/carts",(req: Request, res:Response) =>{
})

// Restituisce il contenuto attuale del carrello dell'utente.

app.get("/api/carts",(req: Request, res:Response) =>{
    client.query(`SELECT * FROM cart`, function (error, response) {
        if (error) res.status(500).json({ error });
    else res.status(200).json(response.rows);
      });
})

// Aggiunge un prodotto al carrello dell'utente.

app.post("/api/cart/add/:id", (req: Request, res: Response) => {
    client.query(`INSERT INTO cart (id, userId, productId, quiantity) VALUES ($1, $2, $3, $4)`, 
        [{id: req.params.id, userId: req.body.userId, productid: req.body.productid, quiantity: req.body.quiantity}],
         function (error, response) {
        if(error) res.status(500).json({ error });
        else res.status(200).json(response.rows);
    })
})

// Rimuove un prodotto dal carrello dell'utente.

app.delete("/api/cart/remove/:id", (req: Request, res: Response) => {
    client.query(`DELETE FROM cart WHERE id = $1`, [req.params.id], function (error, response) {
        if(error) res.status(500).json({ error });
        else res.status(200).json(response.rows);
    })
})

// Svuota il carrello dell'utente.

app.delete("/api/cart/clear", (req: Request, res: Response) => {
    client.query(`DELETE FROM cart`, function (error, response) {
        if(error) res.status(500).json({ error });
        else res.status(200).json(response.rows);
       
    })
})*/