const compression = require("compression");
const express = require("express");
const cors = require("cors");
const path = require("path");
let admin = require("firebase-admin");
let mysql = require("mysql2");

const { initializeApp, applicationDefault } = require("firebase-admin/app");
require("dotenv").config();

const api = express();
const API_PORT = process.env.API_PORT;

api.use(cors());
api.options("*", cors());

// Major endpoints
require("./Endpoints/Population")(api);
require("./Endpoints/Demographics")(api);
require("./Endpoints/Groups")(api);
require("./Endpoints/Players")(api);
require("./Endpoints/MessageService")(api);
require("./Endpoints/GameStatus")(api);

// Firebase
initializeApp({
	credential: applicationDefault(),
});

api.listen(API_PORT, () => {
	console.log(`API listening on ${API_PORT}`);
});
