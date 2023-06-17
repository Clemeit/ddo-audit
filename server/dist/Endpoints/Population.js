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
const useQuery_js_1 = __importDefault(require("../common/useQuery.js"));
const populationApi = ({ api, mysqlConnection }) => {
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
    ];
    const populationMap = [
        ["day", "day"],
        ["day_groups", "day_groups"],
        ["week", "week"],
        ["quarter", "quarter"],
        ["quarter_groups", "quarter_groups"],
        ["year", "year"],
        ["year_groups", "year_groups"],
        ["serverdistribution", "serverdistributionquarter"],
        ["serverdistributionmonth", "serverdistributionmonth"],
        ["hourlydistribution", "hourlydistributionquarter"],
        ["dailydistribution", "dailydistributionquarter"],
        ["uniquedata", "uniquedata"],
        ["serverdistribution_groups", "serverdistributionquarter_groups"],
        ["serverdistributionmonth_groups", "serverdistributionmonth_groups"],
        ["hourlydistribution_groups", "hourlydistributionquarter_groups"],
        ["dailydistribution_groups", "dailydistributionquarter_groups"],
        ["quarter_delta", "quarter_delta"],
        ["quarter_groups_delta", "quarter_groups_delta"],
        ["latest", "latest"],
        ["transfercounts", "transfercounts"],
        ["transfersfrom", "transfersfrom"],
        ["transfersto", "transfersto"],
        ["transfercounts_ignorehcl", "transfercounts_ignorehcl"],
        ["transfersfrom_ignorehcl", "transfersfrom_ignorehcl"],
        ["transfersto_ignorehcl", "transfersto_ignorehcl"],
        ["transfercounts_active_ignorehcl", "transfercounts_active_ignorehcl"],
        ["transfersfrom_active_ignorehcl", "transfersfrom_active_ignorehcl"],
        ["transfersto_active_ignorehcl", "transfersto_active_ignorehcl"],
    ];
    populationMap.forEach((entry) => {
        api.get(`/population/${entry[0]}`, (_, res) => {
            res.setHeader("Content-Type", "application/json");
            res.sendFile(path_1.default.resolve(`./api_v1/population/${entry[1]}.json`));
        });
    });
    function lookupStatsByRange(server, startDate, endDate) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            let query = `SELECT \`id\`, \`datetime\`, \`${server}_playercount\`, \`${server}_lfmcount\` FROM \`population\` WHERE \`datetime\` BETWEEN ${mysqlConnection.escape(startDate)} AND ${mysqlConnection.escape(endDate)}`;
            queryAndRetry(query, 3)
                .then((result) => {
                resolve(result);
            })
                .catch((err) => {
                reject(err);
            });
        }));
    }
    api.post(`/population/range`, (req, res) => {
        const server = (req.body.server || "").toLowerCase();
        const startDate = req.body.startDate;
        const endDate = req.body.endDate;
        if (!server || !startDate || !endDate || !servers.includes(server)) {
            res.setHeader("Content-Type", "application/json");
            res.send({ error: "Server, start date, or end date is missing" });
        }
        else {
            // range check
            if (new Date(endDate).getTime() - new Date(startDate).getTime() >
                1000 * 60 * 60 * 24 * 91 // 91 days
            ) {
                res.setHeader("Content-Type", "application/json");
                res.send({ error: "Date range too wide" });
            }
            else {
                lookupStatsByRange(server, startDate, endDate).then((result) => {
                    res.setHeader("Content-Type", "application/json");
                    res.send(result);
                });
            }
        }
    });
};
exports.default = populationApi;
