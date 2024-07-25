import { createClient } from "@vercel/postgres";
import express, { Response, Request } from "express";
import { config } from "dotenv";

import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import {
  generateAccessToken,
  authenticateToken,
} from "./JWT/authenticateToken";

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
