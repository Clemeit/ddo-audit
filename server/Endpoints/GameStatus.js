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
		console.log("Game Status API connected to the database");

		function getPlayerAndLfmOverview(final) {
			return new Promise(async (resolve, reject) => {
				let classquery = `SELECT * from \`population\` WHERE id=(SELECT max(id) FROM population);`;
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
							getPlayerAndLfmOverview(true)
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
							let ret = [];
							servers.forEach((server) => {
								ret.push({
									ServerName: server[0],
									PlayerCount: result[0][`${server[1]}_playercount`],
									LfmCount: result[0][`${server[1]}_lfmcount`],
								});
							});

							resolve(ret);
						}
					}
				});
			});
		}

		function getGroupTableCount() {
			return new Promise(async (resolve, reject) => {
				let classquery = `SELECT COUNT(*) AS Count from \`groups\`;`;
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
							getGroupData(server, true)
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
							resolve(result[0]);
						}
					}
				});
			});
		}

		api.get(`/gamestatus/populationoverview`, (req, res) => {
			res.setHeader("Content-Type", "application/json");
			getPlayerAndLfmOverview()
				.then((result) => {
					res.send(result);
				})
				.catch((err) => {
					console.log(err);
					return {};
				});
		});

		api.get(`/gamestatus/grouptablecount`, (req, res) => {
			res.setHeader("Content-Type", "application/json");
			getGroupTableCount()
				.then((result) => {
					res.send(result);
				})
				.catch((err) => {
					console.log(err);
					return {};
				});
		});

		api.get(`/gamestatus/serverstatus`, (req, res) => {
			res.setHeader("Content-Type", "application/json");
			res.sendFile(path.resolve(`./api_v1/gamestatus/serverstatus.json`));
		});
	});
};
