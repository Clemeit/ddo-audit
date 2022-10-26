var path = require("path");

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
		console.log("CaaS API connected to the database");

		function getValueFromLabel(label, final) {
			return new Promise(async (resolve, reject) => {
				let classquery = `SELECT value from \`caas\` WHERE \`label\` LIKE ${con.escape(
					label || ""
				)};`;
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
							getValueFromLabel(label, true)
								.then((result) => {
									console.log("Reconnected!");
									resolve(result[0]);
								})
								.catch((err) => reject(err));
						}
					} else {
						if (result == null) {
							reject("null data");
						} else {
							resolve(result[0]);
						}
					}
				});
			});
		}

		api.get(`/caas`, (req, res) => {
			res.setHeader("Content-Type", "application/json");
			getValueFromLabel(req.query?.label)
				.then((result) => {
					res.send(result);
				})
				.catch((err) => {
					console.log("Failed to read CaaS:", err);
					res.send([]);
				});
		});
	});
};
