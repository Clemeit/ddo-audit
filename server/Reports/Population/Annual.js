const fs = require("fs");
require("dotenv").config();

exports.runAnnualReport = (population) => {
	var t0 = new Date();
	console.log("Running Annual Population report");

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
	let Permanent = {
		id: "Permanent",
		color: "hsl(105, 100%, 50%)",
		data: [],
	};
	let Maximum = {
		id: "Maximum",
		color: "hsl(123, 100%, 50%)",
		data: [],
	};
	let Minimum = {
		id: "Minimum",
		color: "hsl(0, 100%, 50%)",
		data: [],
	};

	let lastSunday = -1;
	let entriesThisWeek = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
	let totalsThisWeek = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
	let maximumThisWeek = -1;
	let minimumThisWeek = -1;

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
				1000 * 60 * 60 * 24 * 364 * 2
			) {
				// datetime = new Date(datetime.getTime() - 1000 * 60 * 60 * 5); // UTC -> EST
				let dt = new Date(datetime + "Z");
				let dayofweek = dt.getUTCDay();

				if (
					dayofweek === 0 &&
					(lastSunday === -1 ||
						dt.getTime() - lastSunday.getTime() > 1000 * 60 * 60 * 24 * 5)
				) {
					if (lastSunday === -1) {
						// first week - discard the imcomplete data
					} else {
						// every other week, consolidate
						Argonnessen.data.push({
							x: lastSunday,
							y:
								Math.round(
									(totalsThisWeek[0] / entriesThisWeek[0]) * 100
								) / 100 || 0,
						});
						Cannith.data.push({
							x: lastSunday,
							y:
								Math.round(
									(totalsThisWeek[1] / entriesThisWeek[1]) * 100
								) / 100 || 0,
						});
						Ghallanda.data.push({
							x: lastSunday,
							y:
								Math.round(
									(totalsThisWeek[2] / entriesThisWeek[2]) * 100
								) / 100 || 0,
						});
						Khyber.data.push({
							x: lastSunday,
							y:
								Math.round(
									(totalsThisWeek[3] / entriesThisWeek[3]) * 100
								) / 100 || 0,
						});
						Orien.data.push({
							x: lastSunday,
							y:
								Math.round(
									(totalsThisWeek[4] / entriesThisWeek[4]) * 100
								) / 100 || 0,
						});
						Sarlona.data.push({
							x: lastSunday,
							y:
								Math.round(
									(totalsThisWeek[5] / entriesThisWeek[5]) * 100
								) / 100 || 0,
						});
						Thelanis.data.push({
							x: lastSunday,
							y:
								Math.round(
									(totalsThisWeek[6] / entriesThisWeek[6]) * 100
								) / 100 || 0,
						});
						Wayfinder.data.push({
							x: lastSunday,
							y:
								Math.round(
									(totalsThisWeek[7] / entriesThisWeek[7]) * 100
								) / 100 || 0,
						});
						Hardcore.data.push({
							x: lastSunday,
							y:
								Math.round(
									(totalsThisWeek[8] / entriesThisWeek[8]) * 100
								) / 100 || 0,
						});
						Total.data.push({
							x: lastSunday,
							y:
								Math.round(
									(totalsThisWeek[9] / entriesThisWeek[9]) * 100
								) / 100 || 0,
						});
						Permanent.data.push({
							x: lastSunday,
							y:
								Math.round(
									(totalsThisWeek[10] / entriesThisWeek[10]) * 100
								) / 100 || 0,
						});
						Maximum.data.push({
							x: lastSunday,
							y: maximumThisWeek,
						});
						Minimum.data.push({
							x: lastSunday,
							y: minimumThisWeek,
						});
					}

					maximumThisWeek = -1;
					minimumThisWeek = -1;
					for (let i = 0; i < 11; i++) {
						totalsThisWeek[i] = 0;
						entriesThisWeek[i] = 0;
					}

					lastSunday = dt;
				}

				if (argonnessen_playercount) {
					totalsThisWeek[0] += argonnessen_playercount;
					entriesThisWeek[0]++;
				}

				if (cannith_playercount) {
					totalsThisWeek[1] += cannith_playercount;
					entriesThisWeek[1]++;
				}

				if (ghallanda_playercount) {
					totalsThisWeek[2] += ghallanda_playercount;
					entriesThisWeek[2]++;
				}

				if (khyber_playercount) {
					totalsThisWeek[3] += khyber_playercount;
					entriesThisWeek[3]++;
				}

				if (orien_playercount) {
					totalsThisWeek[4] += orien_playercount;
					entriesThisWeek[4]++;
				}

				if (sarlona_playercount) {
					totalsThisWeek[5] += sarlona_playercount;
					entriesThisWeek[5]++;
				}

				if (thelanis_playercount) {
					totalsThisWeek[6] += thelanis_playercount;
					entriesThisWeek[6]++;
				}

				if (wayfinder_playercount) {
					totalsThisWeek[7] += wayfinder_playercount;
					entriesThisWeek[7]++;
				}

				if (hardcore_playercount) {
					totalsThisWeek[8] += hardcore_playercount;
					entriesThisWeek[8]++;
				}

				let totalnow =
					argonnessen_playercount +
					cannith_playercount +
					ghallanda_playercount +
					khyber_playercount +
					orien_playercount +
					sarlona_playercount +
					thelanis_playercount +
					wayfinder_playercount +
					hardcore_playercount;

				if (totalnow) {
					totalsThisWeek[9] += totalnow;
					entriesThisWeek[9]++;
				}

				if (
					argonnessen_playercount ||
					cannith_playercount ||
					ghallanda_playercount ||
					khyber_playercount ||
					orien_playercount ||
					sarlona_playercount ||
					thelanis_playercount ||
					wayfinder_playercount
				) {
					totalsThisWeek[10] +=
						argonnessen_playercount +
						cannith_playercount +
						ghallanda_playercount +
						khyber_playercount +
						orien_playercount +
						sarlona_playercount +
						thelanis_playercount +
						wayfinder_playercount;
					entriesThisWeek[10]++;
				}

				if (totalnow > maximumThisWeek || maximumThisWeek === -1) {
					maximumThisWeek = totalnow;
				}
				if (totalnow < minimumThisWeek || minimumThisWeek === -1) {
					minimumThisWeek = totalnow;
				}
			}
		}
	);

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
		Total,
		Permanent,
		Maximum,
		Minimum,
	];

	output.reverse();

	fs.writeFile(
		"../api_v1/population/year.json",
		JSON.stringify(output),
		(err) => {
			if (err) throw err;
		}
	);

	var t1 = new Date();
	console.log(`Finished in ${t1 - t0}ms`);
};
