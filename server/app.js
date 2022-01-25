const compression = require("compression");
const express = require("express");
const cors = require("cors");
const path = require("path");
var admin = require("firebase-admin");

const { initializeApp, applicationDefault } = require("firebase-admin/app");
require("dotenv").config();

const api = express();
// const app = express();

// const APP_PORT = process.env.APP_PORT;
const API_PORT = process.env.API_PORT;

// app.use(compression());

api.use(cors());
api.options("*", cors());
// app.use(cors());
// app.options("*", cors());

// Major endpoints
require("./population")(api);

// Firebase
initializeApp({
	credential: applicationDefault(),
});

// app.listen(APP_PORT, () => {
// 	console.log(`Front-end listening on ${APP_PORT}`);
// });

api.listen(API_PORT, () => {
	console.log(`API listening on ${API_PORT}`);
});
