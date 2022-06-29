var mysql = require("mysql2");
var con = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
});

module.exports = function (api) {
    const servers = [
        ["argonnessen"],
        ["cannith"],
        ["ghallanda"],
        ["khyber"],
        ["orien"],
        ["sarlona"],
        ["thelanis"],
        ["wayfinder"],
        ["hardcore"],
        ["all"],
        ["megaserver"],
    ];

    con.connect((err) => {
        if (err) console.log(err);
        console.log("Groups API connected to the database");

        function getGroupData(server, final) {
            return new Promise(async (resolve, reject) => {
                let query = `SELECT ${
                    server == "all" || server == "megaserver" ? "*" : server
                } FROM \`groups\` ORDER BY \`groups\`.\`datetime\` DESC LIMIT 1;`;
                con.query(query, (err, result, fields) => {
                    if (err) {
                        if (final) {
                            console.log(query);
                            console.log("Failed to reconnect. Aborting!", err);
                            reject(err);
                        } else {
                            console.log("Attempting to reconnect...", err);
                            // Try to reconnect:
                            con = mysql.createConnection({
                                host: process.env.DB_HOST,
                                user: process.env.DB_USER,
                                password: process.env.DB_PASS,
                                database: process.env.DB_NAME,
                            });
                            getGroupData(server, true)
                                .then((result) => {
                                    console.log("Reconnected!");
                                    if (server == "all") {
                                        resolve([
                                            JSON.parse(
                                                result[0]["argonnessen"]
                                            ),
                                            JSON.parse(result[0]["cannith"]),
                                            JSON.parse(result[0]["ghallanda"]),
                                            JSON.parse(result[0]["khyber"]),
                                            JSON.parse(result[0]["orien"]),
                                            JSON.parse(result[0]["sarlona"]),
                                            JSON.parse(result[0]["thelanis"]),
                                            JSON.parse(result[0]["wayfinder"]),
                                            JSON.parse(result[0]["hardcore"]),
                                        ]);
                                    } else {
                                        resolve(result[0][server]);
                                    }
                                })
                                .catch((err) => reject(err));
                        }
                    } else {
                        if (result == null) {
                            reject("null data");
                        } else {
                            if (server == "all") {
                                if (result && result[0]) {
                                    resolve([
                                        JSON.parse(
                                            result[0] != null
                                                ? result[0]["argonnessen"]
                                                : {}
                                        ),
                                        JSON.parse(
                                            result[0] != null
                                                ? result[0]["cannith"]
                                                : {}
                                        ),
                                        JSON.parse(
                                            result[0] != null
                                                ? result[0]["ghallanda"]
                                                : {}
                                        ),
                                        JSON.parse(
                                            result[0] != null
                                                ? result[0]["khyber"]
                                                : {}
                                        ),
                                        JSON.parse(
                                            result[0] != null
                                                ? result[0]["orien"]
                                                : {}
                                        ),
                                        JSON.parse(
                                            result[0] != null
                                                ? result[0]["sarlona"]
                                                : {}
                                        ),
                                        JSON.parse(
                                            result[0] != null
                                                ? result[0]["thelanis"]
                                                : {}
                                        ),
                                        JSON.parse(
                                            result[0] != null
                                                ? result[0]["wayfinder"]
                                                : {}
                                        ),
                                        JSON.parse(
                                            result[0] != null
                                                ? result[0]["hardcore"]
                                                : {}
                                        ),
                                    ]);
                                } else {
                                    reject("null data");
                                }
                            } else {
                                if (
                                    result == undefined ||
                                    result[0] == undefined
                                ) {
                                    reject("null data");
                                } else {
                                    resolve(result[0][server]);
                                }
                            }
                        }
                    }
                });
            });
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
                        res.send("");
                        return {};
                    });
            });
        });
    });
};
