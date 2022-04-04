var mysql = require("mysql2");
var con = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
});

module.exports = function (api) {
    con.connect((err) => {
        if (err) throw err;
        console.log("Friends API connected to the database");

        function lookupPlayerByName(body, final) {
            return new Promise(async (resolve, reject) => {
                const re = /^(?!-+$)[a-z-]+$/i;
                let cname = body.name;
                let goodrequest = re.test(cname);
                cname = body.name;

                if (goodrequest) {
                    let query = `SELECT JSON_ARRAYAGG(JSON_OBJECT(
                            'Name', IF(p.anonymous, 'Anonymous', p.name),
                            'Gender', p.gender,
                            'Race', p.race,
                            'Guild', IF(p.anonymous, '(redacted)', p.guild),
                            'Location', JSON_OBJECT('Name', IF(p.anonymous, '(redacted)', a.name), 'IsPublicSpace', a.ispublicspace, 'Region', a.region),
                            'TotalLevel', totallevel,
                            'Server', server,
                            'GroupId', groupid,
                            'InParty', IF(groupid = 0, 0, 1),
                            'Online', IF(p.lastseen > DATE_ADD(UTC_TIMESTAMP(), INTERVAL -70 SECOND), true, false),
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
                        )) as data
                        FROM \`players\` p
                        LEFT JOIN areas a ON p.location = a.areaid 
                        LEFT JOIN classes c1 ON p.class1 = c1.id 
                        LEFT JOIN classes c2 ON p.class2 = c2.id 
                        LEFT JOIN classes c3 ON p.class3 = c3.id 
                        LEFT JOIN classes c4 ON p.class4 = c4.id 
                        WHERE p.name LIKE '%${cname}%'
                        LIMIT 10;`;

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
                                lookupPlayerByName(body, true)
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
                }
            });
        }

        function lookupPlayersById(body, final) {
            return new Promise(async (resolve, reject) => {
                let pids = body.ids;
                let goodrequest = true;
                let pidformat = [];
                pids.forEach((pid) => {
                    if (isNaN(pid)) {
                        goodrequest = false;
                    } else {
                        pidformat.push(`\`playerid\` = ${pid}`);
                    }
                });

                if (goodrequest) {
                    if (!pids || !pids.length) {
                        reject("bad format");
                    } else {
                        let query = `SELECT JSON_ARRAYAGG(JSON_OBJECT(
                            'Name', IF(p.anonymous, 'Anonymous', p.name),
                            'Gender', p.gender,
                            'Race', p.race,
                            'Guild', IF(p.anonymous, '(redacted)', p.guild),
                            'Location', JSON_OBJECT('Name', IF(p.anonymous, '(redacted)', a.name), 'IsPublicSpace', a.ispublicspace, 'Region', a.region),
                            'TotalLevel', totallevel,
                            'Server', server,
                            'GroupId', groupid,
                            'InParty', IF(groupid = 0, 0, 1),
                            'Online', IF(p.lastseen > DATE_ADD(UTC_TIMESTAMP(), INTERVAL -70 SECOND), true, false),
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
                        )) as data
                        FROM \`players\` p
                        LEFT JOIN areas a ON p.location = a.areaid 
                        LEFT JOIN classes c1 ON p.class1 = c1.id 
                        LEFT JOIN classes c2 ON p.class2 = c2.id 
                        LEFT JOIN classes c3 ON p.class3 = c3.id 
                        LEFT JOIN classes c4 ON p.class4 = c4.id 
                        WHERE ${pidformat.join(" OR ")};`;

                        con.query(query, (err, result, fields) => {
                            if (err) {
                                if (final) {
                                    console.log(
                                        "Failed to reconnect. Aborting!"
                                    );
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
                                    lookupPlayersById(body, true)
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
                    }
                }
            });
        }

        api.post(`/friends`, (req, res) => {
            lookupPlayersById(req.body).then((result) => {
                res.setHeader("Content-Type", "application/json");
                res.send(result[0]["data"]);
            });
        });

        api.post(`/friends/add`, (req, res) => {
            lookupPlayerByName(req.body).then((result) => {
                if (result.length > 10) {
                    res.setHeader("Content-Type", "application/json");
                    res.send({ error: "Too many matches" });
                } else {
                    res.setHeader("Content-Type", "application/json");
                    res.send(result[0]["data"]);
                }
            });
        });
    });
};
