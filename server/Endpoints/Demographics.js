import path from "path";

const demographicsApi = (api) => {
	const population = [
		["leveldistribution", "leveldistributionquarter"],
		["classdistribution", "classdistributionquarter"],
		["racedistribution", "racedistributionquarter"],
		["leveldistribution_banks", "leveldistributionquarter_banks"],
		["classdistribution_banks", "classdistributionquarter_banks"],
		["racedistribution_banks", "racedistributionquarter_banks"],
	];

	population.forEach((entry) => {
		api.get(`/demographics/${entry[0]}`, (req, res) => {
			res.setHeader("Content-Type", "application/json");
			res.sendFile(
				path.resolve(`./api_v1/demographics/${entry[1]}.json`)
			);
		});
	});
};

export default demographicsApi;
