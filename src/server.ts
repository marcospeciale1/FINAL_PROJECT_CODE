import { createClient } from "@vercel/postgres";
import express, { Response, Request } from "express";
import { config } from 'dotenv';
/*****************************
 *                           *
 *  INIZIALIZZAZIONE SERVER  *
 *                           *
 *****************************/
config();

const port = process.env.PORT || 3000
const baseURL =  "http://localhost"
// const url_db = process.env.BASE_URL_DB;

// creiamo un applicazione express
const app = express();
//istanziare un server
const server = express.json();
// inizializziamo un server
app.use(server)

const client = createClient({
    connectionString: process.env.DATABASE_URL,
  });

  client.connect();

/*****************************
 *                           *
 *  INIZIALIZZAZIONE SERVER  *
 *                           *
 *****************************/

/*****************************
 *                           *
 *      RICHIESTE CRUD       *
 *        EXAMPLE            *
 *****************************/

/*-------------------------------------------- */
/*****************************
 *       API PRODUCTS        *
 *****************************/

app.get("/api/products", async (req: Request, res: Response) => {
    const products = await client.query("SELECT * FROM products")
    res.status(200).json(products.rows)
})


// create
app.post("/api/products",(req: Request, res: Response) => {

    const { title, price, category, description, image } = req.body;
    
    client.query("INSERT INTO products ( title, price, category, description, image) VALUES ($1, $2, $3, $4, $5) RETURNING *",
        [ title, price, category, description, image],
        (err,result)=> {
            if(err) return res.status(400).json({err});
            else return res.status(200).json(result.rows)    
        }
    );
   
});

// reade
app.get("/api/products/:id",(req: Request, res: Response) => {
    
    const productId = req.params.id

    client.query( 'SELECT * FROM products WHERE id = $1',[productId],
    (err,result)=>{
        if(err) return res.status(400).json({err});
        else return res.status(200).json(result.rows)
    });
     
})


// update
app.put("/api/products/:id",(req: Request, res: Response) => {

    const productId = req.params.id

    const {title, price, category, description, image } = req.body;

    client.query('UPDATE products SET title = $1, price = $2, category = $3, description = $4, image = $5 WHERE id = $6',
        [title, price, category, description, image, productId],
        (err,result)=>{
            if(err) return res.status(400).json({err});
            else return res.status(200).json(result.rows)
        }
    );

})


// delete
app.delete('/api/products/:id', (req: Request, res: Response) => {

    const productId = req.params.id

    client.query('DELETE FROM products WHERE id = $1', [productId],
        (err,result)=>{
            if(err) return res.status(400).json({err});
            else return res.status(200).json(result.rows)
        }
    )

})




/*****************************
 *       API PRODUCTS        *
 *****************************/

/*****************************
 *       API CART            *
 *****************************/
app.get("/api/carts",(req: Request, res:Response) =>{
})



/*****************************
 *       API CART            *
 *****************************/



/*****************************
 *       API orders          *
 *****************************/





/*****************************
 *       API orders          *
 *****************************/




/*****************************
 *                           *
 *  INIZIALIZZAZIONE SERVER  *
 *    su cui rannure         *
 *****************************/
// inizializiamo le porte da cui runnare il server
// PRIMO PARAMETRO PORTA SU CUI RUNNARE
app.listen(3000, () => {
    console.log("server is running in "+baseURL+ port)
})