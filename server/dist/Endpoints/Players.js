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
const crypto_js_1 = __importDefault(require("crypto-js"));
const useQuery_js_1 = __importDefault(require("../common/useQuery.js"));
const SECRET = process.env.CRYPTO_PASS;
const playersApi = ({ api, mysqlConnection }) => {
    const { queryAndRetry } = (0, useQuery_js_1.default)({ mysqlConnection });
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
    const encryptId = (playerId) => {
        return crypto_js_1.default.AES.encrypt(playerId, crypto_js_1.default.enc.Utf8.parse(SECRET), {
            mode: crypto_js_1.default.mode.ECB,
        }).toString();
    };
    const decryptId = (encryptedString) => {
        return crypto_js_1.default.AES.decrypt(encryptedString, crypto_js_1.default.enc.Utf8.parse(SECRET), {
            mode: crypto_js_1.default.mode.ECB,
        }).toString(crypto_js_1.default.enc.Utf8);
    };
    const lookupPlayerByName = (name) => {
        return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
            let query = `SELECT \`players\`.\`name\`, \`players\`.\`server\` FROM \`players\` WHERE name LIKE '${name}'`;
            queryAndRetry(query, 3)
                .then((result) => {
                resolve(result);
            })
                .catch((err) => {
                reject(err);
            });
        }));
    };
    const lookupPlayerByNameAndServer = (name, server) => {
        return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
            let query = `SELECT CAST(p.playerid as char) as playerid, p.lastseen, p.anonymous FROM players p WHERE p.name LIKE ${mysqlConnection.escape(name)} AND p.server LIKE ${mysqlConnection.escape(server)}`;
            queryAndRetry(query, 3)
                .then((result) => {
                resolve(result);
            })
                .catch((err) => {
                reject(err);
            });
        }));
    };
    const lookupAllPlayersByName = (name) => {
        return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
            let query = `SELECT JSON_ARRAYAGG(JSON_OBJECT(
                    'PlayerId', CAST(p.playerid as char),
                    'Name', p.name,
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
                    ),
                    'Online', p.lastseen > DATE_ADD(UTC_TIMESTAMP(), INTERVAL -90 SECOND),
                    'Anonymous', p.anonymous
                )) AS data FROM \`players\` p
                LEFT JOIN areas a ON p.location = a.areaid 
                LEFT JOIN classes c1 ON p.class1 = c1.id 
                LEFT JOIN classes c2 ON p.class2 = c2.id 
                LEFT JOIN classes c3 ON p.class3 = c3.id 
                LEFT JOIN classes c4 ON p.class4 = c4.id 
                LEFT JOIN classes c5 ON p.class5 = c5.id
                WHERE p.name LIKE ${mysqlConnection.escape(name)} AND p.anonymous = 0 ORDER BY p.lastseen DESC LIMIT 10`;
            queryAndRetry(query, 3)
                .then((result) => {
                resolve(result);
            })
                .catch((err) => {
                reject(err);
            });
        }));
    };
    const lookupAllGuildsByName = (name) => {
        return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
            let query = `SELECT * FROM \`guilds_cached\` g WHERE g.name LIKE ${mysqlConnection.escape(name)}`;
            queryAndRetry(query, 3)
                .then((result) => {
                resolve(result);
            })
                .catch((err) => {
                reject(err);
            });
        }));
    };
    const getPlayersByIds = (ids) => {
        return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
            let escapedIds = [];
            ids.forEach((id) => {
                escapedIds.push(mysqlConnection.escape(id));
            });
            let query = `SELECT JSON_ARRAYAGG(JSON_OBJECT(
                    'PlayerId', CAST(p.playerid as char),
                    'Name', p.name,
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
                    ),
                    'Online', p.lastseen > DATE_ADD(UTC_TIMESTAMP(), INTERVAL -90 SECOND),
                    'Anonymous', p.anonymous
                )) AS data FROM \`players\` p
                LEFT JOIN areas a ON p.location = a.areaid 
                LEFT JOIN classes c1 ON p.class1 = c1.id 
                LEFT JOIN classes c2 ON p.class2 = c2.id 
                LEFT JOIN classes c3 ON p.class3 = c3.id 
                LEFT JOIN classes c4 ON p.class4 = c4.id 
                LEFT JOIN classes c5 ON p.class5 = c5.id
                WHERE playerid = ${escapedIds.join(" OR playerid = ")}`;
            queryAndRetry(query, 3)
                .then((result) => {
                resolve(result);
            })
                .catch((err) => {
                reject(err);
            });
        }));
    };
    const getRecentRaidActivity = (id) => {
        return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
            let query = `SELECT a.questid, TIMESTAMPDIFF(SECOND, UTC_TIMESTAMP(), DATE_ADD(a.end, INTERVAL 3960 MINUTE)) as remaining, q.name, a.id FROM activity a LEFT JOIN quests q ON q.questid = a.questid WHERE a.playerid = ${mysqlConnection.escape(id)} AND a.end > DATE_ADD(UTC_TIMESTAMP(), INTERVAL -66 HOUR) AND q.groupsize = 'Raid'`;
            queryAndRetry(query, 3)
                .then((result) => {
                resolve(result);
            })
                .catch((err) => {
                reject(err);
            });
        }));
    };
    const getCachedPlayerData = (server) => {
        return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
            let query = `SELECT \`${server}\` AS data FROM players_cached ORDER BY \`players_cached\`.\`datetime\` DESC LIMIT 1;`;
            queryAndRetry(query, 3)
                .then((result) => {
                if (result && result[0] && result[0]["data"]) {
                    resolve(result[0]["data"]);
                }
                else {
                    reject({ error: "No data found" });
                }
            })
                .catch((err) => {
                reject(err);
            });
        }));
    };
    const lookupPlayersByGuild = (body) => {
        return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
            const re = /^[a-z0-9- ]+$/i;
            let gname = body.guild;
            let gserver = body.server;
            let goodrequest = re.test(gname) && re.test(gserver);
            gname = body.guild;
            gserver = body.server;
            if (goodrequest) {
                let query = `SELECT CAST(p.playerid AS CHAR) as playerid 
                        FROM \`players\` p 
                        WHERE p.anonymous = 0 AND p.name != 'Anonymous' AND p.server = ${mysqlConnection.escape(gserver)} AND p.guild = ${mysqlConnection.escape(gname)} 
                        ORDER BY p.lastseen DESC 
                        LIMIT 50;`;
                queryAndRetry(query, 3)
                    .then((result) => {
                    resolve(result);
                })
                    .catch((err) => {
                    reject(err);
                });
            }
            else {
                reject("bad name");
            }
        }));
    };
    servers.forEach((entry) => {
        api.get(`/players/${entry[1]}`, (req, res) => {
            res.setHeader("Content-Type", "application/json");
            getCachedPlayerData(entry[0])
                .then((result) => {
                res.send(result);
            })
                .catch((err) => {
                console.log(err);
                res.send({});
            });
        });
        api.get(`/players_cached/${entry[1]}`, (req, res) => {
            res.setHeader("Content-Type", "application/json");
            getCachedPlayerData(entry[0])
                .then((result) => {
                res.send(result);
            })
                .catch((err) => {
                console.log(err);
                res.send({});
            });
        });
    });
    api.post(`/players/raidactivity`, (req, res) => {
        const id = req.body.playerid;
        const decryptedPlayerId = decryptId(id);
        res.setHeader("Content-Type", "application/json");
        if (id) {
            getRecentRaidActivity(decryptedPlayerId).then((result) => {
                res.send(result);
            });
        }
        else {
            res.send({ error: "No player with that id found" });
        }
    });
    // deprecated
    api.post(`/players/name`, (req, res) => {
        lookupPlayerByName(req.body.name).then((result) => {
            if (result.length > 10) {
                res.setHeader("Content-Type", "application/json");
                res.send({ error: "Too many matches" });
            }
            else {
                res.setHeader("Content-Type", "application/json");
                res.send(result);
            }
        });
    });
    api.post(`/guilds/lookup`, (req, res) => {
        res.setHeader("Content-Type", "application/json");
        lookupPlayersByGuild(req.body)
            .then((result) => {
            if (result && result.length > 0) {
                let returnArray = [];
                result.forEach((pidObject) => {
                    returnArray.push(encryptId(pidObject.playerid));
                });
                res.send(returnArray);
            }
            else {
                res.send({ error: "no results" });
            }
        })
            .catch(() => {
            res.send({ error: "bad request" });
        });
    });
    api.post(`/players/lookup`, (req, res) => {
        const name = req.body.name;
        const server = req.body.server;
        const id = req.body.playerid;
        const ids = req.body.playerids;
        const guild = req.body.guild;
        if (id || ids) {
            res.setHeader("Content-Type", "application/json");
            let decryptedPlayerIds = [];
            if (id) {
                if (id.length === 44) {
                    decryptedPlayerIds.push(decryptId(id));
                }
                else {
                    res.send({ error: "Bad id length" });
                    return;
                }
            }
            else if (ids) {
                ids.forEach((encryptedId) => {
                    if (encryptedId.length === 44) {
                        decryptedPlayerIds.push(decryptId(encryptedId));
                    }
                });
            }
            if (!decryptedPlayerIds || decryptedPlayerIds.length === 0) {
                res.send({ error: "No playerids found" });
                return;
            }
            getPlayersByIds(decryptedPlayerIds).then((result) => {
                if (!result || result.length !== 1) {
                    res.send({ error: "No result for playerid" });
                }
                else {
                    result[0].data.forEach((player) => {
                        player.PlayerId = encryptId(player.PlayerId);
                    });
                    res.send(result[0].data);
                }
            });
        }
        else {
            if (!name) {
                res.setHeader("Content-Type", "application/json");
                res.send({ error: "Must include name" });
            }
            else if (name && !server) {
                let returnData = {
                    players: [],
                    guilds: [],
                };
                lookupAllPlayersByName(name)
                    .then((playerresult) => {
                    if (playerresult.length === 1 && playerresult[0].data !== null) {
                        playerresult[0].data.forEach((player) => {
                            player.PlayerId = encryptId(player.PlayerId);
                        });
                        returnData.players = playerresult[0].data;
                    }
                })
                    .finally(() => {
                    if (guild != null) {
                        lookupAllGuildsByName(guild)
                            .then((guildresult) => {
                            returnData.guilds = guildresult;
                        })
                            .finally(() => {
                            res.setHeader("Content-Type", "application/json");
                            res.send(returnData);
                        });
                    }
                    else {
                        res.setHeader("Content-Type", "application/json");
                        res.send(returnData.players);
                    }
                });
            }
            else {
                lookupPlayerByNameAndServer(name, server).then((result) => {
                    if (result.length === 1) {
                        res.setHeader("Content-Type", "application/json");
                        if (result[0].anonymous === 1) {
                            res.send({ error: "Anonymous" });
                        }
                        else {
                            const playerId = encryptId(result[0].playerid);
                            res.send({ playerid: playerId });
                        }
                    }
                    else if (result.length > 1) {
                        res.setHeader("Content-Type", "application/json");
                        const sorted = result.sort((a, b) => b.lastseen - a.lastseen);
                        if (sorted[0].anonymous === 1) {
                            res.send({ error: "Anonymous" });
                        }
                        else {
                            const playerId = encryptId(sorted[0].playerid);
                            res.send({ playerid: playerId });
                        }
                    }
                    else {
                        res.send({ error: "Bad result length" });
                    }
                });
            }
        }
    });
};
exports.default = playersApi;
