import { createClient } from "@vercel/postgres";
import express, { Response, Request } from "express";
import { config } from "dotenv";
/*****************************
 *                           *
 *  INIZIALIZZAZIONE SERVER  *
 *                           *
 *****************************/
config();

const port = process.env.PORT || 3000;
const baseURL = "http://localhost";
// const url_db = process.env.BASE_URL_DB;

// creiamo un applicazione express
const app = express();
//istanziare un server
const server = express.json();
// inizializziamo un server
app.use(server);

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
 *       API USERS           *
 *****************************/

app.post("/api/auth/register", (req: Request, res: Response) => {
  const { email, username, password, firstname, lastname, citta, indirizzo } =
    req.body;
  client.query(
    "INSERT INTO users (email, username, password, firstname, lastname, citta, indirizzo) VALUES ($1, $2, $3, $4, $5, $6, $7)",
    [email, username, password, firstname, lastname, citta, indirizzo],
    (err, result) => {
      if (err) {
        res.status(400).send({
          message: err.message,
        });
      } else {
        res.status(200).send({
          message: "registered",
        });
      }
    }
  );
});

app.post("/api/auth/admin/register", (req: Request, res: Response) => {
  const { email, username, password, firstname, lastname, citta, indirizzo } =
    req.body;
  client.query(
    "INSERT INTO users (email, username, password, firstname, lastname, citta, indirizzo) VALUES ($1, $2, $3, $4, $5, $6, $7)",
    [email, username, password, firstname, lastname, citta, indirizzo],
    (err, result) => {
      if (err) {
        res.status(400).send({
          message: err.message,
        });
      } else {
        res.status(200).send({
          message: "registered",
        });
      }
    }
  );
});

app.post("/api/auth/login", (req: Request, res: Response) => {
  const { email, password } = req.body;
  client.query(
    "SELECT * FROM users WHERE email = $1 AND password = $2",
    [email, password],
    (err, result) => {
      if (err) {
        res.status(400).send({
          message: err.message,
        });
      } else {
        res.status(200).send({
          message: "logged in",
        });
      }
    }
  );
});

app.get("/api/auth/logout", (req: Request, res: Response) => {
  const { id } = req.body;
  client.query(
    "DELETE FROM auth_token WHERE user_id = $1",
    [id],
    (err, result) => {
      if (err) {
        res.status(400).send({
          message: err.message,
        });
      } else {
        res.status(200).send({
          message: "logged out",
        });
      }
    }
  );
});

app.get("/api/auth/user", (req: Request, res: Response) => {
  const { id } = req.body;
  client.query("SELECT * FROM users WHERE id = $1", [id], (error, response) => {
    res.json(response.rows);
  });
});

app.get("/api/auth/users", (req: Request, res: Response) => {
  client.query("SELECT * FROM users", (error, response) => {
    res.json(response.rows);
  });
});

/*****************************
 *       API USERS           *
 *****************************/

/*****************************
 *       API PRODUCTS        *
 *****************************/

app.get("/api/products", (req: Request, res: Response) => {
  client.query("SELECT * FROM products");
});

/*****************************
 *       API PRODUCTS        *
 *****************************/

/*****************************
 *       API CART            *
 *****************************/
app.get("/api/carts", (req: Request, res: Response) => {});

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
  console.log("server is running in " + baseURL + port);
});
