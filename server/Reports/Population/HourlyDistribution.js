const fs = require("fs");
require("dotenv").config();

exports.runHourlyDistribution = (population) => {
	function mod(n, m) {
		return ((n % m) + m) % m;
	}

	var t0 = new Date();
	console.log("Running Hourly Distribution report");

	const IGNORE_DOWNTIME = true;

	let a_count = [
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
	];
	let c_count = [
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
	];
	let g_count = [
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
	];
	let k_count = [
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
	];
	let o_count = [
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
	];
	let s_count = [
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
	];
	let t_count = [
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
	];
	let w_count = [
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
	];
	let h_count = [
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
	];

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

	for (let i = 0; i < 24; i++) {
		Argonnessen.data.push({ x: i, y: 0 });
		Cannith.data.push({ x: i, y: 0 });
		Ghallanda.data.push({ x: i, y: 0 });
		Khyber.data.push({ x: i, y: 0 });
		Orien.data.push({ x: i, y: 0 });
		Sarlona.data.push({ x: i, y: 0 });
		Thelanis.data.push({ x: i, y: 0 });
		Wayfinder.data.push({ x: i, y: 0 });
		Hardcore.data.push({ x: i, y: 0 });
	}

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
			if (
				new Date().getTime() - datetime.getTime() <=
				1000 * 60 * 60 * 24 * 91
			) {
				// Get the current hour:
				let hour = mod(datetime.getUTCHours() - 5, 24); // UTC -> EST

				if (argonnessen_playercount || !IGNORE_DOWNTIME) {
					Argonnessen.data[hour].y += argonnessen_playercount;
					a_count[hour]++;
				}
				if (cannith_playercount || !IGNORE_DOWNTIME) {
					Cannith.data[hour].y += cannith_playercount;
					c_count[hour]++;
				}
				if (ghallanda_playercount || !IGNORE_DOWNTIME) {
					Ghallanda.data[hour].y += ghallanda_playercount;
					g_count[hour]++;
				}
				if (khyber_playercount || !IGNORE_DOWNTIME) {
					Khyber.data[hour].y += khyber_playercount;
					k_count[hour]++;
				}
				if (orien_playercount || !IGNORE_DOWNTIME) {
					Orien.data[hour].y += orien_playercount;
					o_count[hour]++;
				}
				if (sarlona_playercount || !IGNORE_DOWNTIME) {
					Sarlona.data[hour].y += sarlona_playercount;
					s_count[hour]++;
				}
				if (thelanis_playercount || !IGNORE_DOWNTIME) {
					Thelanis.data[hour].y += thelanis_playercount;
					t_count[hour]++;
				}
				if (wayfinder_playercount || !IGNORE_DOWNTIME) {
					Wayfinder.data[hour].y += wayfinder_playercount;
					w_count[hour]++;
				}
				if (hardcore_playercount || !IGNORE_DOWNTIME) {
					Hardcore.data[hour].y += hardcore_playercount;
					h_count[hour]++;
				}
			}
		}
	);

	for (let i = 0; i < 24; i++) {
		Argonnessen.data[i].y =
			Math.round((Argonnessen.data[i].y / a_count[i]) * 100) / 100;
		Cannith.data[i].y =
			Math.round((Cannith.data[i].y / c_count[i]) * 100) / 100;
		Ghallanda.data[i].y =
			Math.round((Ghallanda.data[i].y / g_count[i]) * 100) / 100;
		Khyber.data[i].y =
			Math.round((Khyber.data[i].y / k_count[i]) * 100) / 100;
		Orien.data[i].y = Math.round((Orien.data[i].y / o_count[i]) * 100) / 100;
		Sarlona.data[i].y =
			Math.round((Sarlona.data[i].y / s_count[i]) * 100) / 100;
		Thelanis.data[i].y =
			Math.round((Thelanis.data[i].y / t_count[i]) * 100) / 100;
		Wayfinder.data[i].y =
			Math.round((Wayfinder.data[i].y / w_count[i]) * 100) / 100;
		Hardcore.data[i].y =
			Math.round((Hardcore.data[i].y / h_count[i]) * 100) / 100;
	}

	let output = [
		Argonnessen,
		Cannith,
		Ghallanda,
		Khyber,
		Orien,
		Sarlona,
		Thelanis,
		Wayfinder,
		Hardcore,
	];

	output.reverse();

	fs.writeFile(
		"../api_v1/population/hourlydistributionquarter.json",
		JSON.stringify(output),
		(err) => {
			if (err) throw err;
		}
	);

	var t1 = new Date();
	console.log(`Finished in ${t1 - t0}ms`);
};