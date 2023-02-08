import fs from "fs";

const runWeekReport = (population) => {
	var t0 = new Date();
	console.log("Running Weekly Population report");

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

	let lastHour = -1;
	let entriesThisHour = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

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
				1000 * 60 * 60 * 24 * 7
			) {
				// datetime = new Date(datetime.getTime() - 1000 * 60 * 60 * 5); // UTC -> EST
				datetime = new Date(Date.parse(datetime) - 60000 * 60 * 12);
				let thisHour = new Date(Date.parse(datetime)).getUTCHours();
				if (lastHour === -1) {
					lastHour = thisHour;

					Argonnessen.data.push({
						x: datetime,
						y: 0,
					});
					Cannith.data.push({
						x: datetime,
						y: 0,
					});
					Ghallanda.data.push({
						x: datetime,
						y: 0,
					});
					Khyber.data.push({
						x: datetime,
						y: 0,
					});
					Orien.data.push({
						x: datetime,
						y: 0,
					});
					Sarlona.data.push({
						x: datetime,
						y: 0,
					});
					Thelanis.data.push({
						x: datetime,
						y: 0,
					});
					Wayfinder.data.push({
						x: datetime,
						y: 0,
					});
					Hardcore.data.push({
						x: datetime,
						y: 0,
					});
					Total.data.push({
						x: datetime,
						y: 0,
					});

					entriesThisHour = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
				} else {
					if (thisHour !== lastHour) {
						// Report
						for (let i = 0; i < 10; i++) {
							if (entriesThisHour[i] === 0) {
								entriesThisHour[i] = 1;
							}
						}

						Argonnessen.data[Argonnessen.data.length - 1].y =
							Math.round(
								(Argonnessen.data[Argonnessen.data.length - 1].y /
									entriesThisHour[0]) *
									100
							) / 100;

						Cannith.data[Cannith.data.length - 1].y =
							Math.round(
								(Cannith.data[Cannith.data.length - 1].y / entriesThisHour[1]) *
									100
							) / 100;

						Ghallanda.data[Ghallanda.data.length - 1].y =
							Math.round(
								(Ghallanda.data[Ghallanda.data.length - 1].y /
									entriesThisHour[2]) *
									100
							) / 100;

						Khyber.data[Khyber.data.length - 1].y =
							Math.round(
								(Khyber.data[Khyber.data.length - 1].y / entriesThisHour[3]) *
									100
							) / 100;

						Orien.data[Orien.data.length - 1].y =
							Math.round(
								(Orien.data[Orien.data.length - 1].y / entriesThisHour[4]) * 100
							) / 100;

						Sarlona.data[Sarlona.data.length - 1].y =
							Math.round(
								(Sarlona.data[Sarlona.data.length - 1].y / entriesThisHour[5]) *
									100
							) / 100;

						Thelanis.data[Thelanis.data.length - 1].y =
							Math.round(
								(Thelanis.data[Thelanis.data.length - 1].y /
									entriesThisHour[6]) *
									100
							) / 100;

						Wayfinder.data[Wayfinder.data.length - 1].y =
							Math.round(
								(Wayfinder.data[Wayfinder.data.length - 1].y /
									entriesThisHour[7]) *
									100
							) / 100;

						Hardcore.data[Hardcore.data.length - 1].y =
							Math.round(
								(Hardcore.data[Hardcore.data.length - 1].y /
									entriesThisHour[8]) *
									100
							) / 100;

						Total.data[Total.data.length - 1].y =
							Math.round(
								(Total.data[Total.data.length - 1].y / entriesThisHour[9]) * 100
							) / 100;

						Argonnessen.data.push({
							x: datetime,
							y: 0,
						});
						Cannith.data.push({
							x: datetime,
							y: 0,
						});
						Ghallanda.data.push({
							x: datetime,
							y: 0,
						});
						Khyber.data.push({
							x: datetime,
							y: 0,
						});
						Orien.data.push({
							x: datetime,
							y: 0,
						});
						Sarlona.data.push({
							x: datetime,
							y: 0,
						});
						Thelanis.data.push({
							x: datetime,
							y: 0,
						});
						Wayfinder.data.push({
							x: datetime,
							y: 0,
						});
						Hardcore.data.push({
							x: datetime,
							y: 0,
						});
						Total.data.push({
							x: datetime,
							y: 0,
						});

						entriesThisHour = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
						lastHour = thisHour;
					} else {
						// Increment
						if (argonnessen_playercount) {
							Argonnessen.data[Argonnessen.data.length - 1].y +=
								argonnessen_playercount;
							entriesThisHour[0]++;
						}

						if (cannith_playercount) {
							Cannith.data[Cannith.data.length - 1].y += cannith_playercount;
							entriesThisHour[1]++;
						}

						if (ghallanda_playercount) {
							Ghallanda.data[Ghallanda.data.length - 1].y +=
								ghallanda_playercount;
							entriesThisHour[2]++;
						}

						if (khyber_playercount) {
							Khyber.data[Khyber.data.length - 1].y += khyber_playercount;
							entriesThisHour[3]++;
						}

						if (orien_playercount) {
							Orien.data[Orien.data.length - 1].y += orien_playercount;
							entriesThisHour[4]++;
						}

						if (sarlona_playercount) {
							Sarlona.data[Sarlona.data.length - 1].y += sarlona_playercount;
							entriesThisHour[5]++;
						}

						if (thelanis_playercount) {
							Thelanis.data[Thelanis.data.length - 1].y += thelanis_playercount;
							entriesThisHour[6]++;
						}

						if (wayfinder_playercount) {
							Wayfinder.data[Wayfinder.data.length - 1].y +=
								wayfinder_playercount;
							entriesThisHour[7]++;
						}

						if (hardcore_playercount) {
							Hardcore.data[Hardcore.data.length - 1].y += hardcore_playercount;
							entriesThisHour[8]++;
						}

						if (
							argonnessen_playercount ||
							cannith_playercount ||
							ghallanda_playercount ||
							khyber_playercount ||
							orien_playercount ||
							sarlona_playercount ||
							thelanis_playercount ||
							wayfinder_playercount ||
							hardcore_playercount
						) {
							Total.data[Total.data.length - 1].y +=
								argonnessen_playercount +
								cannith_playercount +
								ghallanda_playercount +
								khyber_playercount +
								orien_playercount +
								sarlona_playercount +
								thelanis_playercount +
								wayfinder_playercount +
								hardcore_playercount;
							entriesThisHour[9]++;
						}
					}
				}
			}
		}
	);

	// Report
	for (let i = 0; i < 10; i++) {
		if (entriesThisHour[i] === 0) {
			entriesThisHour[i] = 1;
		}
	}

	Argonnessen.data[Argonnessen.data.length - 1].y =
		Math.round(
			(Argonnessen.data[Argonnessen.data.length - 1].y / entriesThisHour[0]) *
				100
		) / 100;

	Cannith.data[Cannith.data.length - 1].y =
		Math.round(
			(Cannith.data[Cannith.data.length - 1].y / entriesThisHour[1]) * 100
		) / 100;

	Ghallanda.data[Ghallanda.data.length - 1].y =
		Math.round(
			(Ghallanda.data[Ghallanda.data.length - 1].y / entriesThisHour[2]) * 100
		) / 100;

	Khyber.data[Khyber.data.length - 1].y =
		Math.round(
			(Khyber.data[Khyber.data.length - 1].y / entriesThisHour[3]) * 100
		) / 100;

	Orien.data[Orien.data.length - 1].y =
		Math.round(
			(Orien.data[Orien.data.length - 1].y / entriesThisHour[4]) * 100
		) / 100;

	Sarlona.data[Sarlona.data.length - 1].y =
		Math.round(
			(Sarlona.data[Sarlona.data.length - 1].y / entriesThisHour[5]) * 100
		) / 100;

	Thelanis.data[Thelanis.data.length - 1].y =
		Math.round(
			(Thelanis.data[Thelanis.data.length - 1].y / entriesThisHour[6]) * 100
		) / 100;

	Wayfinder.data[Wayfinder.data.length - 1].y =
		Math.round(
			(Wayfinder.data[Wayfinder.data.length - 1].y / entriesThisHour[7]) * 100
		) / 100;

	Hardcore.data[Hardcore.data.length - 1].y =
		Math.round(
			(Hardcore.data[Hardcore.data.length - 1].y / entriesThisHour[8]) * 100
		) / 100;

	Total.data[Total.data.length - 1].y =
		Math.round(
			(Total.data[Total.data.length - 1].y / entriesThisHour[9]) * 100
		) / 100;

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
		"../api_v1/population/week.json",
		JSON.stringify(nivoData),
		(err) => {
			if (err) throw err;
		}
	);

	var t1 = new Date();
	console.log(`Finished in ${t1 - t0}ms`);
};

export default runWeekReport;
