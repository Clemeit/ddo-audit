import path from "path";
import mysql from "mysql2";

var con = mysql.createConnection({
	host: process.env.DB_HOST,
	user: process.env.DB_USER,
	password: process.env.DB_PASS,
	database: process.env.DB_NAME,
});

const populationApi = (api) => {
	const servers = [
		"argonnessen",
		"cannith",
		"ghallanda",
		"khyber",
		"orien",
		"sarlona",
		"thelanis",
		"wayfinder",
		"hardcore",
	];

	const population = [
		["day", "day"],
		["day_groups", "day_groups"],
		["week", "week"],
		["quarter", "quarter"],
		["year", "year"],
		["serverdistribution", "serverdistributionquarter"],
		["serverdistributionmonth", "serverdistributionmonth"],
		["hourlydistribution", "hourlydistributionquarter"],
		["dailydistribution", "dailydistributionquarter"],
		["uniquedata", "uniquedata"],
		["serverdistribution_groups", "serverdistributionquarter_groups"],
		["serverdistributionmonth_groups", "serverdistributionmonth_groups"],
		["hourlydistribution_groups", "hourlydistributionquarter_groups"],
		["dailydistribution_groups", "dailydistributionquarter_groups"],
		["quarter_delta", "quarter_delta"],
		["quarter_groups_delta", "quarter_groups_delta"],
		["latest", "latest"],
		["transfercounts", "transfercounts"],
		["transfersfrom", "transfersfrom"],
		["transfersto", "transfersto"],
		["transfercounts_ignorehcl", "transfercounts_ignorehcl"],
		["transfersfrom_ignorehcl", "transfersfrom_ignorehcl"],
		["transfersto_ignorehcl", "transfersto_ignorehcl"],
		["transfercounts_active_ignorehcl", "transfercounts_active_ignorehcl"],
		["transfersfrom_active_ignorehcl", "transfersfrom_active_ignorehcl"],
		["transfersto_active_ignorehcl", "transfersto_active_ignorehcl"],
	];

	population.forEach((entry) => {
		api.get(`/population/${entry[0]}`, (req, res) => {
			res.setHeader("Content-Type", "application/json");
			res.sendFile(path.resolve(`./api_v1/population/${entry[1]}.json`));
		});
	});

	con.connect((err) => {
		if (err) throw err;
		console.log("Population API connected to the database");

		function lookupStatsByRange(server, startDate, endDate, final) {
			return new Promise(async (resolve, reject) => {
				let query = `SELECT \`id\`, \`datetime\`, \`${server}_playercount\`, \`${server}_lfmcount\` FROM \`population\` WHERE \`datetime\` BETWEEN ${con.escape(
					startDate
				)} AND ${con.escape(endDate)}`;

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
							lookupStatsByRange(server, startDate, endDate, true)
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

		api.post(`/population/range`, (req, res) => {
			const server = (req.body.server || "").toLowerCase();
			const startDate = req.body.startDate;
			const endDate = req.body.endDate;
			if (!server || !startDate || !endDate || !servers.includes(server)) {
				res.setHeader("Content-Type", "application/json");
				res.send({ error: "Server, start date, or end date is missing" });
			} else {
				// range check
				if (
					new Date(endDate).getTime() - new Date(startDate).getTime() >
					1000 * 60 * 60 * 24 * 91 // 32 days
				) {
					res.setHeader("Content-Type", "application/json");
					res.send({ error: "Date range too wide" });
				} else {
					lookupStatsByRange(server, startDate, endDate).then((result) => {
						res.setHeader("Content-Type", "application/json");
						res.send(result);
					});
				}
			}
		});
	});
};

export default populationApi;
