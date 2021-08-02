const cron = require("node-cron");
const fs = require("fs");
const { Worker } = require("worker_threads");

function runService(reportWorker) {
	return new Promise((resolve, reject) => {
		const worker = new Worker(reportWorker);
		worker.on("message", resolve);
		worker.on("error", reject);
		worker.on("exit", (code) => {
			if (code !== 0)
				reject(new Error(`Worker stopped with exit code ${code}`));
		});
	});
}

async function run(reportWorker) {
	const r1 = await runService(reportWorker);
}

// Every minute
cron.schedule("* * * * *", () => {
	//
});

run("../var/www/npafrequency.xyz/server/ReportPopulationDay.js").catch((err) =>
	console.error(err)
);
// Every 5 minutes
cron.schedule("0-55/5 * * * *", () => {
	run("./ReportPopulationDay.js").catch((err) => console.error(err));
});

// Every hour
cron.schedule("0 0-22 * * *", () => {
	run("./ReportPopulationWeek.js").catch((err) => console.error(err));
});

// Every day
cron.schedule("0 0 * * 1-6", () => {
	run("./ReportPopulationQuarter.js").catch((err) => console.error(err));
});

// Every week
cron.schedule("0 * * * 0", () => {
	//
});
