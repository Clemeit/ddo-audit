const cron = require("node-cron");

// Get data once, then run all of the reports using that data...
const { runClassDistribution } = require("./Demographics/ClassDistribution");
const { runRaceDistribution } = require("./Demographics/RaceDistribution");
const { runLevelDistribution } = require("./Demographics/LevelDistribution");

const { runAnnualReport } = require("./Population/Annual");
const { runQuarterReport } = require("./Population/Quarter");
const { runWeekReport } = require("./Population/Week");
const { runDayReport } = require("./Population/Day");
const { runDeltaReport } = require("./Population/DeltaReport");

const { runDailyDistribution } = require("./Population/DailyDistribution");
const { runHourlyDistribution } = require("./Population/HourlyDistribution");
const { runServerDistribution } = require("./Population/ServerDistribution");
const { runUniqueReport } = require("./Population/UniqueCounts");

const { cachePlayers } = require("./Players/Players");

const { runServerStatusReport } = require("./Game/ServerStatus");

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

con.connect((err) => {
	if (err) throw err;
	console.log("Connected to database");

	// Get class data:
	let classes = [];
	function getClassData() {
		classes.length = 0;
		let classquery =
			"SELECT * FROM `classes` ORDER BY `classes`.`name` ASC;";
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
		races.length = 0;
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
			players.length = 0;
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

	// Get player data to be cached for API:
	let cacheablePlayers = [];
	function getCacheablePlayerData(seconds) {
		return new Promise(async (resolve, reject) => {
			let query = `SELECT JSON_ARRAYAGG(
                    JSON_OBJECT(
                        'Name', IF(p.anonymous, 'Anonymous', p.name),
                        'Gender', p.gender,
                        'Race', p.race,
                        'Guild', IF(p.anonymous, '(redacted)', p.guild),
                        'Location', JSON_OBJECT('Name', IF(p.anonymous, '(redacted)', a.name), 'IsPublicSpace', a.ispublicspace, 'Region', a.region),
                        'TotalLevel', totallevel,
                        'Server', server,
                        'GroupId', groupid,
                        'InParty', IF(groupid = 0, 0, 1),
                        'Classes', JSON_ARRAY(
                            JSON_OBJECT(
                                'Name', c1.name,
                                'Level', p.level1
                            ),
                            JSON_OBJECT(
                                'Name', c2.name,
                                'Level', p.level2
                            ),
                            JSON_OBJECT(
                                'Name', c3.name,
                                'Level', p.level3
                            ),
                            JSON_OBJECT(
                                'Name', c4.name,
                                'Level', p.level4
                            ),
                            JSON_OBJECT(
                                'Name', c5.name,
                                'Level', p.level5
                            )
                        )
                    )
                ) AS data
                FROM players p 
                LEFT JOIN areas a ON p.location = a.areaid 
                LEFT JOIN classes c1 ON p.class1 = c1.id 
                LEFT JOIN classes c2 ON p.class2 = c2.id 
                LEFT JOIN classes c3 ON p.class3 = c3.id 
                LEFT JOIN classes c4 ON p.class4 = c4.id 
                LEFT JOIN classes c5 ON p.class5 = c5.id 
                WHERE p.lastseen > DATE_ADD(UTC_TIMESTAMP(), INTERVAL -${seconds} SECOND)`;

			con.query(query, (err, result, fields) => {
				if (err) throw reject(err);

				if (result && result.length && result[0]["data"]) {
					cacheablePlayers = result[0]["data"];
				} else {
					cacheablePlayers = [];
				}

				console.log(`Retrieved ${cacheablePlayers.length} players`);
				resolve();
			});
		});
	}

	function cachePlayerData(servers) {
		return new Promise(async (resolve, reject) => {
			// prettier-ignore
			let query = `INSERT INTO players_cached (datetime, argonnessen, cannith, ghallanda, khyber, orien, sarlona, thelanis, wayfinder, hardcore)
                         VALUES (CURRENT_TIMESTAMP, ${con.escape(JSON.stringify(servers[0]))}, ${con.escape(JSON.stringify(servers[1]))}, ${con.escape(JSON.stringify(servers[2]))}
                         , ${con.escape(JSON.stringify(servers[3]))}, ${con.escape(JSON.stringify(servers[4]))}, ${con.escape(JSON.stringify(servers[5]))}, ${con.escape(JSON.stringify(servers[6]))}
                         , ${con.escape(JSON.stringify(servers[7]))}, ${con.escape(JSON.stringify(servers[8]))})`;

			con.query(query, (err, result, fields) => {
				if (err) reject(err);
				resolve();
			});
		});
	}

	let population = [];
	function getPopulationData(days) {
		return new Promise(async (resolve, reject) => {
			population.length = 0;
			let query =
				"SELECT * FROM `population` WHERE `datetime` >= '" +
				GetDateString(
					new Date(new Date().getTime() - 60000 * 60 * 24 * days)
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

	// Every week
	// cron.schedule("0 * * * 0", () => {
	getPopulationData(365 * 2).then(() => {
		runAnnualReport(population);
		runQuarterReport(population);
		runWeekReport(population);
		runDailyDistribution(population);
		runHourlyDistribution(population);
		runServerDistribution(population);
	});
	// });

	// Every day
	cron.schedule("0 0 * * 1-6", () => {
		getPopulationData(365).then(() => {
			runQuarterReport(population, "population").then((val) => {
				runDeltaReport(val, "population");
			});
			runQuarterReport(population, "groups").then((val) => {
				runDeltaReport(val, "groups");
			});

			runWeekReport(population);
			runDailyDistribution(population, "population");
			runHourlyDistribution(population, "population");
			runServerDistribution(population, "population");
			runDailyDistribution(population, "groups");
			runHourlyDistribution(population, "groups");
			runServerDistribution(population, "groups");
		});

		getClassData();
		getRaceData();
		getPlayerData((days = 91)).then(() => {
			runClassDistribution(players, classes, "normal");
			runRaceDistribution(players, races, "normal");
			runLevelDistribution(players, "normal");
			runClassDistribution(players, classes, "banks");
			runRaceDistribution(players, races, "banks");
			runLevelDistribution(players, "banks");
			runUniqueReport(players);
		});
	});

	// Every hour
	cron.schedule("0 0-22 * * *", () => {});

	// Every 5 minutes
	cron.schedule("1-56/5 * * * *", () => {
		getPopulationData(1).then(() => {
			runDayReport(population, "population");
			runDayReport(population, "groups");
		});
	});

	// Every minute
	cron.schedule("* * * * *", () => {
		runServerStatusReport();

		// cache players so that the API can pull from cache instead of master
		var t0 = new Date();
		console.log(`Caching player data`);
		getCacheablePlayerData(90)
			.then(() => {
				if (cacheablePlayers == null || cacheablePlayers.length === 0) {
					var t1 = new Date();
					console.log(`-> Finished in ${t1 - t0}ms`);
				} else {
					cachePlayers(cacheablePlayers).then((servers) =>
						cachePlayerData(servers).then(() => {
							var t1 = new Date();
							console.log(`-> Finished in ${t1 - t0}ms`);
						})
					);
				}
			})
			.catch((err) => console.log(err));
	});
});
