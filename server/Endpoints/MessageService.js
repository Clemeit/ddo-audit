var mysql = require("mysql2");
var requestIp = require("request-ip");
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

        function getMarkedEvents(final) {
            return new Promise(async (resolve, reject) => {
                let classquery = `SELECT * from \`marked_events\`;`;
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
                            getMarkedEvents(true)
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

        function submitMessage(message, ipaddress) {
            return new Promise(async (resolve, reject) => {
                if (message == null) {
                    reject();
                } else {
                    let classquery = `INSERT INTO \`feedback\` (\`datetime\`, \`ip\`, \`browser\`, \`title\`, \`comment\`, \`resolved\`) VALUES (CURRENT_TIMESTAMP, ${con.escape(
                        ipaddress || ""
                    )}, ${con.escape(message.browser) || ""}, ${
                        con.escape(message.title) || ""
                    }, ${con.escape(message.comment) || ""}, '0');`;
                    con.query(classquery, (err, result, fields) => {
                        if (err) {
                            reject(err);
                        } else {
                            resolve();
                        }
                    });
                }
            });
        }

        function logEvent(event, ipaddress) {
            return new Promise(async (resolve, reject) => {
                if (event == null) {
                    reject();
                } else {
                    let classquery = `INSERT INTO \`log\` (\`datetime\`, \`ip\`, \`event\`, \`meta\`) VALUES (CURRENT_TIMESTAMP, ${con.escape(
                        ipaddress || ""
                    )}, ${con.escape(event.event) || ""}, ${
                        con.escape(event.meta) || ""
                    });`;
                    con.query(classquery, (err, result, fields) => {
                        if (err) {
                            reject(err);
                        } else {
                            resolve();
                        }
                    });
                }
            });
        }

        api.get(`/markedevents`, (req, res) => {
            res.setHeader("Content-Type", "application/json");
            getMarkedEvents()
                .then((result) => {
                    res.send(result);
                })
                .catch((err) => {
                    console.log(err);
                    return {};
                });
        });

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

        api.post(`/submitmessage`, (req, res) => {
            var clientIp = requestIp.getClientIp(req);
            res.setHeader("Content-Type", "application/json");
            submitMessage(req.body, clientIp)
                .then((result) => {
                    res.send({ state: "Success" });
                })
                .catch((err) => {
                    console.log("Failed to post message:", err);
                    res.send({ state: "Failed" });
                });
        });

        api.post(`/log`, (req, res) => {
            var clientIp = requestIp.getClientIp(req);
            res.setHeader("Content-Type", "application/json");
            logEvent(req.body, clientIp)
                .then((result) => {
                    res.send({ state: "Success" });
                })
                .catch((err) => {
                    console.log("Failed to log event:", err);
                    res.send({ state: "Failed" });
                });
        });
    });
};
