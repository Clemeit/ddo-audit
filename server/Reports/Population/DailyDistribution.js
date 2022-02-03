const fs = require("fs");
require("dotenv").config();

exports.runDailyDistribution = (population) => {
	var t0 = new Date();
	console.log("Running Daily Distribution report");

	const IGNORE_DOWNTIME = true;

	let a_count = [0, 0, 0, 0, 0, 0, 0];
	let c_count = [0, 0, 0, 0, 0, 0, 0];
	let g_count = [0, 0, 0, 0, 0, 0, 0];
	let k_count = [0, 0, 0, 0, 0, 0, 0];
	let o_count = [0, 0, 0, 0, 0, 0, 0];
	let s_count = [0, 0, 0, 0, 0, 0, 0];
	let t_count = [0, 0, 0, 0, 0, 0, 0];
	let w_count = [0, 0, 0, 0, 0, 0, 0];
	let h_count = [0, 0, 0, 0, 0, 0, 0];

	let Sunday = {
		Day: "Sunday",
		Argonnessen: 0,
		ArgonnessenColor: "hsl(205, 70%, 41%)",
		Cannith: 0,
		CannithColor: "hsl(28, 100%, 53%)",
		Ghallanda: 0,
		GhallandaColor: "hsl(120, 57%, 40%)",
		Khyber: 0,
		KhyberColor: "hsl(360, 69%, 50%)",
		Orien: 0,
		OrienColor: "hsl(271, 39%, 57%)",
		Sarlona: 0,
		SarlonaColor: "hsl(10, 30%, 42%)",
		Thelanis: 0,
		ThelanisColor: "hsl(318, 66%, 68%)",
		Wayfinder: 0,
		WayfinderColor: "hsl(0, 0%, 50%)",
		Hardcore: 0,
		HardcoreColor: "hsl(60, 70%, 44%)",
	};
	let Monday = {
		Day: "Monday",
		Argonnessen: 0,
		ArgonnessenColor: "hsl(205, 70%, 41%)",
		Cannith: 0,
		CannithColor: "hsl(28, 100%, 53%)",
		Ghallanda: 0,
		GhallandaColor: "hsl(120, 57%, 40%)",
		Khyber: 0,
		KhyberColor: "hsl(360, 69%, 50%)",
		Orien: 0,
		OrienColor: "hsl(271, 39%, 57%)",
		Sarlona: 0,
		SarlonaColor: "hsl(10, 30%, 42%)",
		Thelanis: 0,
		ThelanisColor: "hsl(318, 66%, 68%)",
		Wayfinder: 0,
		WayfinderColor: "hsl(0, 0%, 50%)",
		Hardcore: 0,
		HardcoreColor: "hsl(60, 70%, 44%)",
	};
	let Tuesday = {
		Day: "Tuesday",
		Argonnessen: 0,
		ArgonnessenColor: "hsl(205, 70%, 41%)",
		Cannith: 0,
		CannithColor: "hsl(28, 100%, 53%)",
		Ghallanda: 0,
		GhallandaColor: "hsl(120, 57%, 40%)",
		Khyber: 0,
		KhyberColor: "hsl(360, 69%, 50%)",
		Orien: 0,
		OrienColor: "hsl(271, 39%, 57%)",
		Sarlona: 0,
		SarlonaColor: "hsl(10, 30%, 42%)",
		Thelanis: 0,
		ThelanisColor: "hsl(318, 66%, 68%)",
		Wayfinder: 0,
		WayfinderColor: "hsl(0, 0%, 50%)",
		Hardcore: 0,
		HardcoreColor: "hsl(60, 70%, 44%)",
	};
	let Wednesday = {
		Day: "Wednesday",
		Argonnessen: 0,
		ArgonnessenColor: "hsl(205, 70%, 41%)",
		Cannith: 0,
		CannithColor: "hsl(28, 100%, 53%)",
		Ghallanda: 0,
		GhallandaColor: "hsl(120, 57%, 40%)",
		Khyber: 0,
		KhyberColor: "hsl(360, 69%, 50%)",
		Orien: 0,
		OrienColor: "hsl(271, 39%, 57%)",
		Sarlona: 0,
		SarlonaColor: "hsl(10, 30%, 42%)",
		Thelanis: 0,
		ThelanisColor: "hsl(318, 66%, 68%)",
		Wayfinder: 0,
		WayfinderColor: "hsl(0, 0%, 50%)",
		Hardcore: 0,
		HardcoreColor: "hsl(60, 70%, 44%)",
	};
	let Thursday = {
		Day: "Thursday",
		Argonnessen: 0,
		ArgonnessenColor: "hsl(205, 70%, 41%)",
		Cannith: 0,
		CannithColor: "hsl(28, 100%, 53%)",
		Ghallanda: 0,
		GhallandaColor: "hsl(120, 57%, 40%)",
		Khyber: 0,
		KhyberColor: "hsl(360, 69%, 50%)",
		Orien: 0,
		OrienColor: "hsl(271, 39%, 57%)",
		Sarlona: 0,
		SarlonaColor: "hsl(10, 30%, 42%)",
		Thelanis: 0,
		ThelanisColor: "hsl(318, 66%, 68%)",
		Wayfinder: 0,
		WayfinderColor: "hsl(0, 0%, 50%)",
		Hardcore: 0,
		HardcoreColor: "hsl(60, 70%, 44%)",
	};
	let Friday = {
		Day: "Friday",
		Argonnessen: 0,
		ArgonnessenColor: "hsl(205, 70%, 41%)",
		Cannith: 0,
		CannithColor: "hsl(28, 100%, 53%)",
		Ghallanda: 0,
		GhallandaColor: "hsl(120, 57%, 40%)",
		Khyber: 0,
		KhyberColor: "hsl(360, 69%, 50%)",
		Orien: 0,
		OrienColor: "hsl(271, 39%, 57%)",
		Sarlona: 0,
		SarlonaColor: "hsl(10, 30%, 42%)",
		Thelanis: 0,
		ThelanisColor: "hsl(318, 66%, 68%)",
		Wayfinder: 0,
		WayfinderColor: "hsl(0, 0%, 50%)",
		Hardcore: 0,
		HardcoreColor: "hsl(60, 70%, 44%)",
	};
	let Saturday = {
		Day: "Saturday",
		Argonnessen: 0,
		ArgonnessenColor: "hsl(205, 70%, 41%)",
		Cannith: 0,
		CannithColor: "hsl(28, 100%, 53%)",
		Ghallanda: 0,
		GhallandaColor: "hsl(120, 57%, 40%)",
		Khyber: 0,
		KhyberColor: "hsl(360, 69%, 50%)",
		Orien: 0,
		OrienColor: "hsl(271, 39%, 57%)",
		Sarlona: 0,
		SarlonaColor: "hsl(10, 30%, 42%)",
		Thelanis: 0,
		ThelanisColor: "hsl(318, 66%, 68%)",
		Wayfinder: 0,
		WayfinderColor: "hsl(0, 0%, 50%)",
		Hardcore: 0,
		HardcoreColor: "hsl(60, 70%, 44%)",
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
			if (
				new Date().getTime() - datetime.getTime() <=
				1000 * 60 * 60 * 24 * 91
			) {
				datetime = new Date(datetime.getTime() - 1000 * 60 * 60 * 5); // UTC -> EST
				// Get the current day of week:
				let dayofweek = new Date(
					new Date(datetime + "Z").getTime() - 5 * 60 * 60 * 1000
				).getUTCDay(); // Sun = 0, Mon = 1

				// Extremely disgusting. Fix this crap:
				switch (dayofweek) {
					case 0:
						if (argonnessen_playercount || !IGNORE_DOWNTIME) {
							Sunday.Argonnessen += argonnessen_playercount;
							a_count[dayofweek]++;
						}
						if (cannith_playercount || !IGNORE_DOWNTIME) {
							Sunday.Cannith += cannith_playercount;
							c_count[dayofweek]++;
						}
						if (ghallanda_playercount || !IGNORE_DOWNTIME) {
							Sunday.Ghallanda += ghallanda_playercount;
							g_count[dayofweek]++;
						}
						if (khyber_playercount || !IGNORE_DOWNTIME) {
							Sunday.Khyber += khyber_playercount;
							k_count[dayofweek]++;
						}
						if (orien_playercount || !IGNORE_DOWNTIME) {
							Sunday.Orien += orien_playercount;
							o_count[dayofweek]++;
						}
						if (sarlona_playercount || !IGNORE_DOWNTIME) {
							Sunday.Sarlona += sarlona_playercount;
							s_count[dayofweek]++;
						}
						if (thelanis_playercount || !IGNORE_DOWNTIME) {
							Sunday.Thelanis += thelanis_playercount;
							t_count[dayofweek]++;
						}
						if (wayfinder_playercount || !IGNORE_DOWNTIME) {
							Sunday.Wayfinder += wayfinder_playercount;
							w_count[dayofweek]++;
						}
						if (hardcore_playercount || !IGNORE_DOWNTIME) {
							Sunday.Hardcore += hardcore_playercount;
							h_count[dayofweek]++;
						}
						break;
					case 1:
						if (argonnessen_playercount || !IGNORE_DOWNTIME) {
							Monday.Argonnessen += argonnessen_playercount;
							a_count[dayofweek]++;
						}
						if (cannith_playercount || !IGNORE_DOWNTIME) {
							Monday.Cannith += cannith_playercount;
							c_count[dayofweek]++;
						}
						if (ghallanda_playercount || !IGNORE_DOWNTIME) {
							Monday.Ghallanda += ghallanda_playercount;
							g_count[dayofweek]++;
						}
						if (khyber_playercount || !IGNORE_DOWNTIME) {
							Monday.Khyber += khyber_playercount;
							k_count[dayofweek]++;
						}
						if (orien_playercount || !IGNORE_DOWNTIME) {
							Monday.Orien += orien_playercount;
							o_count[dayofweek]++;
						}
						if (sarlona_playercount || !IGNORE_DOWNTIME) {
							Monday.Sarlona += sarlona_playercount;
							s_count[dayofweek]++;
						}
						if (thelanis_playercount || !IGNORE_DOWNTIME) {
							Monday.Thelanis += thelanis_playercount;
							t_count[dayofweek]++;
						}
						if (wayfinder_playercount || !IGNORE_DOWNTIME) {
							Monday.Wayfinder += wayfinder_playercount;
							w_count[dayofweek]++;
						}
						if (hardcore_playercount || !IGNORE_DOWNTIME) {
							Monday.Hardcore += hardcore_playercount;
							h_count[dayofweek]++;
						}
						break;
					case 2:
						if (argonnessen_playercount || !IGNORE_DOWNTIME) {
							Tuesday.Argonnessen += argonnessen_playercount;
							a_count[dayofweek]++;
						}
						if (cannith_playercount || !IGNORE_DOWNTIME) {
							Tuesday.Cannith += cannith_playercount;
							c_count[dayofweek]++;
						}
						if (ghallanda_playercount || !IGNORE_DOWNTIME) {
							Tuesday.Ghallanda += ghallanda_playercount;
							g_count[dayofweek]++;
						}
						if (khyber_playercount || !IGNORE_DOWNTIME) {
							Tuesday.Khyber += khyber_playercount;
							k_count[dayofweek]++;
						}
						if (orien_playercount || !IGNORE_DOWNTIME) {
							Tuesday.Orien += orien_playercount;
							o_count[dayofweek]++;
						}
						if (sarlona_playercount || !IGNORE_DOWNTIME) {
							Tuesday.Sarlona += sarlona_playercount;
							s_count[dayofweek]++;
						}
						if (thelanis_playercount || !IGNORE_DOWNTIME) {
							Tuesday.Thelanis += thelanis_playercount;
							t_count[dayofweek]++;
						}
						if (wayfinder_playercount || !IGNORE_DOWNTIME) {
							Tuesday.Wayfinder += wayfinder_playercount;
							w_count[dayofweek]++;
						}
						if (hardcore_playercount || !IGNORE_DOWNTIME) {
							Tuesday.Hardcore += hardcore_playercount;
							h_count[dayofweek]++;
						}
						break;
					case 3:
						if (argonnessen_playercount || !IGNORE_DOWNTIME) {
							Wednesday.Argonnessen += argonnessen_playercount;
							a_count[dayofweek]++;
						}
						if (cannith_playercount || !IGNORE_DOWNTIME) {
							Wednesday.Cannith += cannith_playercount;
							c_count[dayofweek]++;
						}
						if (ghallanda_playercount || !IGNORE_DOWNTIME) {
							Wednesday.Ghallanda += ghallanda_playercount;
							g_count[dayofweek]++;
						}
						if (khyber_playercount || !IGNORE_DOWNTIME) {
							Wednesday.Khyber += khyber_playercount;
							k_count[dayofweek]++;
						}
						if (orien_playercount || !IGNORE_DOWNTIME) {
							Wednesday.Orien += orien_playercount;
							o_count[dayofweek]++;
						}
						if (sarlona_playercount || !IGNORE_DOWNTIME) {
							Wednesday.Sarlona += sarlona_playercount;
							s_count[dayofweek]++;
						}
						if (thelanis_playercount || !IGNORE_DOWNTIME) {
							Wednesday.Thelanis += thelanis_playercount;
							t_count[dayofweek]++;
						}
						if (wayfinder_playercount || !IGNORE_DOWNTIME) {
							Wednesday.Wayfinder += wayfinder_playercount;
							w_count[dayofweek]++;
						}
						if (hardcore_playercount || !IGNORE_DOWNTIME) {
							Wednesday.Hardcore += hardcore_playercount;
							h_count[dayofweek]++;
						}
						break;
					case 4:
						if (argonnessen_playercount || !IGNORE_DOWNTIME) {
							Thursday.Argonnessen += argonnessen_playercount;
							a_count[dayofweek]++;
						}
						if (cannith_playercount || !IGNORE_DOWNTIME) {
							Thursday.Cannith += cannith_playercount;
							c_count[dayofweek]++;
						}
						if (ghallanda_playercount || !IGNORE_DOWNTIME) {
							Thursday.Ghallanda += ghallanda_playercount;
							g_count[dayofweek]++;
						}
						if (khyber_playercount || !IGNORE_DOWNTIME) {
							Thursday.Khyber += khyber_playercount;
							k_count[dayofweek]++;
						}
						if (orien_playercount || !IGNORE_DOWNTIME) {
							Thursday.Orien += orien_playercount;
							o_count[dayofweek]++;
						}
						if (sarlona_playercount || !IGNORE_DOWNTIME) {
							Thursday.Sarlona += sarlona_playercount;
							s_count[dayofweek]++;
						}
						if (thelanis_playercount || !IGNORE_DOWNTIME) {
							Thursday.Thelanis += thelanis_playercount;
							t_count[dayofweek]++;
						}
						if (wayfinder_playercount || !IGNORE_DOWNTIME) {
							Thursday.Wayfinder += wayfinder_playercount;
							w_count[dayofweek]++;
						}
						if (hardcore_playercount || !IGNORE_DOWNTIME) {
							Thursday.Hardcore += hardcore_playercount;
							h_count[dayofweek]++;
						}
						break;
					case 5:
						if (argonnessen_playercount || !IGNORE_DOWNTIME) {
							Friday.Argonnessen += argonnessen_playercount;
							a_count[dayofweek]++;
						}
						if (cannith_playercount || !IGNORE_DOWNTIME) {
							Friday.Cannith += cannith_playercount;
							c_count[dayofweek]++;
						}
						if (ghallanda_playercount || !IGNORE_DOWNTIME) {
							Friday.Ghallanda += ghallanda_playercount;
							g_count[dayofweek]++;
						}
						if (khyber_playercount || !IGNORE_DOWNTIME) {
							Friday.Khyber += khyber_playercount;
							k_count[dayofweek]++;
						}
						if (orien_playercount || !IGNORE_DOWNTIME) {
							Friday.Orien += orien_playercount;
							o_count[dayofweek]++;
						}
						if (sarlona_playercount || !IGNORE_DOWNTIME) {
							Friday.Sarlona += sarlona_playercount;
							s_count[dayofweek]++;
						}
						if (thelanis_playercount || !IGNORE_DOWNTIME) {
							Friday.Thelanis += thelanis_playercount;
							t_count[dayofweek]++;
						}
						if (wayfinder_playercount || !IGNORE_DOWNTIME) {
							Friday.Wayfinder += wayfinder_playercount;
							w_count[dayofweek]++;
						}
						if (hardcore_playercount || !IGNORE_DOWNTIME) {
							Friday.Hardcore += hardcore_playercount;
							h_count[dayofweek]++;
						}
						break;
					case 6:
						if (argonnessen_playercount || !IGNORE_DOWNTIME) {
							Saturday.Argonnessen += argonnessen_playercount;
							a_count[dayofweek]++;
						}
						if (cannith_playercount || !IGNORE_DOWNTIME) {
							Saturday.Cannith += cannith_playercount;
							c_count[dayofweek]++;
						}
						if (ghallanda_playercount || !IGNORE_DOWNTIME) {
							Saturday.Ghallanda += ghallanda_playercount;
							g_count[dayofweek]++;
						}
						if (khyber_playercount || !IGNORE_DOWNTIME) {
							Saturday.Khyber += khyber_playercount;
							k_count[dayofweek]++;
						}
						if (orien_playercount || !IGNORE_DOWNTIME) {
							Saturday.Orien += orien_playercount;
							o_count[dayofweek]++;
						}
						if (sarlona_playercount || !IGNORE_DOWNTIME) {
							Saturday.Sarlona += sarlona_playercount;
							s_count[dayofweek]++;
						}
						if (thelanis_playercount || !IGNORE_DOWNTIME) {
							Saturday.Thelanis += thelanis_playercount;
							t_count[dayofweek]++;
						}
						if (wayfinder_playercount || !IGNORE_DOWNTIME) {
							Saturday.Wayfinder += wayfinder_playercount;
							w_count[dayofweek]++;
						}
						if (hardcore_playercount || !IGNORE_DOWNTIME) {
							Saturday.Hardcore += hardcore_playercount;
							h_count[dayofweek]++;
						}
						break;
				}
			}
		}
	);

	// omg wtf were you thinking...
	Sunday.Argonnessen =
		Math.round((Sunday.Argonnessen / a_count[0]) * 100) / 100;
	Sunday.Cannith = Math.round((Sunday.Cannith / c_count[0]) * 100) / 100;
	Sunday.Ghallanda = Math.round((Sunday.Ghallanda / g_count[0]) * 100) / 100;
	Sunday.Khyber = Math.round((Sunday.Khyber / k_count[0]) * 100) / 100;
	Sunday.Orien = Math.round((Sunday.Orien / o_count[0]) * 100) / 100;
	Sunday.Sarlona = Math.round((Sunday.Sarlona / s_count[0]) * 100) / 100;
	Sunday.Thelanis = Math.round((Sunday.Thelanis / t_count[0]) * 100) / 100;
	Sunday.Wayfinder = Math.round((Sunday.Wayfinder / w_count[0]) * 100) / 100;
	Sunday.Hardcore = Math.round((Sunday.Hardcore / h_count[0]) * 100) / 100;

	Monday.Argonnessen =
		Math.round((Monday.Argonnessen / a_count[1]) * 100) / 100;
	Monday.Cannith = Math.round((Monday.Cannith / c_count[1]) * 100) / 100;
	Monday.Ghallanda = Math.round((Monday.Ghallanda / g_count[1]) * 100) / 100;
	Monday.Khyber = Math.round((Monday.Khyber / k_count[1]) * 100) / 100;
	Monday.Orien = Math.round((Monday.Orien / o_count[1]) * 100) / 100;
	Monday.Sarlona = Math.round((Monday.Sarlona / s_count[1]) * 100) / 100;
	Monday.Thelanis = Math.round((Monday.Thelanis / t_count[1]) * 100) / 100;
	Monday.Wayfinder = Math.round((Monday.Wayfinder / w_count[1]) * 100) / 100;
	Monday.Hardcore = Math.round((Monday.Hardcore / h_count[1]) * 100) / 100;

	Tuesday.Argonnessen =
		Math.round((Tuesday.Argonnessen / a_count[2]) * 100) / 100;
	Tuesday.Cannith = Math.round((Tuesday.Cannith / c_count[2]) * 100) / 100;
	Tuesday.Ghallanda = Math.round((Tuesday.Ghallanda / g_count[2]) * 100) / 100;
	Tuesday.Khyber = Math.round((Tuesday.Khyber / k_count[2]) * 100) / 100;
	Tuesday.Orien = Math.round((Tuesday.Orien / o_count[2]) * 100) / 100;
	Tuesday.Sarlona = Math.round((Tuesday.Sarlona / s_count[2]) * 100) / 100;
	Tuesday.Thelanis = Math.round((Tuesday.Thelanis / t_count[2]) * 100) / 100;
	Tuesday.Wayfinder = Math.round((Tuesday.Wayfinder / w_count[2]) * 100) / 100;
	Tuesday.Hardcore = Math.round((Tuesday.Hardcore / h_count[2]) * 100) / 100;

	Wednesday.Argonnessen =
		Math.round((Wednesday.Argonnessen / a_count[3]) * 100) / 100;
	Wednesday.Cannith = Math.round((Wednesday.Cannith / c_count[3]) * 100) / 100;
	Wednesday.Ghallanda =
		Math.round((Wednesday.Ghallanda / g_count[3]) * 100) / 100;
	Wednesday.Khyber = Math.round((Wednesday.Khyber / k_count[3]) * 100) / 100;
	Wednesday.Orien = Math.round((Wednesday.Orien / o_count[3]) * 100) / 100;
	Wednesday.Sarlona = Math.round((Wednesday.Sarlona / s_count[3]) * 100) / 100;
	Wednesday.Thelanis =
		Math.round((Wednesday.Thelanis / t_count[3]) * 100) / 100;
	Wednesday.Wayfinder =
		Math.round((Wednesday.Wayfinder / w_count[3]) * 100) / 100;
	Wednesday.Hardcore =
		Math.round((Wednesday.Hardcore / h_count[3]) * 100) / 100;

	Thursday.Argonnessen =
		Math.round((Thursday.Argonnessen / a_count[4]) * 100) / 100;
	Thursday.Cannith = Math.round((Thursday.Cannith / c_count[4]) * 100) / 100;
	Thursday.Ghallanda =
		Math.round((Thursday.Ghallanda / g_count[4]) * 100) / 100;
	Thursday.Khyber = Math.round((Thursday.Khyber / k_count[4]) * 100) / 100;
	Thursday.Orien = Math.round((Thursday.Orien / o_count[4]) * 100) / 100;
	Thursday.Sarlona = Math.round((Thursday.Sarlona / s_count[4]) * 100) / 100;
	Thursday.Thelanis = Math.round((Thursday.Thelanis / t_count[4]) * 100) / 100;
	Thursday.Wayfinder =
		Math.round((Thursday.Wayfinder / w_count[4]) * 100) / 100;
	Thursday.Hardcore = Math.round((Thursday.Hardcore / h_count[4]) * 100) / 100;

	Friday.Argonnessen =
		Math.round((Friday.Argonnessen / a_count[5]) * 100) / 100;
	Friday.Cannith = Math.round((Friday.Cannith / c_count[5]) * 100) / 100;
	Friday.Ghallanda = Math.round((Friday.Ghallanda / g_count[5]) * 100) / 100;
	Friday.Khyber = Math.round((Friday.Khyber / k_count[5]) * 100) / 100;
	Friday.Orien = Math.round((Friday.Orien / o_count[5]) * 100) / 100;
	Friday.Sarlona = Math.round((Friday.Sarlona / s_count[5]) * 100) / 100;
	Friday.Thelanis = Math.round((Friday.Thelanis / t_count[5]) * 100) / 100;
	Friday.Wayfinder = Math.round((Friday.Wayfinder / w_count[5]) * 100) / 100;
	Friday.Hardcore = Math.round((Friday.Hardcore / h_count[5]) * 100) / 100;

	Saturday.Argonnessen =
		Math.round((Saturday.Argonnessen / a_count[6]) * 100) / 100;
	Saturday.Cannith = Math.round((Saturday.Cannith / c_count[6]) * 100) / 100;
	Saturday.Ghallanda =
		Math.round((Saturday.Ghallanda / g_count[6]) * 100) / 100;
	Saturday.Khyber = Math.round((Saturday.Khyber / k_count[6]) * 100) / 100;
	Saturday.Orien = Math.round((Saturday.Orien / o_count[6]) * 100) / 100;
	Saturday.Sarlona = Math.round((Saturday.Sarlona / s_count[6]) * 100) / 100;
	Saturday.Thelanis = Math.round((Saturday.Thelanis / t_count[6]) * 100) / 100;
	Saturday.Wayfinder =
		Math.round((Saturday.Wayfinder / w_count[6]) * 100) / 100;
	Saturday.Hardcore = Math.round((Saturday.Hardcore / h_count[6]) * 100) / 100;

	let output = [
		Sunday,
		Monday,
		Tuesday,
		Wednesday,
		Thursday,
		Friday,
		Saturday,
	];

	fs.writeFile(
		"../api_v1/population/dailydistributionquarter.json",
		JSON.stringify(output),
		(err) => {
			if (err) throw err;
		}
	);

	var t1 = new Date();
	console.log(`Finished in ${t1 - t0}ms`);
};
