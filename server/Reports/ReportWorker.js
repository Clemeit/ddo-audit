const cron = require("node-cron");

// Get data once, then run all of the reports using that data...
const { runClassDistribution } = require("./Demographics/ClassDistribution");
const { runRaceDistribution } = require("./Demographics/RaceDistribution");
const { runLevelDistribution } = require("./Demographics/LevelDistribution");

const { runAnnualReport } = require("./Population/Annual");
const { runQuarterReport } = require("./Population/Quarter");
const { runWeekReport } = require("./Population/Week");
const { runDayReport } = require("./Population/Day");

const { runDailyDistribution } = require("./Population/DailyDistribution");
const { runHourlyDistribution } = require("./Population/HourlyDistribution");
const { runServerDistribution } = require("./Population/ServerDistribution");

var mysql = require("mysql2");
var con = mysql.createConnection({
	host: process.env.DB_HOST,
	user: process.env.DB_USER,
	password: process.env.DB_PASS,
	database: process.env.DB_NAME,
});

function GetDateString(datetime) {
	return `${datetime.getUTCFullYear()}-${
		datetime.getUTCMonth() + 1
	}-${datetime.getUTCDate()} 00-00-00`;
}

function IsPlayerActive(
	lastseen,
	lastactive,
	lastmovement,
	lastlevelup,
	totallevel
) {
	let MOVEMENT_DAY_THRESHOLD = 5;
	let QUESTING_DAY_THRESHOLD = 10;
	let LEVELUP_DAY_THRESHOLD = 20;

	let seen = new Date(lastseen + "Z").getTime();
	let active = lastactive == null ? 0 : new Date(lastactive + "Z").getTime();
	let movement =
		lastmovement == null ? 0 : new Date(lastmovement + "Z").getTime();
	let levelup =
		lastlevelup == null ? 0 : new Date(lastlevelup + "Z").getTime();

	let isactive = true;

	if (seen - movement > 1000 * 60 * 60 * 24 * MOVEMENT_DAY_THRESHOLD)
		isactive = false; // No movement
	if (seen - active > 1000 * 60 * 60 * 24 * QUESTING_DAY_THRESHOLD)
		isactive = false; // No questing
	if (
		totallevel < 30 &&
		seen - levelup > 1000 * 60 * 60 * 24 * LEVELUP_DAY_THRESHOLD
	)
		isactive = false; // No level-ups (level 30s excluded)

	return isactive;
}

con.connect((err) => {
	if (err) throw err;
	console.log("Connected to database");

	// Get class data:
	let classes = [];
	function getClassData() {
		let classquery = "SELECT * FROM `classes` ORDER BY `classes`.`name` ASC;";
		con.query(classquery, (err, result, fields) => {
			if (err) throw err;

			result.forEach(({ id, name }) => {
				if (name !== "Epic")
					classes.push({
						id,
						name,
					});
			});

			console.log(`Retrieved ${classes.length} classes`);
		});
	}

	// Get race data:
	let races = [];
	function getRaceData() {
		let racequery = "SELECT * FROM `races` ORDER BY `races`.`name` ASC;";
		con.query(racequery, (err, result, fields) => {
			if (err) throw err;

			let total = 0;

			result.forEach(({ name }) => {
				races.push(name);
			});

			let output = [];
			races.forEach((race) => {
				output.push({
					id: race,
					label: race,
					value: 0,
				});
			});

			console.log(`Retrieved ${races.length} races`);
		});
	}

	// Get player data:
	let players = [];
	function getPlayerData(days) {
		return new Promise(async (resolve, reject) => {
			let query =
				"SELECT * FROM `players` WHERE `lastseen` >= '" +
				GetDateString(
					new Date(
						new Date(new Date().toDateString()) -
							1000 * 60 * 60 * 24 * days
					)
				) +
				"';";
			con.query(query, (err, result, fields) => {
				if (err) throw reject(err);

				result.forEach((player) => {
					players.push(player);
				});

				console.log(`Retrieved ${players.length} players`);
				resolve();
			});
		});
	}

	let population = [];
	function getPopulationData(days) {
		return new Promise(async (resolve, reject) => {
			let query =
				"SELECT * FROM `population` WHERE `datetime` >= '" +
				GetDateString(
					new Date(
						new Date(new Date().toDateString()) - 60000 * 60 * 24 * days
					)
				) +
				"' ORDER BY `population`.`datetime` ASC;";
			con.query(query, (err, result, fields) => {
				if (err) throw err;

				result.forEach((data) => {
					data.datetime = new Date(data.datetime + "Z");
					population.push(data);
				});

				console.log(
					`Retrieved ${population.length} population data points`
				);
				resolve();
			});
		});
	}

	// Select which reports to run based on the time and day
	let dayofweek = new Date().getUTCDay();
	let hourofday = new Date().getUTCHours();
	let minuteofhour = new Date().getUTCMinutes();

	// Every week
	cron.schedule("0 * * * 0", () => {
		getPopulationData(365).then(() => {
			runAnnualReport(population);
			runQuarterReport(population);
			runWeekReport(population);
			runDailyDistribution(population);
			runHourlyDistribution(population);
			runServerDistribution(population);
		});
	});

	// Every day
	cron.schedule("0 0 * * 1-6", () => {
		getPopulationData(365).then(() => {
			runQuarterReport(population);
			runWeekReport(population);
			runDailyDistribution(population);
			runHourlyDistribution(population);
			runServerDistribution(population);
		});

		getClassData();
		getRaceData();
		getPlayerData((days = 91)).then(() => {
			runClassDistribution(players, classes);
			runRaceDistribution(players, races);
			runLevelDistribution(players);
		});
	});

	// Every hour
	cron.schedule("0 0-22 * * *", () => {});

	// Every 5 minutes
	cron.schedule("0-55/5 * * * *", () => {
		getPopulationData(1).then(() => {
			runDayReport(population);
		});
	});

	// Every minute
	cron.schedule("* * * * *", () => {
		// runServerStatusReport();
	});

	// if (dayofweek * hourofday * minuteofhour === 0) {
	// 	// Run once per week
	// 	console.log("Running weekly report...");
	// 	getPopulationData(365).then(() => {
	// 		runAnnualReport(population);
	// 		runQuarterReport(population);
	// 		runWeekReport(population);
	// 		runDailyDistribution(population);
	// 		runHourlyDistribution(population);
	// 		runServerDistribution(population);
	// 	});
	// } else if (hourofday * minuteofhour === 0) {
	// 	// Run once per day
	// 	console.log("Running daily report...");
	// 	getPopulationData(365).then(() => {
	// 		runQuarterReport(population);
	// 		runWeekReport(population);
	// 		runDailyDistribution(population);
	// 		runHourlyDistribution(population);
	// 		runServerDistribution(population);
	// 	});

	// 	getClassData();
	// 	getRaceData();
	// 	getPlayerData((days = 91)).then(() => {
	// 		runClassDistribution(players, classes);
	// 		runRaceDistribution(players, races);
	// 		runLevelDistribution(players);
	// 	});
	// } else if (minuteofhour === 0) {
	// 	// Run once per hour
	// } else if (minuteofhour % 5 === 0) {
	// 	// Run every 5 minutes
	// 	getPopulationData(1).then(() => {
	// 		runDayReport(population);
	// 	});
	// } else {
	// 	// Run every time (1 minute)
	// 	// runServerStatusReport();
	// }
});
