import "./dotenvConfig.js";
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import populationApi from "./Endpoints/Population.js";
import demographicsApi from "./Endpoints/Demographics.js";
import groupsApi from "./Endpoints/Groups.js";
import playersApi from "./Endpoints/Players.js";
import messageServiceApi from "./Endpoints/MessageService.js";
import gameStatusApi from "./Endpoints/GameStatus.js";
import activityApi from "./Endpoints/Activity.js";
import friendsApi from "./Endpoints/Friends.js";
// import iotApi from "./Endpoints/IOT.js";
import caasApi from "./Endpoints/CaaS.js";
import mysql from "mysql2";
import useMail from "./hooks/useMail.js";

// import { initializeApp, applicationDefault } from "firebase-admin/app";

const api = express();
const API_PORT = process.env.API_PORT;

api.use(cors());
api.options("*", cors());
// api.use(express.urlencoded());
api.use(express.json());
api.use(bodyParser.json()); // support json encoded bodies
api.use(bodyParser.urlencoded({ extended: true }));

const { sendMessage } = useMail();

async function restartMySql() {
  return new Promise((resolve, reject) => {
    let mysqlConnection;

    console.log("MySQL reconnecting...");
    // Try to reconnect:
    mysqlConnection = mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
    });

    mysqlConnection.connect((err) => {
      if (err) {
        console.log("Failed to reconnect. Aborting!", err);
        setTimeout(restartMySql, 5000);
        reject();
      } else {
        console.log("Reconnected!");
        sendMessage("MySQL reconnected");
        resolve(mysqlConnection);
      }
    });

    mysqlConnection.on("error", (err) => {
      if (err.code === "PROTOCOL_CONNECTION_LOST") {
        restartMySql();
        sendMessage("MySQL connection lost");
      } else {
        restartMySql();
        if (err && err.code) {
          sendMessage(`MySQL error: ${err.code}`);
        } else {
          sendMessage(`MySQL undefined error`);
        }
      }
    });
  });
}

restartMySql().then((result) => {
  // Major endpoints
  populationApi(api, result);
  demographicsApi(api, result);
  groupsApi(api, result);
  playersApi(api, result);
  messageServiceApi(api, result);
  gameStatusApi(api, result);
  activityApi(api, result);
  friendsApi(api, result);
  // iotApi(api);
  caasApi(api, result);
});

// Firebase
// initializeApp({
// 	credential: applicationDefault(),
// });

api.listen(API_PORT, () => {
  console.log(`API listening on ${API_PORT}`);
});
