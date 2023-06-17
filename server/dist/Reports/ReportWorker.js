"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const node_cron_1 = __importDefault(require("node-cron"));
const useQuery_js_1 = __importDefault(require("../common/useQuery.js"));
// Get data once, then run all of the reports using that data...
const ClassDistribution_js_1 = __importDefault(require("./Demographics/ClassDistribution.js"));
const RaceDistribution_js_1 = __importDefault(require("./Demographics/RaceDistribution.js"));
const LevelDistribution_js_1 = __importDefault(require("./Demographics/LevelDistribution.js"));
const Annual_js_1 = __importDefault(require("./Population/Annual.js"));
const Quarter_js_1 = __importDefault(require("./Population/Quarter.js"));
const Week_js_1 = __importDefault(require("./Population/Week.js"));
const Day_js_1 = __importDefault(require("./Population/Day.js"));
const DeltaReport_js_1 = __importDefault(require("./Population/DeltaReport.js"));
const DailyDistribution_js_1 = __importDefault(require("./Population/DailyDistribution.js"));
const HourlyDistribution_js_1 = __importDefault(require("./Population/HourlyDistribution.js"));
const ServerDistribution_js_1 = __importDefault(require("./Population/ServerDistribution.js"));
const UniqueCounts_js_1 = __importDefault(require("./Population/UniqueCounts.js"));
const Transfer_js_1 = __importDefault(require("./Population/Transfer.js"));
const Players_js_1 = __importDefault(require("./Players/Players.js"));
const ServerStatus_js_1 = __importDefault(require("./Game/ServerStatus.js"));
const mysql2_1 = __importDefault(require("mysql2"));
const dotenv = __importStar(require("dotenv"));
dotenv.config();
let mysqlConnection;
function restartMySql() {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
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
                    resolve(mysqlConnection);
                }
            });
            mysqlConnection.on("error", (err) => {
                if (err.code === "PROTOCOL_CONNECTION_LOST") {
                    console.log("MySQL connection lost. Reconnecting...");
                    restartMySql();
                }
                else {
                    console.log("MySQL connection error:", err);
                    restartMySql();
                }
            });
        });
    });
}
function runReportWorker(mysqlConnection) {
    const { queryAndRetry } = (0, useQuery_js_1.default)({ mysqlConnection });
    console.log("Running report worker...");
    function GetDateString(datetime) {
        return `${datetime.getUTCFullYear()}-${datetime.getUTCMonth() + 1}-${datetime.getUTCDate()} 00-00-00`;
    }
    // Get class data:
    let classes = [];
    function getClassData() {
        return new Promise((resolve, reject) => {
            classes.length = 0;
            const query = "SELECT * FROM `classes` ORDER BY `classes`.`name` ASC;";
            queryAndRetry(query, 3)
                .then((result) => {
                result.forEach(({ id, name }) => {
                    if (name !== "Epic" && name !== "Legendary")
                        classes.push({
                            id,
                            name,
                        });
                });
                console.log(`Retrieved ${classes.length} classes`);
                resolve();
            })
                .catch((err) => {
                console.log("Error getting class data!", err);
                reject(err);
            });
        });
    }
    // Get race data:
    let races = [];
    function getRaceData() {
        return new Promise((resolve, reject) => {
            races.length = 0;
            const query = "SELECT * FROM `races` ORDER BY `races`.`name` ASC;";
            queryAndRetry(query, 3)
                .then((result) => {
                result.forEach(({ name }) => {
                    races.push(name);
                });
                let output = [];
                races.forEach((race) => {
                    output.push({
                        id: race,
                        label: race,
                        value: 0,
                    });
                });
                console.log(`Retrieved ${races.length} races`);
                resolve();
            })
                .catch((err) => {
                console.log("Error getting race data!", err);
                reject(err);
            });
        });
    }
    // Get player data:
    let players = [];
    function getPlayerData(days) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            let query = "SELECT * FROM `players` WHERE `lastseen` >= '" +
                GetDateString(new Date(new Date(new Date().toDateString()) - 1000 * 60 * 60 * 24 * days)) +
                "';";
            queryAndRetry(query, 3)
                .then((result) => {
                players.length = 0;
                result.forEach((player) => {
                    players.push(player);
                });
                console.log(`Retrieved ${players.length} players`);
                resolve();
            })
                .catch((err) => {
                console.log("Error getting player data!", err);
                reject(err);
            });
        }));
    }
    // Get player data to be cached for API:
    let cacheablePlayers = [];
    function getCacheablePlayerData(seconds) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const query = `SELECT JSON_ARRAYAGG(
											JSON_OBJECT(
													'Name', IF(p.anonymous, 'Anonymous', p.name),
													'Gender', p.gender,
													'Race', p.race,
													'Guild', IF(p.anonymous, '(redacted)', p.guild),
													'Location', JSON_OBJECT('Name', IF(p.anonymous, '(redacted)', a.name), 'IsPublicSpace', a.ispublicspace, 'Region', a.region),
													'TotalLevel', totallevel,
													'Server', server,
							'HomeServer', homeserver,
													'GroupId', groupid,
													'InParty', IF(groupid = 0, 0, 1),
													'Classes', JSON_ARRAY(
															JSON_OBJECT(
																	'Name', c1.name,
																	'Level', p.level1
															),
															JSON_OBJECT(
																	'Name', c2.name,
																	'Level', p.level2
															),
															JSON_OBJECT(
																	'Name', c3.name,
																	'Level', p.level3
															),
															JSON_OBJECT(
																	'Name', c4.name,
																	'Level', p.level4
															),
															JSON_OBJECT(
																	'Name', c5.name,
																	'Level', p.level5
															)
													)
											)
									) AS data
									FROM players p 
									LEFT JOIN areas a ON p.location = a.areaid 
									LEFT JOIN classes c1 ON p.class1 = c1.id 
									LEFT JOIN classes c2 ON p.class2 = c2.id 
									LEFT JOIN classes c3 ON p.class3 = c3.id 
									LEFT JOIN classes c4 ON p.class4 = c4.id 
									LEFT JOIN classes c5 ON p.class5 = c5.id 
									WHERE p.lastseen > DATE_ADD(UTC_TIMESTAMP(), INTERVAL -${seconds} SECOND)`;
            queryAndRetry(query, 3)
                .then((result) => {
                if (result && result.length && result[0]["data"]) {
                    cacheablePlayers = result[0]["data"];
                }
                else {
                    cacheablePlayers = [];
                }
                console.log(`Retrieved ${cacheablePlayers.length} players`);
                resolve();
            })
                .catch((err) => {
                console.log("Error getting player data!", err);
                reject(err);
            });
        }));
    }
    function cachePlayerData(servers) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            // prettier-ignore
            const query = `INSERT INTO players_cached (datetime, argonnessen, cannith, ghallanda, khyber, orien, sarlona, thelanis, wayfinder, hardcore)
													 VALUES (CURRENT_TIMESTAMP, ${mysqlConnection.escape(JSON.stringify(servers[0]))}, ${mysqlConnection.escape(JSON.stringify(servers[1]))}, ${mysqlConnection.escape(JSON.stringify(servers[2]))}
													 , ${mysqlConnection.escape(JSON.stringify(servers[3]))}, ${mysqlConnection.escape(JSON.stringify(servers[4]))}, ${mysqlConnection.escape(JSON.stringify(servers[5]))}, ${mysqlConnection.escape(JSON.stringify(servers[6]))}
													 , ${mysqlConnection.escape(JSON.stringify(servers[7]))}, ${mysqlConnection.escape(JSON.stringify(servers[8]))})`;
            queryAndRetry(query, 1)
                .then(() => {
                resolve();
            })
                .catch((err) => {
                console.log("Error caching player data!", err);
                reject(err);
            });
        }));
    }
    let population = [];
    function getPopulationData(days) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            population.length = 0;
            const query = "SELECT * FROM `population` WHERE `datetime` >= '" +
                GetDateString(new Date(new Date().getTime() - 60000 * 60 * 24 * days)) +
                "' ORDER BY `population`.`datetime` ASC;";
            queryAndRetry(query, 3)
                .then((result) => {
                result.forEach((data) => {
                    data.datetime = new Date(data.datetime + "Z");
                    population.push(data);
                });
                console.log(`Retrieved ${population.length} population data points`);
                resolve();
            })
                .catch((err) => {
                console.log("Error getting population data!", err);
                reject(err);
            });
        }));
    }
    // Every week
    node_cron_1.default.schedule("0 * * * 0", () => {
        getPopulationData(365 * 5).then(() => {
            (0, Annual_js_1.default)(population, "players");
            (0, Annual_js_1.default)(population, "lfms");
            (0, Quarter_js_1.default)(population, "players");
            (0, Quarter_js_1.default)(population, "lfms");
            (0, Week_js_1.default)(population);
            (0, DailyDistribution_js_1.default)(population);
            (0, HourlyDistribution_js_1.default)(population);
            (0, ServerDistribution_js_1.default)(population);
        });
    });
    // Every day
    node_cron_1.default.schedule("0 0 * * 1-6", () => {
        getPopulationData(365).then(() => {
            (0, Quarter_js_1.default)(population, "players").then((val) => {
                (0, DeltaReport_js_1.default)(val, "players");
            });
            (0, Quarter_js_1.default)(population, "groups").then((val) => {
                (0, DeltaReport_js_1.default)(val, "groups");
            });
            (0, Week_js_1.default)(population);
            (0, DailyDistribution_js_1.default)(population, "population");
            (0, HourlyDistribution_js_1.default)(population, "population");
            (0, ServerDistribution_js_1.default)(population, "population");
            (0, DailyDistribution_js_1.default)(population, "groups");
            (0, HourlyDistribution_js_1.default)(population, "groups");
            (0, ServerDistribution_js_1.default)(population, "groups");
        });
        Promise.all([getClassData(), getRaceData()]).then(() => {
            getPlayerData(91).then(() => {
                (0, ClassDistribution_js_1.default)(players, classes, "normal");
                (0, RaceDistribution_js_1.default)(players, races, "normal");
                (0, LevelDistribution_js_1.default)(players, "normal");
                (0, ClassDistribution_js_1.default)(players, classes, "banks");
                (0, RaceDistribution_js_1.default)(players, races, "banks");
                (0, LevelDistribution_js_1.default)(players, "banks");
                (0, UniqueCounts_js_1.default)(players);
            });
        });
    });
    // Every hour (not midnight because we get duplicate data)
    node_cron_1.default.schedule("0 1-23 * * *", () => {
        getPlayerData(91).then(() => {
            (0, Transfer_js_1.default)(players);
        });
    });
    // Every 5 minutes
    node_cron_1.default.schedule("1-56/5 * * * *", () => {
        getPopulationData(1).then(() => {
            (0, Day_js_1.default)(population, "population");
            (0, Day_js_1.default)(population, "groups");
        });
    });
    // Every minute
    node_cron_1.default.schedule("* * * * *", () => {
        (0, ServerStatus_js_1.default)();
        // cache players so that the API can pull from cache instead of master
        var t0 = new Date();
        console.log(`Caching player data`);
        getCacheablePlayerData(90)
            .then(() => {
            if (cacheablePlayers == null || cacheablePlayers.length === 0) {
                var t1 = new Date();
                console.log(`-> Finished in ${t1 - t0}ms (NO PLAYERS!)`);
            }
            else {
                (0, Players_js_1.default)(cacheablePlayers).then((servers) => cachePlayerData(servers).then(() => {
                    var t1 = new Date();
                    console.log(`-> Finished in ${t1 - t0}ms`);
                }));
            }
        })
            .catch((err) => console.log(err));
    });
}
restartMySql().then((result) => {
    runReportWorker(result);
});
