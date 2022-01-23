module.exports = function (api) {
	const population = [
		["day", "day"],
		["week", "week"],
		["quarter", "quarter"],
		["year", "year"],
	];

	population.forEach((entry) => {
		api.get(`/population/${entry[0]}`, (req, res) => {
			console.log(entry[0]);
			res.sendFile(`./api_v1/population/${entry[1]}.json`, {
				root: __dirname,
			});
		});
	});

	api.get("/population", (req, res) => {
		res.send(
			"<h1>DDO Audit API /population</h1><ul style='font-size: larger'><li>/population/day</li><li>/population/week</li><li>/population/quarter</li></ul>"
		);
	});
};
