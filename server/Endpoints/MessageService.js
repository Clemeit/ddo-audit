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
        console.log("Message Service API connected to the database");

        function getNews(final) {
            return new Promise(async (resolve, reject) => {
                let classquery = `SELECT * from \`news\`;`;
                con.query(classquery, (err, result, fields) => {
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
                            getNews(true)
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

        function getMessages(final) {
            return new Promise(async (resolve, reject) => {
                let classquery = `SELECT * from \`public_messages\`;`;
                con.query(classquery, (err, result, fields) => {
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
                            getMessages(true)
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

        api.get(`/news`, (req, res) => {
            res.setHeader("Content-Type", "application/json");
            getNews()
                .then((result) => {
                    res.send(result);
                })
                .catch((err) => {
                    console.log(err);
                    return {};
                });
        });

        api.get(`/messageservice`, (req, res) => {
            res.setHeader("Content-Type", "application/json");
            getMessages()
                .then((result) => {
                    res.send(result);
                })
                .catch((err) => {
                    console.log(err);
                    return {};
                });
        });
    });
};
