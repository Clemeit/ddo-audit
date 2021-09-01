module.exports = function (app) {
	const population = [
		["day", "24hr_by_minute"],
		["week", "1_week_by_hour"],
		["quarter", "90_days_by_day"],
	];

	population.forEach((entry) => {
		app.get(`/population/${entry[0]}`, (req, res) => {
			console.log(entry[0]);
			console.log(req.subdomains);
			res.sendFile(`./api_v1/data/composite/${entry[1]}.json`, {
				root: __dirname,
			});
		});
	});

	app.get("/population", (req, res) => {
		res.send(
			"<h1>DDO Audit API /population</h1><ul style='font-size: larger'><li>/population/day</li><li>/population/week</li><li>/population/quarter</li></ul>"
		);
	});
};
