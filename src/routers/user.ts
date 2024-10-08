import { createClient } from "@vercel/postgres";
import express, { Response, Request } from "express";
import { config } from "dotenv";

import { userInfo } from "os";
import { generateAccessToken, authenticateToken } from "../middleware/authenticateToken";

config();

const client = createClient({
  connectionString: process.env.DATABASE_URL,
});

client.connect();

export const routerUser = express.Router();

// registrazione utente
routerUser.post("/register", (req: Request, res: Response) => {
  const {
    email,
    username,
    password,
    firstname,
    lastname,
    citta,
    indirizzo,
    admin = false,
  } = req.body;
  client.query(
    "INSERT INTO users (email, username, password, firstname, lastname, citta, indirizzo, admin) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)",
    [email, username, password, firstname, lastname, citta, indirizzo, admin],
    (err, result) => {
      if (err) {
        res.status(400).json({
          message: err.message,
        });
      } else {
        res.status(200).json({
          message: "registered with success",
        });
      }
    }
  );
});

// registrazione admin
routerUser.post("/admin/register", (req: Request, res: Response) => {
  const {
    email,
    username,
    password,
    firstname,
    lastname,
    citta,
    indirizzo,
    admin = true,
  } = req.body;
  client.query(
    "INSERT INTO users (email, username, password, firstname, lastname, citta, indirizzo,admin) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)",
    [email, username, password, firstname, lastname, citta, indirizzo, admin],
    (err, result) => {
      if (err) {
        res.status(400).json({
          message: err.message,
        });
      } else {
        res.status(200).json({
          message: "registered with success",
        });
      }
    }
  );
});


// login
routerUser.post("/login", (req: Request, res: Response) => {
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

// logout
routerUser.get("/logout", authenticateToken, (req: Request, res: Response) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  client.query("DELETE FROM auth WHERE token = $1", [token], (err, result) => {
    if (err) {
      res.status(400).json({
        message: err.message,
      });
    } else {
      res.status(200).json({
        message: "logout whit success",
      });
    }
  });
});


routerUser.get(
  "/user/:id",
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

// get all user
routerUser.get("/users", (req: Request, res: Response) => {
  client.query("SELECT * FROM users", (error, response) => {
    res.json(response.rows);
  });
});

routerUser.delete(
  "/user/:id",
  authenticateToken,
  (req: Request, res: Response) => {
    const { id } = req.params;
    client.query("DELETE FROM users WHERE id = $1", [id], (error, response) => {
      if (error) {
        res.status(400).json({
          message: error.message,
        });
      } else {
        res.status(200).json({
          message: "deleted",
        });
      }
    });
  }
);
