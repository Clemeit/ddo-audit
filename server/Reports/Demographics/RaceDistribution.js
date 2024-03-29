import fs from "fs";
import isPlayerActive from "../ActivePredicate.js";

const runRaceDistribution = (players, races, reporttype) => {
  const IGNORE_DOWNTIME = true;
  const includeLastSeen = true;

  var t0 = new Date();
  console.log("Running Race Distribution report");

  let total = 0;
  let output = [];
  races.forEach((race) => {
    output.push({
      id: race,
      label: race,
      value: 0,
    });
  });

  players.forEach(
    ({ race, lastseen, lastactive, lastmovement, lastlevelup, totallevel }) => {
      if (
        reporttype === "normal"
          ? isPlayerActive(
              lastseen,
              lastactive,
              lastmovement,
              lastlevelup,
              totallevel,
              includeLastSeen
            )
          : !isPlayerActive(
              lastseen,
              lastactive,
              lastmovement,
              lastlevelup,
              totallevel,
              includeLastSeen
            )
      ) {
        for (let i = 0; i < races.length; i++) {
          if (output[i].id == race) {
            output[i].value++;
          }
        }
        total++;
      }
    }
  );

  for (let i = 0; i < output.length; i++) {
    output[i].value = Math.round((output[i].value / total) * 10000) / 100;
  }

  fs.writeFile(
    `../api_v1/demographics/racedistributionquarter${
      reporttype === "normal" ? "" : "_banks"
    }.json`,
    JSON.stringify(output),
    (err) => {
      if (err) throw err;
    }
  );

  var t1 = new Date();
  console.log(`-> Finished in ${t1 - t0}ms`);
};

export default runRaceDistribution;
