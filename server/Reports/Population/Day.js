const fs = require("fs");
require("dotenv").config();

exports.runDayReport = (population) => {
	var t0 = new Date();
	console.log("Running Daily Population report");

	let Argonnessen = {
		id: "Argonnessen",
		color: "hsl(205, 70%, 41%)",
		data: [],
	};
	let Cannith = {
		id: "Cannith",
		color: "hsl(28, 100%, 53%)",
		data: [],
	};
	let Ghallanda = {
		id: "Ghallanda",
		color: "hsl(120, 57%, 40%)",
		data: [],
	};
	let Khyber = {
		id: "Khyber",
		color: "hsl(360, 69%, 50%)",
		data: [],
	};
	let Orien = {
		id: "Orien",
		color: "hsl(271, 39%, 57%)",
		data: [],
	};
	let Sarlona = {
		id: "Sarlona",
		color: "hsl(10, 30%, 42%)",
		data: [],
	};
	let Thelanis = {
		id: "Thelanis",
		color: "hsl(318, 66%, 68%)",
		data: [],
	};
	let Wayfinder = {
		id: "Wayfinder",
		color: "hsl(0, 0%, 50%)",
		data: [],
	};
	let Hardcore = {
		id: "Hardcore",
		color: "hsl(60, 70%, 44%)",
		data: [],
	};
	let Total = {
		id: "Total",
		color: "hsl(208, 100%, 50%)",
		data: [],
	};

	population.forEach(
		({
			datetime,
			argonnessen_playercount,
			cannith_playercount,
			ghallanda_playercount,
			khyber_playercount,
			orien_playercount,
			sarlona_playercount,
			thelanis_playercount,
			wayfinder_playercount,
			hardcore_playercount,
		}) => {
			if (new Date().getTime() - datetime.getTime() <= 1000 * 60 * 60 * 24) {
				// datetime = new Date(datetime.getTime() - 1000 * 60 * 60 * 5); // UTC -> EST
				Argonnessen.data.push({
					x: datetime,
					y: argonnessen_playercount,
				});
				Cannith.data.push({
					x: datetime,
					y: cannith_playercount,
				});
				Ghallanda.data.push({
					x: datetime,
					y: ghallanda_playercount,
				});
				Khyber.data.push({
					x: datetime,
					y: khyber_playercount,
				});
				Orien.data.push({
					x: datetime,
					y: orien_playercount,
				});
				Sarlona.data.push({
					x: datetime,
					y: sarlona_playercount,
				});
				Thelanis.data.push({
					x: datetime,
					y: thelanis_playercount,
				});
				Wayfinder.data.push({
					x: datetime,
					y: wayfinder_playercount,
				});
				Hardcore.data.push({
					x: datetime,
					y: hardcore_playercount,
				});
				Total.data.push({
					x: datetime,
					y:
						argonnessen_playercount +
						cannith_playercount +
						ghallanda_playercount +
						khyber_playercount +
						orien_playercount +
						sarlona_playercount +
						thelanis_playercount +
						wayfinder_playercount +
						hardcore_playercount,
				});
			}
		}
	);

	let nivoData = [
		Argonnessen,
		Cannith,
		Ghallanda,
		Khyber,
		Orien,
		Sarlona,
		Thelanis,
		Wayfinder,
		Hardcore,
		Total,
	];

	nivoData.reverse();

	fs.writeFile(
		"../api_v1/population/day.json",
		JSON.stringify(nivoData),
		(err) => {
			if (err) throw err;
		}
	);

	var t1 = new Date();
	console.log(`Finished in ${t1 - t0}ms`);
};