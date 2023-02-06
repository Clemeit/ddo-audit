import cron from "node-cron";

import mysql from "mysql2";
var con = mysql.createConnection({
	host: process.env.DB_HOST,
	user: process.env.DB_USER,
	password: process.env.DB_PASS,
	database: process.env.DB_NAME,
});

const iotApi = (api) => {
	con.connect((err) => {
		if (err) throw err;
		console.log("IOT API connected to the database");

		function postStep(intensity, final) {
			return new Promise(async (resolve, reject) => {
				let classquery = `INSERT INTO \`steps\` (\`datetime\`, \`intensity\`) VALUES (CURRENT_TIMESTAMP(3), '${intensity}');`;
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
							postStep(intensity, true)
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

		function getSteps(hours, final) {
			return new Promise(async (resolve, reject) => {
				let sanitizedhours = 24;
				if (!isNaN(hours)) {
					sanitizedhours = +hours;
				}
				let query = `SELECT * FROM steps WHERE steps.datetime > DATE_ADD(UTC_TIMESTAMP(), INTERVAL -${sanitizedhours} HOUR) ORDER BY steps.datetime ASC;`;

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
							getSteps(hours, true)
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

		function getColor(device, final) {
			return new Promise(async (resolve, reject) => {
				let classquery = `SELECT \`color\` from \`colors\` WHERE \`device\` = ${con.escape(
					device
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
							getColor(device, true)
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

		function setColor(device, color, final) {
			return new Promise(async (resolve, reject) => {
				let classquery = `UPDATE \`colors\` SET \`color\` = ${con.escape(
					color
				)} WHERE \`device\` = ${con.escape(device)};`;
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
							setColor(device, color, true)
								.then((result) => {
									console.log("Reconnected!");
									resolve("done");
								})
								.catch((err) => reject(err));
						}
					} else {
						if (result == null) {
							reject("null data");
						} else {
							resolve("done");
						}
					}
				});
			});
		}

		api.get(`/iot/color`, (req, res) => {
			let device = req.query.device || "desk";

			res.setHeader("Content-Type", "application/json");
			getColor(device)
				.then((result) => {
					res.send({ Color: result });
				})
				.catch((err) => {
					console.log(err);
					res.send({ Color: "00FFFF00" });
				});
		});

		api.post(`/iot/color`, (req, res) => {
			let device = req.query.device || "desk";
			let color = req.query.color || "000000FF";

			res.setHeader("Content-Type", "application/json");
			setColor(device, color)
				.then((result) => {
					res.send({ Color: color });
				})
				.catch((err) => {
					console.log(err);
					res.send({ Color: "Failed" });
				});
		});

		api.post(`/iot/step`, (req, res) => {
			res.setHeader("Content-Type", "application/json");
			let intensity = req.query.intensity || "1";

			console.log(
				`Step detected [INTENSITY=${intensity
					.toString()
					.padStart(4, "0")}] at ${new Date().toLocaleString(
					"en-US",
					{
						timeZone: "America/Denver",
					}
				)}`
			);
			postStep(intensity)
				.then(() => {
					res.send({ result: "good" });
				})
				.catch((err) => {
					res.send({ result: "bad" });
				});
		});

		api.post(`/iot/steps`, (req, res) => {
			res.setHeader("Content-Type", "application/json");
			let hours = req.body.hours || 24;
			getSteps(hours)
				.then((result) => {
					res.send(result);
				})
				.catch((err) => {
					res.send({ error: err });
				});
		});

		// 7:00am
		cron.schedule("0 13 * * *", () => {
			setColor("bathroom", "FF200000");
			setColor("bed", "AA00FF00");
			setColor("bedroom", "FF200000");
			setColor("desk", "FF200000");
			setColor("mirror", "AA00FF00");
		});

		// 10:30pm
		cron.schedule("30 4 * * *", () => {
			setColor("bed", "55007F00");
			setColor("bedroom", "7F100000");
		});

		// 11:00pm
		cron.schedule("0 5 * * *", () => {
			setColor("bathroom", "7F100000");
			setColor("mirror", "55007F00");
			setColor("desk", "00000000");
		});
	});
};

export default iotApi;
