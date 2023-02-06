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
import iotApi from "./Endpoints/IOT.js";
import caasApi from "./Endpoints/CaaS.js";

// import { initializeApp, applicationDefault } from "firebase-admin/app";

const api = express();
const API_PORT = process.env.API_PORT;

api.use(cors());
api.options("*", cors());
// api.use(express.urlencoded());
api.use(express.json());
api.use(bodyParser.json()); // support json encoded bodies
api.use(bodyParser.urlencoded({ extended: true }));

// Major endpoints
populationApi(api);
demographicsApi(api);
groupsApi(api);
playersApi(api);
messageServiceApi(api);
gameStatusApi(api);
activityApi(api);
friendsApi(api);
iotApi(api);
caasApi(api);

// Firebase
// initializeApp({
// 	credential: applicationDefault(),
// });

api.listen(API_PORT, () => {
	console.log(`API listening on ${API_PORT}`);
});
