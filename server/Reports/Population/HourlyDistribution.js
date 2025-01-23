import fs from "fs";

const runHourlyDistribution = (population, reporttype) => {
  function mod(n, m) {
    return ((n % m) + m) % m;
  }

  const days = 30;
  const hardcoreSeasonStart = new Date(2022, 11, 7);
  var t0 = new Date();
  console.log("Running Hourly Distribution report");

  const IGNORE_DOWNTIME = true;

  let a_count = [
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  ];
  let c_count = [
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  ];
  let g_count = [
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  ];
  let k_count = [
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  ];
  let o_count = [
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  ];
  let s_count = [
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  ];
  let t_count = [
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  ];
  let w_count = [
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  ];
  let h_count = [
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  ];

  let Argonnessen = {
    id: "Argonnessen",
    color: "hsl(205, 70%, 41%)",
    data: [],
  };
  let Cannith = {
    id: "Cannith",
    color: "hsl(28, 100%, 53%)",
    data: [],
  };
  let Ghallanda = {
    id: "Ghallanda",
    color: "hsl(120, 57%, 40%)",
    data: [],
  };
  let Khyber = {
    id: "Khyber",
    color: "hsl(360, 69%, 50%)",
    data: [],
  };
  let Orien = {
    id: "Orien",
    color: "hsl(271, 39%, 57%)",
    data: [],
  };
  let Sarlona = {
    id: "Sarlona",
    color: "hsl(10, 30%, 42%)",
    data: [],
  };
  let Thelanis = {
    id: "Thelanis",
    color: "hsl(318, 66%, 68%)",
    data: [],
  };
  let Wayfinder = {
    id: "Wayfinder",
    color: "hsl(0, 0%, 50%)",
    data: [],
  };
  let Hardcore = {
    id: "Hardcore",
    color: "hsl(60, 70%, 44%)",
    data: [],
  };
  let Cormyr = {
    id: "Cormyr",
    color: "hsl(167, 72.00%, 49.00%)",
    data: [],
  }

  for (let i = 0; i < 24; i++) {
    Argonnessen.data.push({ x: i, y: 0 });
    Cannith.data.push({ x: i, y: 0 });
    Ghallanda.data.push({ x: i, y: 0 });
    Khyber.data.push({ x: i, y: 0 });
    Orien.data.push({ x: i, y: 0 });
    Sarlona.data.push({ x: i, y: 0 });
    Thelanis.data.push({ x: i, y: 0 });
    Wayfinder.data.push({ x: i, y: 0 });
    Hardcore.data.push({ x: i, y: 0 });
    Cormyr.data.push({ x: i, y: 0 });
  }

  population.forEach(
    ({
      datetime,
      argonnessen_playercount,
      cannith_playercount,
      ghallanda_playercount,
      khyber_playercount,
      orien_playercount,
      sarlona_playercount,
      thelanis_playercount,
      wayfinder_playercount,
      hardcore_playercount,
      cormyr_playercount,
      argonnessen_lfmcount,
      cannith_lfmcount,
      ghallanda_lfmcount,
      khyber_lfmcount,
      orien_lfmcount,
      sarlona_lfmcount,
      thelanis_lfmcount,
      wayfinder_lfmcount,
      hardcore_lfmcount,
      cormyr_lfmcount,
    }) => {
      if (
        new Date().getTime() - datetime.getTime() <=
        1000 * 60 * 60 * 24 * days
      ) {
        // Get the current hour:
        let hour = mod(datetime.getUTCHours() - 5, 24); // UTC -> EST

        if (reporttype === "population") {
          if (argonnessen_playercount || !IGNORE_DOWNTIME) {
            Argonnessen.data[hour].y += argonnessen_playercount;
            a_count[hour]++;
          }
          if (cannith_playercount || !IGNORE_DOWNTIME) {
            Cannith.data[hour].y += cannith_playercount;
            c_count[hour]++;
          }
          if (ghallanda_playercount || !IGNORE_DOWNTIME) {
            Ghallanda.data[hour].y += ghallanda_playercount;
            g_count[hour]++;
          }
          if (khyber_playercount || !IGNORE_DOWNTIME) {
            Khyber.data[hour].y += khyber_playercount;
            k_count[hour]++;
          }
          if (orien_playercount || !IGNORE_DOWNTIME) {
            Orien.data[hour].y += orien_playercount;
            o_count[hour]++;
          }
          if (sarlona_playercount || !IGNORE_DOWNTIME) {
            Sarlona.data[hour].y += sarlona_playercount;
            s_count[hour]++;
          }
          if (thelanis_playercount || !IGNORE_DOWNTIME) {
            Thelanis.data[hour].y += thelanis_playercount;
            t_count[hour]++;
          }
          if (wayfinder_playercount || !IGNORE_DOWNTIME) {
            Wayfinder.data[hour].y += wayfinder_playercount;
            w_count[hour]++;
          }
          if (
            (hardcore_playercount || !IGNORE_DOWNTIME) &&
            datetime.getTime() - hardcoreSeasonStart.getTime() > 0
          ) {
            Hardcore.data[hour].y += hardcore_playercount;
            h_count[hour]++;
          }
          if (cormyr_playercount || !IGNORE_DOWNTIME) {
            Cormyr.data[hour].y += cormyr_playercount;
            w_count[hour]++;
          }
        } else {
          Argonnessen.data[hour].y += argonnessen_lfmcount;
          a_count[hour]++;

          Cannith.data[hour].y += cannith_lfmcount;
          c_count[hour]++;

          Ghallanda.data[hour].y += ghallanda_lfmcount;
          g_count[hour]++;

          Khyber.data[hour].y += khyber_lfmcount;
          k_count[hour]++;

          Orien.data[hour].y += orien_lfmcount;
          o_count[hour]++;

          Sarlona.data[hour].y += sarlona_lfmcount;
          s_count[hour]++;

          Thelanis.data[hour].y += thelanis_lfmcount;
          t_count[hour]++;

          Wayfinder.data[hour].y += wayfinder_lfmcount;
          w_count[hour]++;

          if (datetime.getTime() - hardcoreSeasonStart.getTime() > 0) {
            Hardcore.data[hour].y += hardcore_lfmcount;
            h_count[hour]++;
          }

          Cormyr.data[hour].y += cormyr_lfmcount;
          w_count[hour]++;
        }
      }
    }
  );

  for (let i = 0; i < 24; i++) {
    Argonnessen.data[i].y =
      Math.round((Argonnessen.data[i].y / a_count[i]) * 100) / 100;
    Cannith.data[i].y =
      Math.round((Cannith.data[i].y / c_count[i]) * 100) / 100;
    Ghallanda.data[i].y =
      Math.round((Ghallanda.data[i].y / g_count[i]) * 100) / 100;
    Khyber.data[i].y = Math.round((Khyber.data[i].y / k_count[i]) * 100) / 100;
    Orien.data[i].y = Math.round((Orien.data[i].y / o_count[i]) * 100) / 100;
    Sarlona.data[i].y =
      Math.round((Sarlona.data[i].y / s_count[i]) * 100) / 100;
    Thelanis.data[i].y =
      Math.round((Thelanis.data[i].y / t_count[i]) * 100) / 100;
    Wayfinder.data[i].y =
      Math.round((Wayfinder.data[i].y / w_count[i]) * 100) / 100;
    Hardcore.data[i].y =
      Math.round((Hardcore.data[i].y / h_count[i]) * 100) / 100;
    Cormyr.data[i].y =
      Math.round((Cormyr.data[i].y / h_count[i]) * 100) / 100;
  }

  let output = [
    Argonnessen,
    Cannith,
    Ghallanda,
    Khyber,
    Orien,
    Sarlona,
    Thelanis,
    Wayfinder,
    Hardcore,
    Cormyr,
  ];

  output.reverse();

  fs.writeFile(
    `../api_v1/population/hourlydistributionquarter${
      reporttype === "population" ? "" : "_groups"
    }.json`,
    JSON.stringify(output),
    (err) => {
      if (err) throw err;
    }
  );

  var t1 = new Date();
  console.log(`Finished in ${t1 - t0}ms`);
};

export default runHourlyDistribution;
