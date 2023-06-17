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
const useQuery_js_1 = __importDefault(require("../common/useQuery.js"));
const groupsApi = ({ api, mysqlConnection }) => {
    const { queryAndRetry } = (0, useQuery_js_1.default)({ mysqlConnection });
    const servers = [
        "argonnessen",
        "cannith",
        "ghallanda",
        "khyber",
        "orien",
        "sarlona",
        "thelanis",
        "wayfinder",
        "hardcore",
        "all",
    ];
    function getGroupData(server) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            try {
                let query = `SELECT ${server == "all" ? "*" : server} FROM \`groups\` ORDER BY \`groups\`.\`datetime\` DESC LIMIT 1;`;
                queryAndRetry(query, 3)
                    .then((result) => {
                    if (result[0]) {
                        const singular = result[0];
                        if (server === "all") {
                            resolve([
                                JSON.parse(singular["argonnessen"]),
                                JSON.parse(singular["cannith"]),
                                JSON.parse(singular["ghallanda"]),
                                JSON.parse(singular["khyber"]),
                                JSON.parse(singular["orien"]),
                                JSON.parse(singular["sarlona"]),
                                JSON.parse(singular["thelanis"]),
                                JSON.parse(singular["wayfinder"]),
                                JSON.parse(singular["hardcore"]),
                            ]);
                        }
                        else {
                            resolve(singular[server]);
                        }
                    }
                    else {
                        reject({ error: "No data found" });
                    }
                })
                    .catch((err) => {
                    reject(err);
                });
            }
            catch (_a) {
                reject({ error: "Generic error" });
            }
        }));
    }
    servers.forEach((entry) => {
        api.get(`/groups/${entry}`, (req, res) => {
            res.setHeader("Content-Type", "application/json");
            res.set("Cache-Control", "no-store");
            getGroupData(entry)
                .then((result) => {
                res.send(result);
            })
                .catch((err) => {
                res.send(err);
            });
        });
    });
};
exports.default = groupsApi;
