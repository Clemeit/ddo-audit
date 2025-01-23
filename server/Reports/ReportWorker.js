import cron from "node-cron";
import useQuery from "../hooks/useQuery.js";

// Get data once, then run all of the reports using that data...
import runClassDistribution from "./Demographics/ClassDistribution.js";
import runRaceDistribution from "./Demographics/RaceDistribution.js";
import runLevelDistribution from "./Demographics/LevelDistribution.js";

import runAnnualReport from "./Population/Annual.js";
import runQuarterReport from "./Population/Quarter.js";
import runWeekReport from "./Population/Week.js";
import runDayReport from "./Population/Day.js";
import runDeltaReport from "./Population/DeltaReport.js";

import runDailyDistribution from "./Population/DailyDistribution.js";
import runHourlyDistribution from "./Population/HourlyDistribution.js";
import runServerDistribution from "./Population/ServerDistribution.js";
import runUniqueReport from "./Population/UniqueCounts.js";
import runTransferReport from "./Population/Transfer.js";
import cachePlayers from "./Players/Players.js";
import runServerStatusReport from "./Game/ServerStatus.js";
import mysql from "mysql2";

import * as dotenv from "dotenv";
dotenv.config();

let mysqlConnection;

async function restartMySql() {
  return new Promise((resolve, reject) => {
    console.log("MySQL reconnecting...");
    // Try to reconnect:
    mysqlConnection = mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
    });

    mysqlConnection.connect((err) => {
      if (err) {
        console.log("Failed to reconnect. Aborting!", err);
        setTimeout(restartMySql, 5000);
        reject();
      } else {
        console.log("Reconnected!");
        resolve(mysqlConnection);
      }
    });

    mysqlConnection.on("error", (err) => {
      if (err.code === "PROTOCOL_CONNECTION_LOST") {
        console.log("MySQL connection lost. Reconnecting...");
        restartMySql();
      } else {
        console.log("MySQL connection error:", err);
        restartMySql();
      }
    });
  });
}

function runReportWorker(mysqlConnection) {
  const { queryAndRetry } = useQuery(mysqlConnection);

  console.log("Running report worker...");
  function GetDateString(datetime) {
    return `${datetime.getUTCFullYear()}-${
      datetime.getUTCMonth() + 1
    }-${datetime.getUTCDate()} 00-00-00`;
  }

  // Get class data:
  let classes = [];
  function getClassData() {
    return new Promise((resolve, reject) => {
      classes.length = 0;
      const query = "SELECT * FROM `classes` ORDER BY `classes`.`name` ASC;";
      queryAndRetry(query, 3)
        .then((result) => {
          result.forEach(({ id, name }) => {
            if (name !== "Epic" && name !== "Legendary")
              classes.push({
                id,
                name,
              });
          });

          console.log(`Retrieved ${classes.length} classes`);
          resolve();
        })
        .catch((err) => {
          console.log("Error getting class data!", err);
          reject(err);
        });
    });
  }

  // Get race data:
  let races = [];
  function getRaceData() {
    return new Promise((resolve, reject) => {
      races.length = 0;
      const query = "SELECT * FROM `races` ORDER BY `races`.`name` ASC;";
      queryAndRetry(query, 3)
        .then((result) => {
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
          resolve();
        })
        .catch((err) => {
          console.log("Error getting race data!", err);
          reject(err);
        });
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
            new Date(new Date().toDateString()) - 1000 * 60 * 60 * 24 * days
          )
        ) +
        "';";

      queryAndRetry(query, 3)
        .then((result) => {
          players.length = 0;

          result.forEach((player) => {
            players.push(player);
          });

          console.log(`Retrieved ${players.length} players`);
          resolve();
        })
        .catch((err) => {
          console.log("Error getting player data!", err);
          reject(err);
        });
    });
  }

  // Get player data to be cached for API:
  let cacheablePlayers = [];
  function getCacheablePlayerData(seconds) {
    return new Promise(async (resolve, reject) => {
      const query = `SELECT JSON_ARRAYAGG(
											JSON_OBJECT(
													'Name', IF(p.anonymous, 'Anonymous', p.name),
													'Gender', p.gender,
													'Race', p.race,
													'Guild', IF(p.anonymous, '(redacted)', p.guild),
													'Location', JSON_OBJECT('Name', IF(p.anonymous, '(redacted)', a.name), 'IsPublicSpace', a.ispublicspace, 'Region', a.region),
													'TotalLevel', totallevel,
													'Server', server,
							            'HomeServer', homeserver,
													'GroupId', CAST(groupid as char),
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
      queryAndRetry(query, 3)
        .then((result) => {
          if (result && result.length && result[0]["data"]) {
            cacheablePlayers = result[0]["data"];
          } else {
            cacheablePlayers = [];
          }

          console.log(`Retrieved ${cacheablePlayers.length} players`);
          resolve();
        })
        .catch((err) => {
          console.log("Error getting player data!", err);
          reject(err);
        });
    });
  }

  function cachePlayerData(servers) {
    return new Promise(async (resolve, reject) => {
      // prettier-ignore
      const query = `INSERT INTO players_cached (datetime, argonnessen, cannith, ghallanda, khyber, orien, sarlona, thelanis, wayfinder, hardcore, cormyr)
													 VALUES (CURRENT_TIMESTAMP, ${mysqlConnection.escape(JSON.stringify(servers[0]))}, ${mysqlConnection.escape(JSON.stringify(servers[1]))}, ${mysqlConnection.escape(JSON.stringify(servers[2]))}
													 , ${mysqlConnection.escape(JSON.stringify(servers[3]))}, ${mysqlConnection.escape(JSON.stringify(servers[4]))}, ${mysqlConnection.escape(JSON.stringify(servers[5]))}, ${mysqlConnection.escape(JSON.stringify(servers[6]))}
													 , ${mysqlConnection.escape(JSON.stringify(servers[7]))}, ${mysqlConnection.escape(JSON.stringify(servers[8]))}, ${mysqlConnection.escape(JSON.stringify(servers[9]))})`;
      queryAndRetry(query, 1)
        .then(() => {
          resolve();
        })
        .catch((err) => {
          console.log("Error caching player data!", err);
          reject(err);
        });
    });
  }

  let population = [];
  function getPopulationData(days) {
    return new Promise(async (resolve, reject) => {
      population.length = 0;
      const query =
        "SELECT * FROM `population` WHERE `datetime` >= '" +
        GetDateString(new Date(new Date().getTime() - 60000 * 60 * 24 * days)) +
        "' ORDER BY `population`.`datetime` ASC;";
      queryAndRetry(query, 3)
        .then((result) => {
          result.forEach((data) => {
            data.datetime = new Date(data.datetime + "Z");
            population.push(data);
          });

          console.log(`Retrieved ${population.length} population data points`);
          resolve();
        })
        .catch((err) => {
          console.log("Error getting population data!", err);
          reject(err);
        });
    });
  }

  // Every week
  cron.schedule("0 * * * 0", () => {
    getPopulationData(365 * 5).then(() => {
      runAnnualReport(population, "players");
      runAnnualReport(population, "lfms");
      runQuarterReport(population, "players");
      runQuarterReport(population, "lfms");
      runWeekReport(population);
      runDailyDistribution(population);
      runHourlyDistribution(population);
      runServerDistribution(population);
    });
  });

  // Every day
  cron.schedule("0 0 * * 1-6", () => {
    getPopulationData(365).then(() => {
      runQuarterReport(population, "players").then((val) => {
        runDeltaReport(val, "players");
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

    Promise.all([getClassData(), getRaceData()]).then(() => {
      getPlayerData(91).then(() => {
        runClassDistribution(players, classes, "normal");
        runRaceDistribution(players, races, "normal");
        runLevelDistribution(players, "normal");
        runClassDistribution(players, classes, "banks");
        runRaceDistribution(players, races, "banks");
        runLevelDistribution(players, "banks");
        runUniqueReport(players);
      });
    });
  });

  // Every hour (not midnight because we get duplicate data)
  // cron.schedule("0 1-23 * * *", () => {
  //   getPlayerData(91).then(() => {
  //     runTransferReport(players);
  //   });
  // });

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
  });

  // Every 30 seconds
  const doCache = () => {
    runServerStatusReport();

    // cache players so that the API can pull from cache instead of master
    var t0 = new Date();
    console.log(`Caching player data`);
    getCacheablePlayerData(90)
      .then(() => {
        if (cacheablePlayers == null || cacheablePlayers.length === 0) {
          var t1 = new Date();
          console.log(`-> Finished in ${t1 - t0}ms (NO PLAYERS!)`);
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
  };
  setInterval(doCache, 30000);
}

restartMySql().then((result) => {
  runReportWorker(result);
});
