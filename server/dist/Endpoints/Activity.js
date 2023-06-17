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
const activityApi = ({ api, mysqlConnection }) => {
    const { queryAndRetry } = (0, useQuery_js_1.default)({ mysqlConnection });
    const getQuestActivity = (questId, minimumLevel, maximumLevel) => {
        return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
            const query = `SELECT a.playerlevel, a.start, TIME_TO_SEC(TIMEDIFF(end, start)) AS 'duration', a.server FROM activity a WHERE a.questid = ${mysqlConnection.escape(questId)} AND a.playerlevel >= ${mysqlConnection.escape(minimumLevel)} AND a.playerlevel <= ${mysqlConnection.escape(maximumLevel)};`;
            queryAndRetry(query, 3)
                .then((result) => {
                resolve(result);
            })
                .catch((err) => {
                reject(err);
            });
        }));
    };
    const getActivityOverview = (questType) => {
        return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
            const query = `SELECT * FROM activity_cached a WHERE a.level ${questType === "heroic" ? "<" : ">="} 20;`;
            queryAndRetry(query, 3)
                .then((result) => {
                resolve(result);
            })
                .catch((err) => {
                reject(err);
            });
        }));
    };
    api.post(`/activity`, (req, res) => {
        res.setHeader("Content-Type", "application/json");
        if (req.body.questid && req.body.minimumlevel && req.body.maximumlevel) {
            getQuestActivity(req.body.questid, req.body.minimumlevel, req.body.maximumlevel).then((result) => {
                res.send(result);
            });
        }
        else if (req.body.questtype) {
            getActivityOverview(req.body.questtype).then((result) => {
                res.send(result);
            });
        }
        else {
            res.send({
                error: "Invalid payload",
            });
        }
    });
};
exports.default = activityApi;
