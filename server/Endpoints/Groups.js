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
	];

	con.connect((err) => {
		if (err) console.log(err);
		console.log("Groups API connected to the database");

		function getGroupData(server, final) {
			return new Promise(async (resolve, reject) => {
				let classquery = `SELECT ${server} FROM \`groups\` ORDER BY \`groups\`.\`datetime\` DESC LIMIT 1;`;
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
							resolve(result[0][server]);
						}
					}
				});
			});
		}

		servers.forEach((entry) => {
			api.get(`/groups/${entry}`, (req, res) => {
				res.setHeader("Content-Type", "application/json");
				getGroupData(entry)
					.then((result) => {
						res.send(result);
					})
					.catch((err) => {
						return {};
					});
			});
		});
	});
};
