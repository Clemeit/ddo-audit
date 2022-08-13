const cron = require("node-cron");
const { sendMessage } = require("./Messenger");

const { runServerStatusMonitor } = require("./ServerStatusMonitor");
const { runGroupMonitor } = require("./GroupMonitor");
const { runPlayerMonitor } = require("./PlayerMonitor");

let serverStatusResult = null;
let groupResult = null;
let playerResult = null;

cron.schedule("* * * * *", () => {
	console.log("Monitoring health...");
	runServerStatusMonitor(serverStatusResult)
		.then((result) => {
			serverStatusResult = result;
		})
		.catch((error) => {
			sendMessage(`Server status monitor failed: ${error}`);
			serverStatusResult = null;
		});

	runGroupMonitor(groupResult)
		.then((result) => {
			groupResult = result;
		})
		.catch((error) => {
			sendMessage(`Group monitor failed: ${error}`);
			groupResult = null;
		});

	runPlayerMonitor(playerResult)
		.then((result) => {
			playerResult = result;
		})
		.catch((error) => {
			sendMessage(`Player monitor failed: ${error}`);
			playerResult = null;
		});
});
