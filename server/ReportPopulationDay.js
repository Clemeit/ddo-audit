const fs = require("fs");
require("dotenv").config();

function GetDateString(datetime) {
	return `${datetime.getUTCFullYear()}-${
		datetime.getUTCMonth() + 1
	}-${datetime.getUTCDate()} ${datetime.getUTCHours()}-${datetime.getUTCMinutes()}-00`;
}

// function sleep(milliSeconds) {
// 	var startTime = new Date().getTime(); // get the current time
// 	while (new Date().getTime() < startTime + milliSeconds); // hog cpu until time's up
// }

var t0 = new Date();
console.log("Running: 'PopulationReportDay'");
console.log(process.env.DB_HOST);
// sleep(10000);
var mysql = require("mysql");
var con = mysql.createConnection({
	host: process.env.DB_HOST,
	user: process.env.DB_USER,
	password: process.env.DB_PASS,
	database: process.env.DB_NAME,
});

con.connect(function (err) {
	if (err) {
		console.log("Misc error");
		throw err;
	}
	let q =
		"SELECT * FROM `population` WHERE `datetime` BETWEEN '" +
		GetDateString(new Date(Date.now() - 60000 * (60 * 24 + 5))) +
		"' AND '" +
		GetDateString(new Date(Date.now())) +
		"' ORDER BY `population`.`datetime` ASC;";
	con.query(q, function (err, result, fields) {
		if (err) {
			console.log("Couldn't connect");
			throw err;
		}

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

		result.forEach(
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
				datetime = new Date(Date.parse(datetime) - 60000 * 60 * 12);
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
			"api_v1/population/day.json",
			JSON.stringify(nivoData),
			(err) => {
				if (err) throw err;
			}
		);

		var t1 = new Date();
		console.log(`Finished in ${t1 - t0}ms`);
	});
});
