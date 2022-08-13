const fetch = require("node-fetch");
const { sendMessage } = require("./Messenger");

function runGroupMonitor(lastResult) {
	return new Promise(async (resolve, reject) => {
		let returnData = {
			hasUpdatedRecently: true,
			respondingServerCount: 0,
			groupTableCount: 0,
		};

		let response, data;
		try {
			response = await fetch("https://api.ddoaudit.com/groups/all");
			data = await response.json();
		} catch (message) {
			reject(message);
		}

		// Check for recent updates
		data?.forEach((server) => {
			returnData.respondingServerCount++;
			if (Date.now() - new Date(server.LastUpdateTime) > 1000 * 60) {
				returnData.hasUpdatedRecently = false;
			}
		});

		try {
			response = await fetch(
				"https://api.ddoaudit.com/gamestatus/grouptablecount"
			);
			data = await response.json();
		} catch (message) {
			reject(message);
		}

		// Set group table count
		returnData.groupTableCount = data.Count;

		if (lastResult != null) {
			if (
				lastResult.hasUpdatedRecently === true &&
				returnData.hasUpdatedRecently === false
			) {
				sendMessage("Group data has stopped updating");
			}

			if (
				lastResult.respondingServerCount >
				returnData.respondingServerCount
			) {
				sendMessage("Some worlds stopped reporting group status");
			}

			if (
				lastResult.groupTableCount > 15 &&
				returnData.groupTableCount <= 15
			) {
				sendMessage("Group table is low");
			} else if (
				lastResult.groupTableCount !== 0 &&
				returnData.groupTableCount === 0
			) {
				sendMessage("Group table is empty");
			} else if (
				lastResult.groupTableCount < 45 &&
				returnData.groupTableCount >= 45
			) {
				sendMessage("Group table count is high");
			}
		}

		resolve(returnData);
	});
}

module.exports.runGroupMonitor = runGroupMonitor;
