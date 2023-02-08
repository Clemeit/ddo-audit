import mysql from "mysql2";
import requestIp from "request-ip";
var con = mysql.createConnection({
	host: process.env.DB_HOST,
	user: process.env.DB_USER,
	password: process.env.DB_PASS,
	database: process.env.DB_NAME,
});

const messageServiceApi = (api) => {
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

		function submitMessage(message, ipaddress, ticket) {
			return new Promise(async (resolve, reject) => {
				if (
					message == null ||
					message.title == null ||
					message.comment == null ||
					ticket == null
				) {
					reject("Bad request");
				} else {
					let classquery = `INSERT INTO \`feedback\` (\`datetime\`, \`ip\`, \`ticket\`, \`browser\`, \`title\`, \`comment\`, \`resolved\`) VALUES (CURRENT_TIMESTAMP, ${con.escape(
						ipaddress || ""
					)}, ${con.escape(ticket || "")}, ${
						con.escape(message.browser) || ""
					}, ${con.escape(message.title) || ""}, ${
						con.escape(message.comment) || ""
					}, '0');`;
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

		function getPrivateMessages(requestBody) {
			return new Promise(async (resolve, reject) => {
				if (
					requestBody == null ||
					requestBody.tickets == null ||
					requestBody.tickets.length === 0
				) {
					reject("Bad ticket");
				}
				let escapedTickets = [];
				requestBody.tickets.forEach((ticket) => {
					escapedTickets.push(con.escape(ticket));
				});
				let messageQuery = `SELECT \`datetime\`, \`ticket\`, \`comment\`, \`response\` FROM \`feedback\` WHERE (ticket = ${escapedTickets.join(
					" OR ticket = "
				)}) AND \`resolved\` = 1 AND \`response\` IS NOT NULL ORDER BY \`feedback\`.\`datetime\` DESC LIMIT 1;`;
				con.query(messageQuery, (err, result, fields) => {
					if (err) {
						reject(err);
					} else {
						if (result && result.length) {
							result[0].comment = result[0].comment.split("(Contact:")[0];
						}
						resolve(result);
					}
				});
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
			var ticket = Date.now();
			res.setHeader("Content-Type", "application/json");
			submitMessage(req.body, clientIp, ticket)
				.then(() => {
					res.send({ state: "Success", ticket });
				})
				.catch((err) => {
					console.log("Failed to post message:", err);
					res.send({ state: "Failed" });
				});
		});

		api.post(`/retrieveresponse`, (req, res) => {
			res.setHeader("Content-Type", "application/json");
			getPrivateMessages(req.body)
				.then((result) => {
					res.send(result);
				})
				.catch((err) => {
					console.log("Failed to read message:", err);
					res.send([]);
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

export default messageServiceApi;
