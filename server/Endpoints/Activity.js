var path = require("path");

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
        console.log("Activity API connected to the database");

        function getQuestActivity(questid, minimumlevel, maximumlevel, final) {
            return new Promise(async (resolve, reject) => {
                let activityquery = `SELECT a.playerlevel, a.start, TIME_TO_SEC(TIMEDIFF(end, start)) AS 'duration', a.server FROM activity a WHERE a.questid = ${con.escape(
                    questid
                )} AND a.playerlevel >= ${con.escape(
                    minimumlevel
                )} AND a.playerlevel <= ${con.escape(maximumlevel)};`;
                con.query(activityquery, (err, result, fields) => {
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
                            getQuestActivity(
                                questid,
                                minimumlevel,
                                maximumlevel,
                                true
                            )
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

        function getActivityOverview(questtype, final) {
            return new Promise(async (resolve, reject) => {
                let activityquery = `SELECT * FROM activity_cached a WHERE a.level ${
                    questtype === "heroic" ? "<" : ">="
                } 20;`;
                con.query(activityquery, (err, result, fields) => {
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
                            getActivityOverview(questtype, true)
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

        api.post(`/activity`, (req, res) => {
            res.setHeader("Content-Type", "application/json");
            if (
                req.body.questid &&
                req.body.minimumlevel &&
                req.body.maximumlevel
            ) {
                getQuestActivity(
                    req.body.questid,
                    req.body.minimumlevel,
                    req.body.maximumlevel
                ).then((result) => {
                    res.send(result);
                });
            } else if (req.body.questtype) {
                getActivityOverview(req.body.questtype).then((result) => {
                    res.send(result);
                });
            } else {
                res.send({
                    error: "Invalid payload",
                });
            }
            // getPlayerAndLfmOverview()
            // 	.then((result) => {
            // 		res.send(result);
            // 	})
            // 	.catch((err) => {
            // 		console.log(err);
            // 		return {};
            // 	});
        });
    });
};
