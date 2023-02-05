const fs = require("fs");
const moment = require("moment");
require("dotenv").config();

exports.runTransferReport = (players) => {
	function writeAndRetry(path, data, count) {
		fs.writeFile(path, JSON.stringify(data), (err) => {
			if (err) {
				if (count <= 0) {
					throw err;
				} else {
					writeAndRetry(path, data, count - 1);
				}
			}
		});
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

	let transferCountData = [
		{
			id: "Total",
			color: "hsl(205, 70%, 41%)",
			data: [],
		},
	];

	let transfersFromData = [
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

	let transfersToData = [
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

	SERVER_NAMES.forEach((server) => {
		transfersFromCount.push(0);
		transfersToCount.push(0);
	});

	players.forEach(({ server, homeserver }) => {
		let serverIndex = SERVER_NAMES.indexOf(server);
		let homeServerIndex = SERVER_NAMES.indexOf(homeserver);
		if (serverIndex !== -1) {
			if (server !== homeserver) {
				totalTransferCount++;
				transfersToCount[serverIndex]++;
				if (homeServerIndex !== -1) {
					transfersFromCount[homeServerIndex]++;
				}
			}
		}
	});

	// load last data
	let lastTransferCountData;
	let lastTransferFromData;
	let lastTransferToData;
	try {
		lastTransferCountData = JSON.parse(
			fs.readFileSync("../api_v1/population/transfercounts.json", "utf8")
		);
	} catch {
		lastTransferCountData = transferCountData;
	}
	try {
		lastTransferFromData = JSON.parse(
			fs.readFileSync("../api_v1/population/transfersfrom.json", "utf8")
		);
	} catch {
		lastTransferFromData = transfersFromData;
	}
	try {
		lastTransferToData = JSON.parse(
			fs.readFileSync("../api_v1/population/transfersto.json", "utf8")
		);
	} catch {
		lastTransferToData = transfersToData;
	}

	lastTransferCountData[0].data.push({
		x: moment().startOf("day").toISOString(),
		y: totalTransferCount,
	});
	transfersFromCount.forEach((count, i) => {
		lastTransferFromData[i].data.push({
			x: moment().startOf("day"),
			y: count,
		});
	});
	transfersToCount.forEach((count, i) => {
		lastTransferToData[i].data.push({
			x: moment().startOf("day"),
			y: count,
		});
	});

	console.log(lastTransferCountData);
	console.log(lastTransferFromData);
	console.log(lastTransferToData);

	writeAndRetry(
		"../api_v1/population/transfercounts.json",
		lastTransferCountData,
		2
	);
	writeAndRetry(
		"../api_v1/population/transfersfrom.json",
		lastTransferFromData,
		2
	);
	writeAndRetry(
		"../api_v1/population/transfersto.json",
		lastTransferToData,
		2
	);

	var t1 = new Date();
	console.log(`-> Finished in ${t1 - t0}ms`);
};
