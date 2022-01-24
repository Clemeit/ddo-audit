const compression = require("compression");
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const api = express();
const app = express();

const APP_PORT = process.env.APP_PORT;
const API_PORT = process.env.API_PORT;

app.use(express.static("../client")); // This is NOT good for production
app.use(compression());

api.use(cors());
api.options("*", cors());
app.use(cors());
app.options("*", cors());

// Major endpoints
require("./population")(api);
// require("./cron");

// app.get(["/", "/*"], function (req, res, next) {
// 	res.sendFile(path.join(__dirname, "../client", "index.html"));
// });

app.listen(APP_PORT, () => {
	console.log(`Front-end listening on ${APP_PORT}`);
});

api.listen(API_PORT, () => {
	console.log(`API listening on ${API_PORT}`);
});
