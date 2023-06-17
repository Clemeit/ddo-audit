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
const caasApi = ({ api, mysqlConnection }) => {
    const { queryAndRetry } = (0, useQuery_js_1.default)({ mysqlConnection });
    function getValueFromLabel(label) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const query = `SELECT value from \`caas\` WHERE \`label\` LIKE ${mysqlConnection.escape(label || "")};`;
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
    }
    function fetchCaaS() {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const query = `SELECT * from \`caas\`;`;
            queryAndRetry(query, 3)
                .then((result) => {
                resolve(result);
            })
                .catch((err) => {
                reject(err);
            });
        }));
    }
    api.get(`/caas`, (req, res) => {
        var _a, _b;
        res.setHeader("Content-Type", "application/json");
        const label = ((_b = (_a = req.query) === null || _a === void 0 ? void 0 : _a.label) === null || _b === void 0 ? void 0 : _b.toString()) || "";
        if (label) {
            getValueFromLabel(label)
                .then((result) => {
                res.send(result);
            })
                .catch((err) => {
                console.log("Failed to read CaaS:", err);
                res.send([]);
            });
        }
        else {
            fetchCaaS()
                .then((result) => {
                res.send(result);
            })
                .catch((err) => {
                console.log("Failed to read CaaS:", err);
                res.send([]);
            });
        }
    });
};
exports.default = caasApi;
