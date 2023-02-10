import fs from "fs";

const runServerDistribution = (population, reporttype) => {
	const hardcoreSeasonStart = new Date(2022, 11, 7);
	var t0 = new Date();
	console.log("Running Server Distribution report");

	const IGNORE_DOWNTIME = true;

	let a_count_quarter = 0;
	let c_count_quarter = 0;
	let g_count_quarter = 0;
	let k_count_quarter = 0;
	let o_count_quarter = 0;
	let s_count_quarter = 0;
	let t_count_quarter = 0;
	let w_count_quarter = 0;
	let h_count_quarter = 0;

	let a_count_month = 0;
	let c_count_month = 0;
	let g_count_month = 0;
	let k_count_month = 0;
	let o_count_month = 0;
	let s_count_month = 0;
	let t_count_month = 0;
	let w_count_month = 0;
	let h_count_month = 0;

	let ArgonnessenQuarter = {
		id: "Argonnessen",
		label: "Argonnessen",
		color: "hsl(205, 70%, 41%)",
		value: 0,
	};
	let CannithQuarter = {
		id: "Cannith",
		label: "Cannith",
		color: "hsl(28, 100%, 53%)",
		value: 0,
	};
	let GhallandaQuarter = {
		id: "Ghallanda",
		label: "Ghallanda",
		color: "hsl(120, 57%, 40%)",
		value: 0,
	};
	let KhyberQuarter = {
		id: "Khyber",
		label: "Khyber",
		color: "hsl(360, 69%, 50%)",
		value: 0,
	};
	let OrienQuarter = {
		id: "Orien",
		label: "Orien",
		color: "hsl(271, 39%, 57%)",
		value: 0,
	};
	let SarlonaQuarter = {
		id: "Sarlona",
		label: "Sarlona",
		color: "hsl(10, 30%, 42%)",
		value: 0,
	};
	let ThelanisQuarter = {
		id: "Thelanis",
		label: "Thelanis",
		color: "hsl(318, 66%, 68%)",
		value: 0,
	};
	let WayfinderQuarter = {
		id: "Wayfinder",
		label: "Wayfinder",
		color: "hsl(0, 0%, 50%)",
		value: 0,
	};
	let HardcoreQuarter = {
		id: "Hardcore",
		label: "Hardcore",
		color: "hsl(60, 70%, 44%)",
		value: 0,
	};

	let ArgonnessenMonth = {
		id: "Argonnessen",
		label: "Argonnessen",
		color: "hsl(205, 70%, 41%)",
		value: 0,
	};
	let CannithMonth = {
		id: "Cannith",
		label: "Cannith",
		color: "hsl(28, 100%, 53%)",
		value: 0,
	};
	let GhallandaMonth = {
		id: "Ghallanda",
		label: "Ghallanda",
		color: "hsl(120, 57%, 40%)",
		value: 0,
	};
	let KhyberMonth = {
		id: "Khyber",
		label: "Khyber",
		color: "hsl(360, 69%, 50%)",
		value: 0,
	};
	let OrienMonth = {
		id: "Orien",
		label: "Orien",
		color: "hsl(271, 39%, 57%)",
		value: 0,
	};
	let SarlonaMonth = {
		id: "Sarlona",
		label: "Sarlona",
		color: "hsl(10, 30%, 42%)",
		value: 0,
	};
	let ThelanisMonth = {
		id: "Thelanis",
		label: "Thelanis",
		color: "hsl(318, 66%, 68%)",
		value: 0,
	};
	let WayfinderMonth = {
		id: "Wayfinder",
		label: "Wayfinder",
		color: "hsl(0, 0%, 50%)",
		value: 0,
	};
	let HardcoreMonth = {
		id: "Hardcore",
		label: "Hardcore",
		color: "hsl(60, 70%, 44%)",
		value: 0,
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
			argonnessen_lfmcount,
			cannith_lfmcount,
			ghallanda_lfmcount,
			khyber_lfmcount,
			orien_lfmcount,
			sarlona_lfmcount,
			thelanis_lfmcount,
			wayfinder_lfmcount,
			hardcore_lfmcount,
		}) => {
			if (
				new Date().getTime() - datetime.getTime() <=
				1000 * 60 * 60 * 24 * 91
			) {
				// datetime = new Date(datetime.getTime() - 1000 * 60 * 60 * 5); // UTC -> EST
				if (reporttype === "population") {
					if (argonnessen_playercount || !IGNORE_DOWNTIME) {
						ArgonnessenQuarter.value += argonnessen_playercount;
						a_count_quarter++;
					}
					if (cannith_playercount || !IGNORE_DOWNTIME) {
						CannithQuarter.value += cannith_playercount;
						c_count_quarter++;
					}
					if (ghallanda_playercount || !IGNORE_DOWNTIME) {
						GhallandaQuarter.value += ghallanda_playercount;
						g_count_quarter++;
					}
					if (khyber_playercount || !IGNORE_DOWNTIME) {
						KhyberQuarter.value += khyber_playercount;
						k_count_quarter++;
					}
					if (orien_playercount || !IGNORE_DOWNTIME) {
						OrienQuarter.value += orien_playercount;
						o_count_quarter++;
					}
					if (sarlona_playercount || !IGNORE_DOWNTIME) {
						SarlonaQuarter.value += sarlona_playercount;
						s_count_quarter++;
					}
					if (thelanis_playercount || !IGNORE_DOWNTIME) {
						ThelanisQuarter.value += thelanis_playercount;
						t_count_quarter++;
					}
					if (wayfinder_playercount || !IGNORE_DOWNTIME) {
						WayfinderQuarter.value += wayfinder_playercount;
						w_count_quarter++;
					}
					if (
						(hardcore_playercount || !IGNORE_DOWNTIME) &&
						datetime.getTime() - hardcoreSeasonStart.getTime() > 0
					) {
						HardcoreQuarter.value += hardcore_playercount;
						h_count_quarter++;
					}
				} else {
					ArgonnessenQuarter.value += argonnessen_lfmcount;
					a_count_quarter++;

					CannithQuarter.value += cannith_lfmcount;
					c_count_quarter++;

					GhallandaQuarter.value += ghallanda_lfmcount;
					g_count_quarter++;

					KhyberQuarter.value += khyber_lfmcount;
					k_count_quarter++;

					OrienQuarter.value += orien_lfmcount;
					o_count_quarter++;

					SarlonaQuarter.value += sarlona_lfmcount;
					s_count_quarter++;

					ThelanisQuarter.value += thelanis_lfmcount;
					t_count_quarter++;

					WayfinderQuarter.value += wayfinder_lfmcount;
					w_count_quarter++;

					HardcoreQuarter.value += hardcore_lfmcount;
					if (
						hardcore_lfmcount &&
						datetime.getTime() - hardcoreSeasonStart.getTime() > 0
					)
						h_count_quarter++;
				}
			}
			if (
				new Date().getTime() - datetime.getTime() <=
				1000 * 60 * 60 * 24 * 30
			) {
				// datetime = new Date(datetime.getTime() - 1000 * 60 * 60 * 5); // UTC -> EST
				if (reporttype === "population") {
					if (argonnessen_playercount || !IGNORE_DOWNTIME) {
						ArgonnessenMonth.value += argonnessen_playercount;
						a_count_month++;
					}
					if (cannith_playercount || !IGNORE_DOWNTIME) {
						CannithMonth.value += cannith_playercount;
						c_count_month++;
					}
					if (ghallanda_playercount || !IGNORE_DOWNTIME) {
						GhallandaMonth.value += ghallanda_playercount;
						g_count_month++;
					}
					if (khyber_playercount || !IGNORE_DOWNTIME) {
						KhyberMonth.value += khyber_playercount;
						k_count_month++;
					}
					if (orien_playercount || !IGNORE_DOWNTIME) {
						OrienMonth.value += orien_playercount;
						o_count_month++;
					}
					if (sarlona_playercount || !IGNORE_DOWNTIME) {
						SarlonaMonth.value += sarlona_playercount;
						s_count_month++;
					}
					if (thelanis_playercount || !IGNORE_DOWNTIME) {
						ThelanisMonth.value += thelanis_playercount;
						t_count_month++;
					}
					if (wayfinder_playercount || !IGNORE_DOWNTIME) {
						WayfinderMonth.value += wayfinder_playercount;
						w_count_month++;
					}
					if (
						(hardcore_playercount || !IGNORE_DOWNTIME) &&
						datetime.getTime() - hardcoreSeasonStart.getTime() > 0
					) {
						HardcoreMonth.value += hardcore_playercount;
						h_count_month++;
					}
				} else {
					ArgonnessenMonth.value += argonnessen_lfmcount;
					a_count_month++;

					CannithMonth.value += cannith_lfmcount;
					c_count_month++;

					GhallandaMonth.value += ghallanda_lfmcount;
					g_count_month++;

					KhyberMonth.value += khyber_lfmcount;
					k_count_month++;

					OrienMonth.value += orien_lfmcount;
					o_count_month++;

					SarlonaMonth.value += sarlona_lfmcount;
					s_count_month++;

					ThelanisMonth.value += thelanis_lfmcount;
					t_count_month++;

					WayfinderMonth.value += wayfinder_lfmcount;
					w_count_month++;

					HardcoreMonth.value += hardcore_lfmcount;
					if (
						hardcore_lfmcount &&
						datetime.getTime() - hardcoreSeasonStart.getTime() > 0
					)
						h_count_month++;
				}
			}
		}
	);

	ArgonnessenQuarter.value =
		Math.round((ArgonnessenQuarter.value / a_count_quarter) * 100) / 100;
	CannithQuarter.value =
		Math.round((CannithQuarter.value / c_count_quarter) * 100) / 100;
	GhallandaQuarter.value =
		Math.round((GhallandaQuarter.value / g_count_quarter) * 100) / 100;
	KhyberQuarter.value =
		Math.round((KhyberQuarter.value / k_count_quarter) * 100) / 100;
	OrienQuarter.value =
		Math.round((OrienQuarter.value / o_count_quarter) * 100) / 100;
	SarlonaQuarter.value =
		Math.round((SarlonaQuarter.value / s_count_quarter) * 100) / 100;
	ThelanisQuarter.value =
		Math.round((ThelanisQuarter.value / t_count_quarter) * 100) / 100;
	WayfinderQuarter.value =
		Math.round((WayfinderQuarter.value / w_count_quarter) * 100) / 100;
	HardcoreQuarter.value =
		Math.round((HardcoreQuarter.value / h_count_quarter) * 100) / 100;

	ArgonnessenMonth.value =
		Math.round((ArgonnessenMonth.value / a_count_month) * 100) / 100;
	CannithMonth.value =
		Math.round((CannithMonth.value / c_count_month) * 100) / 100;
	GhallandaMonth.value =
		Math.round((GhallandaMonth.value / g_count_month) * 100) / 100;
	KhyberMonth.value =
		Math.round((KhyberMonth.value / k_count_month) * 100) / 100;
	OrienMonth.value = Math.round((OrienMonth.value / o_count_month) * 100) / 100;
	SarlonaMonth.value =
		Math.round((SarlonaMonth.value / s_count_month) * 100) / 100;
	ThelanisMonth.value =
		Math.round((ThelanisMonth.value / t_count_month) * 100) / 100;
	WayfinderMonth.value =
		Math.round((WayfinderMonth.value / w_count_month) * 100) / 100;
	HardcoreMonth.value =
		Math.round((HardcoreMonth.value / h_count_month) * 100) / 100;

	let outputQuarter = [
		ArgonnessenQuarter,
		CannithQuarter,
		GhallandaQuarter,
		KhyberQuarter,
		OrienQuarter,
		SarlonaQuarter,
		ThelanisQuarter,
		WayfinderQuarter,
		HardcoreQuarter,
	];

	let outputMonth = [
		ArgonnessenMonth,
		CannithMonth,
		GhallandaMonth,
		KhyberMonth,
		OrienMonth,
		SarlonaMonth,
		ThelanisMonth,
		WayfinderMonth,
		HardcoreMonth,
	];

	outputQuarter.reverse();
	outputMonth.reverse();

	fs.writeFile(
		`../api_v1/population/serverdistributionquarter${
			reporttype === "population" ? "" : "_groups"
		}.json`,
		JSON.stringify(outputQuarter),
		(err) => {
			if (err) throw err;
		}
	);

	fs.writeFile(
		`../api_v1/population/serverdistributionmonth${
			reporttype === "population" ? "" : "_groups"
		}.json`,
		JSON.stringify(outputMonth),
		(err) => {
			if (err) throw err;
		}
	);

	var t1 = new Date();
	console.log(`Finished in ${t1 - t0}ms`);
};

export default runServerDistribution;
