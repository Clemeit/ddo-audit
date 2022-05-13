var mysql = require("mysql2");
var con = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
});

module.exports = function (api) {
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

    con.connect((err) => {
        if (err) throw err;
        console.log("Players API connected to the database");

        function lookupPlayerByName(name, final) {
            return new Promise(async (resolve, reject) => {
                let query = `SELECT \`players\`.\`name\`, \`players\`.\`server\` FROM \`players\` WHERE name LIKE '${name}'`;

                con.query(query, (err, result, fields) => {
                    if (err) {
                        if (final) {
                            console.log("Failed to reconnect. Aborting!");
                            reject(err);
                        } else {
                            console.log("Attempting to reconnect...");
                            // Try to reconnect:
                            con = mysql.createConnection({
                                host: process.env.DB_HOST,
                                user: process.env.DB_USER,
                                password: process.env.DB_PASS,
                                database: process.env.DB_NAME,
                            });
                            lookupPlayerByName(name, true)
                                .then((result) => {
                                    console.log("Reconnected!");
                                    resolve(result);
                                })
                                .catch((err) => reject(err));
                        }
                    } else {
                        if (result == null) {
                            reject("null data");
                        } else {
                            resolve(result);
                        }
                    }
                });
            });
        }

        function lookupPlayerByNameAndServer(name, server, final) {
            return new Promise(async (resolve, reject) => {
                let query = `SELECT CAST(p.playerid as char) as playerid FROM players p WHERE p.name LIKE ${con.escape(
                    name
                )} AND p.server LIKE ${con.escape(server)} AND p.anonymous = 0`;

                con.query(query, (err, result, fields) => {
                    if (err) {
                        if (final) {
                            console.log("Failed to reconnect. Aborting!");
                            reject(err);
                        } else {
                            console.log("Attempting to reconnect...");
                            // Try to reconnect:
                            con = mysql.createConnection({
                                host: process.env.DB_HOST,
                                user: process.env.DB_USER,
                                password: process.env.DB_PASS,
                                database: process.env.DB_NAME,
                            });
                            lookupPlayerByNameAndServer(name, server, true)
                                .then((result) => {
                                    console.log("Reconnected!");
                                    resolve(result);
                                })
                                .catch((err) => reject(err));
                        }
                    } else {
                        if (result == null) {
                            reject("null data");
                        } else {
                            // const stringId =
                            //     result[0]?.playerid.toString() || "";
                            // result[0].playerid = stringId;
                            resolve(result);
                        }
                    }
                });
            });
        }

        function getPlayerById(id, final) {
            return new Promise(async (resolve, reject) => {
                let query = `SELECT JSON_OBJECT(
                    'Name', p.name,
                    'Gender', p.gender,
                    'Race', p.race,
                    'Guild', IF(p.anonymous, '(redacted)', p.guild),
                    'Location', JSON_OBJECT('Name', IF(p.anonymous, '(redacted)', a.name), 'IsPublicSpace', a.ispublicspace, 'Region', a.region),
                    'TotalLevel', totallevel,
                    'Server', server,
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
                        )
                    ),
                    'Online', p.lastseen > DATE_ADD(UTC_TIMESTAMP(), INTERVAL -90 SECOND),
                    'Anonymous', p.anonymous
                ) AS data FROM \`players\` p
                LEFT JOIN areas a ON p.location = a.areaid 
                LEFT JOIN classes c1 ON p.class1 = c1.id 
                LEFT JOIN classes c2 ON p.class2 = c2.id 
                LEFT JOIN classes c3 ON p.class3 = c3.id 
                LEFT JOIN classes c4 ON p.class4 = c4.id
                WHERE playerid = ${con.escape(id)}`;

                con.query(query, (err, result, fields) => {
                    if (err) {
                        if (final) {
                            console.log("Failed to reconnect. Aborting!");
                            reject(err);
                        } else {
                            console.log("Attempting to reconnect...");
                            // Try to reconnect:
                            con = mysql.createConnection({
                                host: process.env.DB_HOST,
                                user: process.env.DB_USER,
                                password: process.env.DB_PASS,
                                database: process.env.DB_NAME,
                            });
                            getPlayerById(id, true)
                                .then((result) => {
                                    console.log("Reconnected!");
                                    resolve(result);
                                })
                                .catch((err) => reject(err));
                        }
                    } else {
                        if (result == null) {
                            reject("null data");
                        } else {
                            // const stringId =
                            //     result[0]?.playerid.toString() || "";
                            // result[0].playerid = stringId;
                            resolve(result);
                        }
                    }
                });
            });
        }

        function getRecentRaidActivity(id, final) {
            return new Promise(async (resolve, reject) => {
                let query = `SELECT a.questid, TIMESTAMPDIFF(SECOND, UTC_TIMESTAMP(), DATE_ADD(a.end, INTERVAL 3960 MINUTE)) as remaining, q.name FROM activity a LEFT JOIN quests q ON q.questid = a.questid WHERE a.playerid = ${con.escape(
                    id
                )} AND a.end > DATE_ADD(UTC_TIMESTAMP(), INTERVAL -3 DAY) AND q.groupsize = 'Raid'`;

                con.query(query, (err, result, fields) => {
                    if (err) {
                        if (final) {
                            console.log("Failed to reconnect. Aborting!");
                            reject(err);
                        } else {
                            console.log("Attempting to reconnect...");
                            // Try to reconnect:
                            con = mysql.createConnection({
                                host: process.env.DB_HOST,
                                user: process.env.DB_USER,
                                password: process.env.DB_PASS,
                                database: process.env.DB_NAME,
                            });
                            getRecentRaidActivity(id, true)
                                .then((result) => {
                                    console.log("Reconnected!");
                                    resolve(result);
                                })
                                .catch((err) => reject(err));
                        }
                    } else {
                        if (result == null) {
                            reject("null data");
                        } else {
                            resolve(result);
                        }
                    }
                });
            });
        }

        function getCachedPlayerData(server, final) {
            return new Promise(async (resolve, reject) => {
                let query = `SELECT \`${server}\` AS data FROM players_cached ORDER BY \`players_cached\`.\`datetime\` DESC LIMIT 1;`;

                con.query(query, (err, result, fields) => {
                    if (err) {
                        if (final) {
                            console.log("Failed to reconnect. Aborting!");
                            reject(err);
                        } else {
                            console.log("Attempting to reconnect...");
                            // Try to reconnect:
                            con = mysql.createConnection({
                                host: process.env.DB_HOST,
                                user: process.env.DB_USER,
                                password: process.env.DB_PASS,
                                database: process.env.DB_NAME,
                            });
                            getCachedPlayerData(server, true)
                                .then((result) => {
                                    console.log("Reconnected!");
                                    resolve(result);
                                })
                                .catch((err) => reject(err));
                        }
                    } else {
                        if (result == null) {
                            reject("null data");
                        } else {
                            resolve(result[0]["data"]);
                        }
                    }
                });
            });
        }

        function getPlayerData(server, final) {
            return new Promise(async (resolve, reject) => {
                let query = `
                    SELECT JSON_OBJECT(
                        'Name', '${server}',
                        'Population', COUNT(*),
                        'Players', JSON_ARRAYAGG(
                            JSON_OBJECT(
                                'Name', IF(p.anonymous, 'Anonymous', p.name),
                                'Gender', p.gender,
                                'Race', p.race,
                                'Guild', IF(p.anonymous, '(redacted)', p.guild),
                                'Location', JSON_OBJECT('Name', IF(p.anonymous, '(redacted)', a.name), 'IsPublicSpace', a.ispublicspace, 'Region', a.region),
                                'TotalLevel', totallevel,
                                'Server', server,
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
                                    )
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
                    WHERE p.lastseen > DATE_ADD(UTC_TIMESTAMP(), INTERVAL -90 SECOND) AND p.server LIKE '${server}';`;

                con.query(query, (err, result, fields) => {
                    if (err) {
                        if (final) {
                            console.log("Failed to reconnect. Aborting!");
                            reject(err);
                        } else {
                            console.log("Attempting to reconnect...");
                            // Try to reconnect:
                            con = mysql.createConnection({
                                host: process.env.DB_HOST,
                                user: process.env.DB_USER,
                                password: process.env.DB_PASS,
                                database: process.env.DB_NAME,
                            });
                            getPlayerData(server, true)
                                .then((result) => {
                                    console.log("Reconnected!");
                                    resolve(result);
                                })
                                .catch((err) => reject(err));
                        }
                    } else {
                        if (result == null) {
                            reject("null data");
                        } else {
                            resolve(result[0]["data"]);
                        }
                    }
                });
            });
        }

        // function GetDateString(datetime) {
        //     return `${datetime.getUTCFullYear()}-${
        //         datetime.getUTCMonth() + 1
        //     }-${datetime.getUTCDate()} 00-00-00`;
        // }
        // function getAllPlayers(days) {
        //     return new Promise(async (resolve, reject) => {
        //         let players = [];
        //         let query =
        //             "SELECT * FROM `players` WHERE `lastseen` >= '" +
        //             GetDateString(
        //                 new Date(
        //                     new Date(new Date().toDateString()) -
        //                         1000 * 60 * 60 * 24 * days
        //                 )
        //             ) +
        //             "';";
        //         con.query(query, (err, result, fields) => {
        //             if (err) {
        //                 reject(err);
        //             } else {
        //                 result.forEach((player) => {
        //                     players.push(player);
        //                 });

        //                 resolve(players);
        //             }
        //         });
        //     });
        // }

        servers.forEach((entry) => {
            api.get(`/players/${entry[1]}`, (req, res) => {
                res.setHeader("Content-Type", "application/json");
                getPlayerData(entry[0])
                    .then((result) => {
                        res.send(result);
                    })
                    .catch((err) => {
                        console.log(err);
                        return {};
                    });
            });
        });

        servers.forEach((entry) => {
            api.get(`/players_cached/${entry[1]}`, (req, res) => {
                res.setHeader("Content-Type", "application/json");
                getCachedPlayerData(entry[0])
                    .then((result) => {
                        res.send(result);
                    })
                    .catch((err) => {
                        console.log(err);
                        return {};
                    });
            });
        });

        api.get("/players/dev", (req, res) => {
            res.setHeader("Content-Type", "application/json");
            getAllPlayers(1)
                .then((result) => {
                    res.send(result);
                })
                .catch((err) => {
                    console.log(err);
                    res.send("");
                });
        });

        api.post(`/players/raidactivity`, (req, res) => {
            const id = req.body.playerid;
            res.setHeader("Content-Type", "application/json");
            if (id) {
                getRecentRaidActivity(id).then((result) => {
                    res.send(result);
                });
            } else {
                res.send({ error: "No player id found" });
            }
        });

        api.post(`/players/name`, (req, res) => {
            lookupPlayerByName(req.body.name).then((result) => {
                if (result.length > 10) {
                    res.setHeader("Content-Type", "application/json");
                    res.send({ error: "Too many matches" });
                } else {
                    res.setHeader("Content-Type", "application/json");
                    res.send(result);
                }
            });
        });

        api.post(`/players/lookup`, (req, res) => {
            const name = req.body.name;
            const server = req.body.server;
            const id = req.body.playerid;
            if (id) {
                getPlayerById(id || 0).then((result) => {
                    res.setHeader("Content-Type", "application/json");
                    if (!result || result.length !== 1) {
                        res.send({ error: "No result for playerid" });
                    } else {
                        res.send(result[0].data);
                    }
                });
            } else {
                if (!name || !server) {
                    res.setHeader("Content-Type", "application/json");
                    res.send({ error: "Must include name and server" });
                } else {
                    lookupPlayerByNameAndServer(name, server).then((result) => {
                        res.setHeader("Content-Type", "application/json");
                        res.send(result);
                    });
                }
            }
        });
    });
};
