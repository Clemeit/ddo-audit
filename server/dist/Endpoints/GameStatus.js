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
const path_1 = __importDefault(require("path"));
const useQuery_1 = __importDefault(require("../common/useQuery"));
const gameStatusApi = ({ api, mysqlConnection }) => {
    const { queryAndRetry } = (0, useQuery_1.default)({ mysqlConnection });
    const servers = [
        ["Argonnessen", "argonnessen"],
        ["Cannith", "cannith"],
        ["Ghallanda", "ghallanda"],
        ["Khyber", "khyber"],
        ["Orien", "orien"],
        ["Sarlona", "sarlona"],
        ["Thelanis", "thelanis"],
        ["Wayfinder", "wayfinder"],
        ["Hardcore", "hardcore"],
    ];
    const getPlayerAndLfmOverview = () => {
        return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
            const query = `SELECT * from \`population\` WHERE id=(SELECT max(id) FROM population);`;
            queryAndRetry(query, 3)
                .then((result) => {
                if (result) {
                    let ret = [];
                    servers.forEach((server) => {
                        ret.push({
                            ServerName: server[0],
                            PlayerCount: result[0][`${server[1]}_playercount`],
                            LfmCount: result[0][`${server[1]}_lfmcount`],
                        });
                    });
                    resolve(ret);
                }
                else {
                    reject({ error: "null data" });
                }
            })
                .catch((err) => {
                reject(err);
            });
        }));
    };
    const getGroupTableCount = () => {
        return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
            const query = `SELECT COUNT(*) AS Count from \`groups\`;`;
            queryAndRetry(query, 3)
                .then((result) => {
                if (result && result.length) {
                    resolve(result[0]);
                }
                else {
                    reject({ error: "null data" });
                }
            })
                .catch((err) => {
                reject(err);
            });
        }));
    };
    const getPlayerTableCount = () => {
        return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
            const query = `SELECT COUNT(*) AS Count from \`players_cached\`;`;
            queryAndRetry(query, 3)
                .then((result) => {
                if (result) {
                    resolve(result[0]);
                }
                else {
                    reject({ error: "null data" });
                }
            })
                .catch((err) => {
                reject(err);
            });
        }));
    };
    api.get(`/gamestatus/populationoverview`, (_, res) => {
        res.setHeader("Content-Type", "application/json");
        getPlayerAndLfmOverview()
            .then((result) => {
            res.send(result);
        })
            .catch((err) => {
            console.log(err);
            return {};
        });
    });
    api.get(`/gamestatus/grouptablecount`, (_, res) => {
        res.setHeader("Content-Type", "application/json");
        getGroupTableCount()
            .then((result) => {
            res.send(result);
        })
            .catch((err) => {
            console.log(err);
            return {};
        });
    });
    api.get(`/gamestatus/playertablecount`, (_, res) => {
        res.setHeader("Content-Type", "application/json");
        getPlayerTableCount()
            .then((result) => {
            res.send(result);
        })
            .catch((err) => {
            console.log(err);
            return {};
        });
    });
    api.get(`/gamestatus/serverstatus`, (_, res) => {
        res.setHeader("Content-Type", "application/json");
        res.sendFile(path_1.default.resolve(`./api_v1/gamestatus/serverstatus.json`));
    });
};
exports.default = gameStatusApi;
