const compression = require("compression");
const express = require("express");
const cors = require("cors");
const path = require("path");
let admin = require("firebase-admin");
let mysql = require("mysql2");
var bodyParser = require("body-parser");

const { initializeApp, applicationDefault } = require("firebase-admin/app");
require("dotenv").config();

const api = express();
const API_PORT = process.env.API_PORT;

api.use(cors());
api.options("*", cors());
// api.use(express.urlencoded());
api.use(express.json());
api.use(bodyParser.json()); // support json encoded bodies
api.use(bodyParser.urlencoded({ extended: true }));

// Major endpoints
require("./Endpoints/Population")(api);
require("./Endpoints/Demographics")(api);
require("./Endpoints/Groups")(api);
require("./Endpoints/Players")(api);
require("./Endpoints/MessageService")(api);
require("./Endpoints/GameStatus")(api);
require("./Endpoints/Activity")(api);
require("./Endpoints/Color")(api);
require("./Endpoints/Friends")(api);
require("./Endpoints/IOT")(api);

// Firebase
initializeApp({
    credential: applicationDefault(),
});

api.listen(API_PORT, () => {
    console.log(`API listening on ${API_PORT}`);
});
