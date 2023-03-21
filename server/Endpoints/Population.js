import path from "path";
import useQuery from "./useQuery.js";

const populationApi = (api, mysqlConnection) => {
	const { queryAndRetry } = useQuery(mysqlConnection);
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
		["quarter_groups", "quarter_groups"],
		["year", "year"],
		["year_groups", "year_groups"],
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

	function lookupStatsByRange(server, startDate, endDate) {
		return new Promise(async (resolve, reject) => {
			let query = `SELECT \`id\`, \`datetime\`, \`${server}_playercount\`, \`${server}_lfmcount\` FROM \`population\` WHERE \`datetime\` BETWEEN ${mysqlConnection.escape(
				startDate
			)} AND ${mysqlConnection.escape(endDate)}`;
			queryAndRetry(query, 3)
				.then((result) => {
					resolve(result);
				})
				.catch((err) => {
					reject(err);
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
				1000 * 60 * 60 * 24 * 91 // 91 days
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
};

export default populationApi;
