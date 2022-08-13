const fetch = require("node-fetch");
const { sendMessage } = require("./Messenger");

function runPlayerMonitor(lastResult) {
	return new Promise(async (resolve, reject) => {
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

		let returnData = {
			serverPopulation: [],
			playerTableCount: 0,
		};

		let allServerLookups = [];

		SERVER_NAMES.forEach((serverName) => {
			allServerLookups.push(
				new Promise(async (resolve, reject) => {
					let index = SERVER_NAMES.indexOf(serverName);
					let response, data;
					try {
						response = await fetch(
							`https://api.ddoaudit.com/players/${serverName.toLowerCase()}`
						);
						data = await response.json();
					} catch (message) {
						reject(message);
					}

					returnData.serverPopulation[index] = data?.Population;
					resolve();
				})
			);
		});

		await Promise.all(allServerLookups);

		let response, data;
		try {
			response = await fetch(
				"https://api.ddoaudit.com/gamestatus/playertablecount"
			);
			data = await response.json();

			// Set player table count
			returnData.playerTableCount = data?.Count;
		} catch (message) {
			reject(message);
		}

		if (lastResult != null) {
			if (
				lastResult.serverPopulation?.length !==
				returnData.serverPopulation?.length
			) {
				sendMessage("Server count mismatch");
			} else {
				let serverEmptied = false;
				for (let i = 0; i < returnData.serverPopulation.length; i++) {
					if (
						lastResult.serverPopulation?.[i] > 0 &&
						returnData.serverPopulation?.[i] === 0
					) {
						serverEmptied = true;
					}
				}
				if (serverEmptied) {
					sendMessage("A server is reporting zero players");
				}

				if (!serverEmptied) {
					let dramaticServerDecline = false;
					for (
						let i = 0;
						i < returnData.serverPopulation.length;
						i++
					) {
						if (
							lastResult.serverPopulation?.[i] >
							returnData.serverPopulation?.[i] * 2
						) {
							dramaticServerDecline = true;
						}
					}
					if (dramaticServerDecline) {
						sendMessage("A server population dropped dramatically");
					}
				}
			}

			if (
				lastResult.playerTableCount > 6 &&
				returnData.playerTableCount <= 6
			) {
				sendMessage("Player table is low");
			} else if (
				lastResult.playerTableCount !== 0 &&
				returnData.playerTableCount === 0
			) {
				sendMessage("Player table is empty");
			} else if (
				lastResult.playerTableCount < 20 &&
				returnData.playerTableCount >= 20
			) {
				sendMessage("Player table count is high");
			}
		}

		resolve(returnData);
	});
}

module.exports.runPlayerMonitor = runPlayerMonitor;
