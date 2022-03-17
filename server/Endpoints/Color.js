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
        console.log("Color API connected to the database");

        function getColor(final) {
            return new Promise(async (resolve, reject) => {
                let classquery = `SELECT \`color\` from \`colors\` WHERE \`device\` = 'desk';`;
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
                            getColor(true)
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
                            resolve(result[0]["color"]);
                        }
                    }
                });
            });
        }

        api.get(`/iot/color`, (req, res) => {
            res.setHeader("Content-Type", "application/json");
            getColor()
                .then((result) => {
                    res.send({ Color: result });
                })
                .catch((err) => {
                    console.log(err);
                    res.send({ Color: "00FFFF00" });
                });
        });
    });
};
