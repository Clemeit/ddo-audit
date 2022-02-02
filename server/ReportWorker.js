// Get data once, then run all of the reports using that data...
const { ResultSetDependencies } = require("mathjs");
const {
	runClassDistribution,
} = require("./Reports/Demographics/ClassDistribution");
const {
	runRaceDistribution,
} = require("./Reports/Demographics/RaceDistribution");
const {
	runLevelDistribution,
} = require("./Reports/Demographics/LevelDistribution");

const { runAnnualReport } = require("./Reports/Population/Annual");
const { runQuarterReport } = require("./Reports/Population/Quarter");
const { runWeekReport } = require("./Reports/Population/Week");
const { runDayReport } = require("./Reports/Population/Day");

const {
	runDailyDistribution,
} = require("./Reports/Population/DailyDistribution");
const {
	runHourlyDistribution,
} = require("./Reports/Population/HourlyDistribution");
const {
	runServerDistribution,
} = require("./Reports/Population/ServerDistribution");

var mysql = require("mysql");
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

	// getClassData();
	// getRaceData();
	// getPlayerData((days = 90)).then(() => {
	// 	runClassDistribution(players, classes);
	// 	runRaceDistribution(players, races);
	// 	runLevelDistribution(players);
	// });

	getPopulationData(365).then(() => {
		runAnnualReport(population);
		runQuarterReport(population);
		runWeekReport(population);
		runDayReport(population);
		runDailyDistribution(population);
		runHourlyDistribution(population);
		runServerDistribution(population);
	});
});
