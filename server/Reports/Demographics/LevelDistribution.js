import fs from "fs";
import isPlayerActive from "../ActivePredicate.js";

const runLevelDistribution = (players, reporttype) => {
	const IGNORE_DOWNTIME = true;
	const MAX_LEVEL = 32;

	var t0 = new Date();
	console.log("Running Level Distribution report");

	let a_count = 0;
	let c_count = 0;
	let g_count = 0;
	let k_count = 0;
	let o_count = 0;
	let s_count = 0;
	let t_count = 0;
	let w_count = 0;
	let h_count = 0;

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

	for (let i = 1; i <= MAX_LEVEL; i++) {
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

	players.forEach(
		({
			lastseen,
			lastactive,
			lastmovement,
			lastlevelup,
			totallevel,
			server,
		}) => {
			if (totallevel > MAX_LEVEL) {
				console.log("TotalLevel has exceeded MAX_LEVEL!");
			} else {
				if (
					reporttype === "normal"
						? isPlayerActive(
								lastseen,
								lastactive,
								lastmovement,
								lastlevelup,
								totallevel
						  )
						: !isPlayerActive(
								lastseen,
								lastactive,
								lastmovement,
								lastlevelup,
								totallevel
						  )
				) {
					switch (server) {
						case "Argonnessen":
							Argonnessen.data[totallevel - 1].y++;
							a_count++;
							break;
						case "Cannith":
							Cannith.data[totallevel - 1].y++;
							c_count++;
							break;
						case "Ghallanda":
							Ghallanda.data[totallevel - 1].y++;
							g_count++;
							break;
						case "Khyber":
							Khyber.data[totallevel - 1].y++;
							k_count++;
							break;
						case "Orien":
							Orien.data[totallevel - 1].y++;
							o_count++;
							break;
						case "Sarlona":
							Sarlona.data[totallevel - 1].y++;
							s_count++;
							break;
						case "Thelanis":
							Thelanis.data[totallevel - 1].y++;
							t_count++;
							break;
						case "Wayfinder":
							Wayfinder.data[totallevel - 1].y++;
							w_count++;
							break;
						case "Hardcore":
							Hardcore.data[totallevel - 1].y++;
							h_count++;
							break;
					}
				}
			}
		}
	);

	for (let i = 0; i < MAX_LEVEL; i++) {
		Argonnessen.data[i].y =
			Math.round((Argonnessen.data[i].y / a_count) * 10000) / 100;
		Cannith.data[i].y = Math.round((Cannith.data[i].y / c_count) * 10000) / 100;
		Ghallanda.data[i].y =
			Math.round((Ghallanda.data[i].y / g_count) * 10000) / 100;
		Khyber.data[i].y = Math.round((Khyber.data[i].y / k_count) * 10000) / 100;
		Orien.data[i].y = Math.round((Orien.data[i].y / o_count) * 10000) / 100;
		Sarlona.data[i].y = Math.round((Sarlona.data[i].y / s_count) * 10000) / 100;
		Thelanis.data[i].y =
			Math.round((Thelanis.data[i].y / t_count) * 10000) / 100;
		Wayfinder.data[i].y =
			Math.round((Wayfinder.data[i].y / w_count) * 10000) / 100;
		Hardcore.data[i].y =
			Math.round((Hardcore.data[i].y / h_count) * 10000) / 100;
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
		`../api_v1/demographics/leveldistributionquarter${
			reporttype === "normal" ? "" : "_banks"
		}.json`,
		JSON.stringify(output),
		(err) => {
			if (err) throw err;
		}
	);

	var t1 = new Date();
	console.log(`-> Finished in ${t1 - t0}ms`);
};

export default runLevelDistribution;
