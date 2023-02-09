import moment from "moment";
import { cloneDeep } from "lodash-es";
import isPlayerActive from "../ActivePredicate.js";
import fs from "fs";

const runTransferReport = (players) => {
	if (players.length > 500000) {
		console.log(
			"Too many players for the transfer report! Player count:",
			players.length
		);
		return;
	}

	function writeAndRetry(fileName, data, count) {
		writeMain(fileName, data, count);
		writeBackup(fileName, data, count);
	}

	function writeMain(fileName, data, count) {
		fs.writeFile(
			`../api_v1/population/${fileName}.json`,
			JSON.stringify(data),
			(err) => {
				if (err) {
					if (count <= 0) {
						throw err;
					} else {
						writeMain(fileName, data, count - 1);
					}
				}
			}
		);
	}

	function writeBackup(fileName, data, count) {
		fs.writeFile(
			`../api_v1/population/backups/${fileName}-${moment().format(
				"YYYY-MM-DD"
			)}.json`,
			JSON.stringify(data),
			(err) => {
				if (err) {
					if (count <= 0) {
						throw err;
					} else {
						writeBackup(fileName, data, count - 1);
					}
				}
			}
		);
	}

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

	let templateSingleData = [
		{
			id: "Total",
			color: "hsl(205, 70%, 41%)",
			data: [],
		},
	];

	let templateMultiData = [
		{
			id: "Argonnessen",
			color: "hsl(205, 70%, 41%)",
			data: [],
		},
		{
			id: "Cannith",
			color: "hsl(28, 100%, 53%)",
			data: [],
		},
		{
			id: "Ghallanda",
			color: "hsl(120, 57%, 40%)",
			data: [],
		},
		{
			id: "Khyber",
			color: "hsl(360, 69%, 50%)",
			data: [],
		},
		{
			id: "Orien",
			color: "hsl(271, 39%, 57%)",
			data: [],
		},
		{
			id: "Sarlona",
			color: "hsl(10, 30%, 42%)",
			data: [],
		},
		{
			id: "Thelanis",
			color: "hsl(318, 66%, 68%)",
			data: [],
		},
		{
			id: "Wayfinder",
			color: "hsl(0, 0%, 50%)",
			data: [],
		},
		{
			id: "Hardcore",
			color: "hsl(60, 70%, 44%)",
			data: [],
		},
	];

	var t0 = new Date();
	console.log("Running Transfer report");

	let totalTransferCount = 0;
	let transfersFromCount = [];
	let transfersToCount = [];

	let totalTransferCountIgnoreHCL = 0;
	let transfersFromCountIgnoreHCL = [];
	let transfersToCountIgnoreHCL = [];

	let totalTransferCountActiveAndIgnoreHCL = 0;
	let transfersFromCountActiveAndIgnoreHCL = [];
	let transfersToCountActiveAndIgnoreHCL = [];

	SERVER_NAMES.forEach((server) => {
		transfersFromCount.push(0);
		transfersToCount.push(0);
		transfersFromCountIgnoreHCL.push(0);
		transfersToCountIgnoreHCL.push(0);
		transfersFromCountActiveAndIgnoreHCL.push(0);
		transfersToCountActiveAndIgnoreHCL.push(0);
	});

	players.forEach(
		({
			server,
			homeserver,
			lastseen,
			lastactive,
			lastmovement,
			lastlevelup,
			totallevel,
		}) => {
			let serverIndex = SERVER_NAMES.indexOf(server);
			let homeServerIndex = SERVER_NAMES.indexOf(homeserver);
			if (serverIndex !== -1) {
				if (server !== homeserver) {
					totalTransferCount++;
					transfersToCount[serverIndex]++;
					if (homeServerIndex !== -1) {
						transfersFromCount[homeServerIndex]++;
					}

					if (homeserver !== "Hardcore") {
						totalTransferCountIgnoreHCL++;
						transfersToCountIgnoreHCL[serverIndex]++;
						if (homeServerIndex !== -1) {
							transfersFromCountIgnoreHCL[homeServerIndex]++;
						}

						if (
							isPlayerActive(
								lastseen,
								lastactive,
								lastmovement,
								lastlevelup,
								totallevel
							)
						) {
							totalTransferCountActiveAndIgnoreHCL++;
							transfersToCountActiveAndIgnoreHCL[serverIndex]++;
							if (homeServerIndex !== -1) {
								transfersFromCountActiveAndIgnoreHCL[homeServerIndex]++;
							}
						}
					}
				}
			}
		}
	);

	// load last data
	let lastTransferCountData;
	let lastTransferFromData;
	let lastTransferToData;
	try {
		lastTransferCountData = JSON.parse(
			fs.readFileSync("../api_v1/population/transfercounts.json", "utf8")
		);
	} catch {
		lastTransferCountData = cloneDeep(templateSingleData);
	}
	try {
		lastTransferFromData = JSON.parse(
			fs.readFileSync("../api_v1/population/transfersfrom.json", "utf8")
		);
	} catch {
		lastTransferFromData = cloneDeep(templateMultiData);
	}
	try {
		lastTransferToData = JSON.parse(
			fs.readFileSync("../api_v1/population/transfersto.json", "utf8")
		);
	} catch {
		lastTransferToData = cloneDeep(templateMultiData);
	}

	// load last data (ignore hcl)
	let lastTransferCountDataIgnoreHCL;
	let lastTransferFromDataIgnoreHCL;
	let lastTransferToDataIgnoreHCL;
	try {
		lastTransferCountDataIgnoreHCL = JSON.parse(
			fs.readFileSync(
				"../api_v1/population/transfercounts_ignorehcl.json",
				"utf8"
			)
		);
	} catch {
		lastTransferCountDataIgnoreHCL = cloneDeep(templateSingleData);
	}
	try {
		lastTransferFromDataIgnoreHCL = JSON.parse(
			fs.readFileSync(
				"../api_v1/population/transfersfrom_ignorehcl.json",
				"utf8"
			)
		);
	} catch {
		lastTransferFromDataIgnoreHCL = cloneDeep(templateMultiData);
	}
	try {
		lastTransferToDataIgnoreHCL = JSON.parse(
			fs.readFileSync("../api_v1/population/transfersto_ignorehcl.json", "utf8")
		);
	} catch {
		lastTransferToDataIgnoreHCL = cloneDeep(templateMultiData);
	}

	// load last data (active and ignore hcl)
	let lastTransferCountDataActiveAndIgnoreHCL;
	let lastTransferFromDataActiveAndIgnoreHCL;
	let lastTransferToDataActiveAndIgnoreHCL;
	try {
		lastTransferCountDataActiveAndIgnoreHCL = JSON.parse(
			fs.readFileSync(
				"../api_v1/population/transfercounts_active_ignorehcl.json",
				"utf8"
			)
		);
	} catch {
		lastTransferCountDataActiveAndIgnoreHCL = cloneDeep(templateSingleData);
	}
	try {
		lastTransferFromDataActiveAndIgnoreHCL = JSON.parse(
			fs.readFileSync(
				"../api_v1/population/transfersfrom_active_ignorehcl.json",
				"utf8"
			)
		);
	} catch {
		lastTransferFromDataActiveAndIgnoreHCL = cloneDeep(templateMultiData);
	}
	try {
		lastTransferToDataActiveAndIgnoreHCL = JSON.parse(
			fs.readFileSync(
				"../api_v1/population/transfersto_active_ignorehcl.json",
				"utf8"
			)
		);
	} catch {
		lastTransferToDataActiveAndIgnoreHCL = cloneDeep(templateMultiData);
	}

	lastTransferCountData[0].data.push({
		x: moment().startOf("hour").toISOString(),
		y: totalTransferCount,
	});
	transfersFromCount.forEach((count, i) => {
		lastTransferFromData[i].data.push({
			x: moment().startOf("hour"),
			y: count,
		});
	});
	transfersToCount.forEach((count, i) => {
		lastTransferToData[i].data.push({
			x: moment().startOf("hour"),
			y: count,
		});
	});

	lastTransferCountDataIgnoreHCL[0].data.push({
		x: moment().startOf("hour").toISOString(),
		y: totalTransferCountIgnoreHCL,
	});
	transfersFromCountIgnoreHCL.forEach((count, i) => {
		lastTransferFromDataIgnoreHCL[i].data.push({
			x: moment().startOf("hour"),
			y: count,
		});
	});
	transfersToCountIgnoreHCL.forEach((count, i) => {
		lastTransferToDataIgnoreHCL[i].data.push({
			x: moment().startOf("hour"),
			y: count,
		});
	});

	lastTransferCountDataActiveAndIgnoreHCL[0].data.push({
		x: moment().startOf("hour").toISOString(),
		y: totalTransferCountActiveAndIgnoreHCL,
	});
	transfersFromCountActiveAndIgnoreHCL.forEach((count, i) => {
		lastTransferFromDataActiveAndIgnoreHCL[i].data.push({
			x: moment().startOf("hour"),
			y: count,
		});
	});
	transfersToCountActiveAndIgnoreHCL.forEach((count, i) => {
		lastTransferToDataActiveAndIgnoreHCL[i].data.push({
			x: moment().startOf("hour"),
			y: count,
		});
	});

	writeAndRetry("transfercounts", lastTransferCountData, 2);
	writeAndRetry("transfersfrom", lastTransferFromData, 2);
	writeAndRetry("transfersto", lastTransferToData, 2);

	writeAndRetry("transfercounts_ignorehcl", lastTransferCountDataIgnoreHCL, 2);
	writeAndRetry("transfersfrom_ignorehcl", lastTransferFromDataIgnoreHCL, 2);
	writeAndRetry("transfersto_ignorehcl", lastTransferToDataIgnoreHCL, 2);

	writeAndRetry(
		"transfercounts_active_ignorehcl",
		lastTransferCountDataActiveAndIgnoreHCL,
		2
	);
	writeAndRetry(
		"transfersfrom_active_ignorehcl",
		lastTransferFromDataActiveAndIgnoreHCL,
		2
	);
	writeAndRetry(
		"transfersto_active_ignorehcl",
		lastTransferToDataActiveAndIgnoreHCL,
		2
	);

	var t1 = new Date();
	console.log(`-> Finished in ${t1 - t0}ms`);
};

export default runTransferReport;
