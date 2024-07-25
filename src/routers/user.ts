import { createClient } from "@vercel/postgres";
import express, { Response, Request } from "express";
import "dotenv/config";
import {
  authenticateToken,
  generateAccessToken,
} from "../JWT/authenticateToken";

const client = createClient({
  connectionString: process.env.DATABASE_URL,
});

export const routerUser = express.Router();

routerUser.post("/api/auth/register", (req: Request, res: Response) => {
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

routerUser.post("/api/auth/admin/register", (req: Request, res: Response) => {
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

routerUser.post("/api/auth/login", (req: Request, res: Response) => {
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

routerUser.get(
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

routerUser.get(
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


routerUser.get("/api/auth/users", (req: Request, res: Response) => {
  client.query("SELECT * FROM users", (error, response) => {
    res.json(response.rows);
  });
});
