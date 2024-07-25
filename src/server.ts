import { createClient } from "@vercel/postgres";
import express, { Response, Request } from "express";
import { config } from "dotenv";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import {
  generateAccessToken,
  authenticateToken,
} from "./JWT/authenticateToken";
import { log } from "console";

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
        res.status(400).json({
          message: err.message,
        });
      } else {
        res.status(200).json({
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
        res.status(400).json({
          message: err.message,
        });
      } else {
        res.status(200).json({
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
        res.status(400).json({
          message: err.message,
        });
      } else {
        const token = generateAccessToken({ user: result.rows[0] });
        client.query(
          "INSERT INTO auth (userid,token) VALUES ($1,$2)",
          [result.rows[0].id, token],
          (err, result) => {
            if (err) {
              res.status(400).json({
                message: err.message,
              });
            } else {
              res.status(200).json(token);
            }
          }
        );
      }
    }
  );
});

app.get(
  "/api/auth/logout",
  authenticateToken,
  (req: Request, res: Response) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    client.query(
      "DELETE FROM auth WHERE token = $1",
      [token],
      (err, result) => {
        if (err) {
          res.status(400).json({
            message: err.message,
          });
        } else {
          res.status(200).json({
            message: "logged out",
          });
        }
      }
    );
  }
);

app.get(
  "/api/auth/user/:id",
  authenticateToken,
  (req: Request, res: Response) => {
    const { id } = req.params;
    client.query(
      "SELECT * FROM users WHERE id = $1",
      [id],
      (error, response) => {
        res.json(response.rows);
      }
    );
  }
);

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

/*****************************
 *       API PRODUCTS        *
 *****************************/

/*****************************
 *       API CART            *
 *****************************/

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
