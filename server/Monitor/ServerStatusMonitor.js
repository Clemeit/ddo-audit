const fetch = require("node-fetch");
const { sendMessage } = require("./Messenger");

function runServerStatusMonitor(lastResult) {
	return new Promise(async (resolve, reject) => {
		let returnData = {
			hasUpdatedRecently: true,
			onlineWorldCount: 0,
		};

		let response, data;
		try {
			response = await fetch(
				"https://api.ddoaudit.com/gamestatus/serverstatus"
			);
			data = await response.json();
		} catch (message) {
			reject(message);
		}

		// Check that server status has updated recently
		if (Date.now() - new Date(data?.LastUpdateTime) > 1000 * 120) {
			returnData.hasUpdatedRecently = false;
		}

		// Check that all servers are online
		data?.Worlds?.forEach((world) => {
			if (world.Status === 1) {
				returnData.onlineWorldCount++;
			}
		});

		if (lastResult != null) {
			if (
				lastResult.hasUpdatedRecently === true &&
				returnData.hasUpdatedRecently === false
			) {
				sendMessage("Server status has stopped updating");
			}

			if (lastResult.onlineWorldCount > returnData.onlineWorldCount) {
				sendMessage("Some worlds just went offline");
			} else if (
				lastResult.onlineWorldCount < returnData.onlineWorldCount
			) {
				sendMessage("Some worlds just went online");
			}
		}

		resolve(returnData);
	});
}

module.exports.runServerStatusMonitor = runServerStatusMonitor;
