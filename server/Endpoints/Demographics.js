var path = require("path");

module.exports = function (api) {
	const population = [
		["leveldistribution", "leveldistributionquarter"],
		["classdistribution", "classdistributionquarter"],
		["racedistribution", "racedistributionquarter"],
	];

	population.forEach((entry) => {
		api.get(`/demographics/${entry[0]}`, (req, res) => {
			res.setHeader("Content-Type", "application/json");
			res.sendFile(path.resolve(`./api_v1/demographics/${entry[1]}.json`));
		});
	});
};
