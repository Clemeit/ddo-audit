const fs = require("fs");
require("dotenv").config();
const { isPlayerActive } = require("../ActivePredicate");

exports.runClassDistribution = (players, classes) => {
	const IGNORE_DOWNTIME = true;
	const SERVER_NAMES = [
		"Argonnessen",
		"Cannith",
		"Ghallanda",
		"Khyber",
		"Orien",
		"Sarlona",
		"Thelanis",
		"Wayfinder",
		"Hardcore",
	];

	var t0 = new Date();
	console.log("Running Class Distribution report");

	function classIdToName(id, classes) {
		let returnval = null;
		classes.forEach((c) => {
			if (c.id == id) returnval = c.name;
		});
		return returnval;
	}

	let counts = {
		Argonnessen: 0,
		Cannith: 0,
		Ghallanda: 0,
		Khyber: 0,
		Orien: 0,
		Sarlona: 0,
		Thelanis: 0,
		Wayfinder: 0,
		Hardcore: 0,
	};

	let output = [];
	classes.forEach((c) => {
		output.push({
			Class: c.name,
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
		});
	});

	players.forEach(
		({
			class1,
			level1,
			class2,
			level2,
			class3,
			level3,
			class4,
			level4,
			lastseen,
			lastactive,
			lastmovement,
			lastlevelup,
			totallevel,
			server,
		}) => {
			if (
				isPlayerActive(
					lastseen,
					lastactive,
					lastmovement,
					lastlevelup,
					totallevel
				)
			) {
				let class1_n = classIdToName(class1, classes);
				let class2_n = classIdToName(class2, classes);
				let class3_n = classIdToName(class3, classes);
				let class4_n = classIdToName(class4, classes);

				let primaryclass = class1_n;
				if (class2 != null && class2_n != "Epic") {
					if (level2 > level1) primaryclass = class2_n;
				}
				if (class3 != null && class3_n != "Epic") {
					if (level3 > level2) primaryclass = class3_n;
				}
				if (class4 != null && class4_n != "Epic") {
					if (level4 > level3) primaryclass = class4_n;
				}

				output.forEach((c) => {
					if (c.Class == primaryclass) {
						c[server]++;
					}
				});
				counts[server]++;
			}
		}
	);

	output.forEach((c) => {
		SERVER_NAMES.forEach((s) => {
			c[s] = Math.round((c[s] / counts[s]) * 10000) / 100;
		});
	});

	fs.writeFile(
		"../api_v1/demographics/classdistributionquarter.json",
		JSON.stringify(output),
		(err) => {
			if (err) throw err;
		}
	);

	var t1 = new Date();
	console.log(`->Finished in ${t1 - t0}ms`);
};
