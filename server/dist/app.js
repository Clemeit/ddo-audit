"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("./dotenvConfig.js");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
const Population_js_1 = __importDefault(require("./Endpoints/Population.js"));
const Demographics_js_1 = __importDefault(require("./Endpoints/Demographics.js"));
const Groups_js_1 = __importDefault(require("./Endpoints/Groups.js"));
const Players_js_1 = __importDefault(require("./Endpoints/Players.js"));
const MessageService_js_1 = __importDefault(require("./Endpoints/MessageService.js"));
const GameStatus_js_1 = __importDefault(require("./Endpoints/GameStatus.js"));
const Activity_js_1 = __importDefault(require("./Endpoints/Activity.js"));
const Friends_js_1 = __importDefault(require("./Endpoints/Friends.js"));
const CaaS_js_1 = __importDefault(require("./Endpoints/CaaS.js"));
const mysql2_1 = __importDefault(require("mysql2"));
const useMail_js_1 = __importDefault(require("./common/useMail.js"));
// import { initializeApp, applicationDefault } from "firebase-admin/app";
const api = (0, express_1.default)();
const API_PORT = process.env.API_PORT;
api.use((0, cors_1.default)());
api.options("*", (0, cors_1.default)());
// api.use(express.urlencoded());
api.use(express_1.default.json());
api.use(body_parser_1.default.json()); // support json encoded bodies
api.use(body_parser_1.default.urlencoded({ extended: true }));
const { sendMessage } = (0, useMail_js_1.default)();
function restartMySql() {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            let mysqlConnection;
            console.log("MySQL reconnecting...");
            // Try to reconnect:
            mysqlConnection = mysql2_1.default.createConnection({
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
                }
                else {
                    console.log("Reconnected!");
                    sendMessage("MySQL reconnected");
                    resolve(mysqlConnection);
                }
            });
            mysqlConnection.on("error", (err) => {
                if (err.code === "PROTOCOL_CONNECTION_LOST") {
                    restartMySql();
                    sendMessage("MySQL connection lost");
                }
                else {
                    restartMySql();
                    if (err && err.code) {
                        sendMessage(`MySQL error: ${err.code}`);
                    }
                    else {
                        sendMessage(`MySQL undefined error`);
                    }
                }
            });
        });
    });
}
restartMySql().then((mysqlConnection) => {
    // Major endpoints
    (0, Population_js_1.default)({ api, mysqlConnection });
    (0, Demographics_js_1.default)({ api });
    (0, Groups_js_1.default)({ api, mysqlConnection });
    (0, Players_js_1.default)({ api, mysqlConnection });
    (0, MessageService_js_1.default)({ api, mysqlConnection });
    (0, GameStatus_js_1.default)({ api, mysqlConnection });
    (0, Activity_js_1.default)({ api, mysqlConnection });
    (0, Friends_js_1.default)({ api, mysqlConnection });
    (0, CaaS_js_1.default)({ api, mysqlConnection });
});
// Firebase
// initializeApp({
// 	credential: applicationDefault(),
// });
api.listen(API_PORT, () => {
    console.log(`API listening on ${API_PORT}`);
});
