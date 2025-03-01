import fs from "fs";

const runQuarterReport = (population, reportType) => {
  // const hardcoreSeasonStart = new Date(2022, 11, 7);

  return new Promise(async (resolve, reject) => {
    var t0 = new Date();
    console.log(`Running Quarterly Population report (${reportType})`);

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
    let Total = {
      id: "Total",
      color: "hsl(208, 100%, 50%)",
      data: [],
    };
    let Maximum = {
      id: "Maximum",
      color: "hsl(123, 100%, 50%)",
      data: [],
    };
    let Minimum = {
      id: "Minimum",
      color: "hsl(0, 100%, 50%)",
      data: [],
    };

    let lastDay = -1;
    let entriesThisDay = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    let maximumThisDay = -1;
    let minimumThisDay = -1;

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
          1000 * 60 * 60 * 24 * 91
        ) {
          // datetime = new Date(datetime.getTime() - 1000 * 60 * 60 * 5); // UTC -> EST
          datetime = new Date(
            new Date(Date.parse(datetime.toDateString())) - 60000 * 60 * 12
          );
          let thisDay = new Date(Date.parse(datetime)).getUTCDate();
          if (lastDay === -1) {
            lastDay = thisDay;

            Argonnessen.data.push({
              x: datetime,
              y: 0,
            });
            Cannith.data.push({
              x: datetime,
              y: 0,
            });
            Ghallanda.data.push({
              x: datetime,
              y: 0,
            });
            Khyber.data.push({
              x: datetime,
              y: 0,
            });
            Orien.data.push({
              x: datetime,
              y: 0,
            });
            Sarlona.data.push({
              x: datetime,
              y: 0,
            });
            Thelanis.data.push({
              x: datetime,
              y: 0,
            });
            Wayfinder.data.push({
              x: datetime,
              y: 0,
            });
            Hardcore.data.push({
              x: datetime,
              y: 0,
            });
            Cormyr.data.push({
              x: datetime,
              y: 0,
            });
            Total.data.push({
              x: datetime,
              y: 0,
            });

            entriesThisDay = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
          } else {
            if (thisDay !== lastDay) {
              // Report
              for (let i = 0; i < 10; i++) {
                if (entriesThisDay[i] === 0) {
                  entriesThisDay[i] = 1;
                }
              }

              Argonnessen.data[Argonnessen.data.length - 1].y =
                Math.round(
                  (Argonnessen.data[Argonnessen.data.length - 1].y /
                    entriesThisDay[0]) *
                    100
                ) / 100;

              Cannith.data[Cannith.data.length - 1].y =
                Math.round(
                  (Cannith.data[Cannith.data.length - 1].y /
                    entriesThisDay[1]) *
                    100
                ) / 100;

              Ghallanda.data[Ghallanda.data.length - 1].y =
                Math.round(
                  (Ghallanda.data[Ghallanda.data.length - 1].y /
                    entriesThisDay[2]) *
                    100
                ) / 100;

              Khyber.data[Khyber.data.length - 1].y =
                Math.round(
                  (Khyber.data[Khyber.data.length - 1].y / entriesThisDay[3]) *
                    100
                ) / 100;

              Orien.data[Orien.data.length - 1].y =
                Math.round(
                  (Orien.data[Orien.data.length - 1].y / entriesThisDay[4]) *
                    100
                ) / 100;

              Sarlona.data[Sarlona.data.length - 1].y =
                Math.round(
                  (Sarlona.data[Sarlona.data.length - 1].y /
                    entriesThisDay[5]) *
                    100
                ) / 100;

              Thelanis.data[Thelanis.data.length - 1].y =
                Math.round(
                  (Thelanis.data[Thelanis.data.length - 1].y /
                    entriesThisDay[6]) *
                    100
                ) / 100;

              Wayfinder.data[Wayfinder.data.length - 1].y =
                Math.round(
                  (Wayfinder.data[Wayfinder.data.length - 1].y /
                    entriesThisDay[7]) *
                    100
                ) / 100;

              Hardcore.data[Hardcore.data.length - 1].y =
                Math.round(
                  (Hardcore.data[Hardcore.data.length - 1].y /
                    entriesThisDay[8]) *
                    100
                ) / 100;

              Cormyr.data[Cormyr.data.length - 1].y =
                Math.round(
                  (Cormyr.data[Cormyr.data.length - 1].y /
                    entriesThisDay[7]) *
                    100
                ) / 100;

              Total.data[Total.data.length - 1].y =
                Math.round(
                  (Total.data[Total.data.length - 1].y / entriesThisDay[9]) *
                    100
                ) / 100;

              Argonnessen.data.push({
                x: datetime,
                y: 0,
              });
              Cannith.data.push({
                x: datetime,
                y: 0,
              });
              Ghallanda.data.push({
                x: datetime,
                y: 0,
              });
              Khyber.data.push({
                x: datetime,
                y: 0,
              });
              Orien.data.push({
                x: datetime,
                y: 0,
              });
              Sarlona.data.push({
                x: datetime,
                y: 0,
              });
              Thelanis.data.push({
                x: datetime,
                y: 0,
              });
              Wayfinder.data.push({
                x: datetime,
                y: 0,
              });
              Hardcore.data.push({
                x: datetime,
                y: 0,
              });
              Cormyr.data.push({
                x: datetime,
                y: 0,
              });
              Total.data.push({
                x: datetime,
                y: 0,
              });
              Maximum.data.push({
                x: datetime,
                y: maximumThisDay,
              });
              Minimum.data.push({
                x: datetime,
                y: minimumThisDay,
              });

              entriesThisDay = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
              maximumThisDay = -1;
              minimumThisDay = -1;

              lastDay = thisDay;
            } else {
              // Increment
              let totalnow = 0;
              if (reportType === "players") {
                if (argonnessen_playercount) {
                  Argonnessen.data[Argonnessen.data.length - 1].y +=
                    argonnessen_playercount;
                  entriesThisDay[0]++;
                }

                if (cannith_playercount) {
                  Cannith.data[Cannith.data.length - 1].y +=
                    cannith_playercount;
                  entriesThisDay[1]++;
                }

                if (ghallanda_playercount) {
                  Ghallanda.data[Ghallanda.data.length - 1].y +=
                    ghallanda_playercount;
                  entriesThisDay[2]++;
                }

                if (khyber_playercount) {
                  Khyber.data[Khyber.data.length - 1].y += khyber_playercount;
                  entriesThisDay[3]++;
                }

                if (orien_playercount) {
                  Orien.data[Orien.data.length - 1].y += orien_playercount;
                  entriesThisDay[4]++;
                }

                if (sarlona_playercount) {
                  Sarlona.data[Sarlona.data.length - 1].y +=
                    sarlona_playercount;
                  entriesThisDay[5]++;
                }

                if (thelanis_playercount) {
                  Thelanis.data[Thelanis.data.length - 1].y +=
                    thelanis_playercount;
                  entriesThisDay[6]++;
                }

                if (wayfinder_playercount) {
                  Wayfinder.data[Wayfinder.data.length - 1].y +=
                    wayfinder_playercount;
                  entriesThisDay[7]++;
                }

                if (hardcore_playercount) {
                  Hardcore.data[Hardcore.data.length - 1].y +=
                    hardcore_playercount;
                  entriesThisDay[8]++;
                }

                if (cormyr_playercount) {
                  Cormyr.data[Cormyr.data.length - 1].y +=
                    cormyr_playercount;
                  entriesThisDay[7]++;
                }

                totalnow =
                  argonnessen_playercount +
                  cannith_playercount +
                  ghallanda_playercount +
                  khyber_playercount +
                  orien_playercount +
                  sarlona_playercount +
                  thelanis_playercount +
                  wayfinder_playercount +
                  hardcore_playercount +
                  cormyr_playercount;
              } else {
                Argonnessen.data[Argonnessen.data.length - 1].y +=
                  argonnessen_lfmcount;
                entriesThisDay[0]++;

                Cannith.data[Cannith.data.length - 1].y += cannith_lfmcount;
                entriesThisDay[1]++;

                Ghallanda.data[Ghallanda.data.length - 1].y +=
                  ghallanda_lfmcount;
                entriesThisDay[2]++;

                Khyber.data[Khyber.data.length - 1].y += khyber_lfmcount;
                entriesThisDay[3]++;

                Orien.data[Orien.data.length - 1].y += orien_lfmcount;
                entriesThisDay[4]++;

                Sarlona.data[Sarlona.data.length - 1].y += sarlona_lfmcount;
                entriesThisDay[5]++;

                Thelanis.data[Thelanis.data.length - 1].y += thelanis_lfmcount;
                entriesThisDay[6]++;

                Wayfinder.data[Wayfinder.data.length - 1].y +=
                  wayfinder_lfmcount;
                entriesThisDay[7]++;

                // if (
                // 	datetime.getTime() -
                // 		hardcoreSeasonStart.getTime() >
                // 	0
                // ) {
                Hardcore.data[Hardcore.data.length - 1].y += hardcore_lfmcount;
                entriesThisDay[8]++;
                // }

                Cormyr.data[Cormyr.data.length - 1].y +=
                  cormyr_lfmcount;
                entriesThisDay[7]++;

                totalnow =
                  argonnessen_lfmcount +
                  cannith_lfmcount +
                  ghallanda_lfmcount +
                  khyber_lfmcount +
                  orien_lfmcount +
                  sarlona_lfmcount +
                  thelanis_lfmcount +
                  wayfinder_lfmcount +
                  hardcore_lfmcount +
                  cormyr_lfmcount;
              }

              if (totalnow) {
                Total.data[Total.data.length - 1].y += totalnow;
                entriesThisDay[9]++;
              }

              if (totalnow > maximumThisDay || maximumThisDay === -1) {
                maximumThisDay = totalnow;
              }
              if (totalnow < minimumThisDay || minimumThisDay === -1) {
                minimumThisDay = totalnow;
              }
            }
          }
        }
      }
    );

    // Report
    for (let i = 0; i < 10; i++) {
      if (entriesThisDay[i] === 0) {
        entriesThisDay[i] = 1;
      }
    }

    Argonnessen.data[Argonnessen.data.length - 1].y =
      Math.round(
        (Argonnessen.data[Argonnessen.data.length - 1].y / entriesThisDay[0]) *
          100
      ) / 100;

    Cannith.data[Cannith.data.length - 1].y =
      Math.round(
        (Cannith.data[Cannith.data.length - 1].y / entriesThisDay[1]) * 100
      ) / 100;

    Ghallanda.data[Ghallanda.data.length - 1].y =
      Math.round(
        (Ghallanda.data[Ghallanda.data.length - 1].y / entriesThisDay[2]) * 100
      ) / 100;

    Khyber.data[Khyber.data.length - 1].y =
      Math.round(
        (Khyber.data[Khyber.data.length - 1].y / entriesThisDay[3]) * 100
      ) / 100;

    Orien.data[Orien.data.length - 1].y =
      Math.round(
        (Orien.data[Orien.data.length - 1].y / entriesThisDay[4]) * 100
      ) / 100;

    Sarlona.data[Sarlona.data.length - 1].y =
      Math.round(
        (Sarlona.data[Sarlona.data.length - 1].y / entriesThisDay[5]) * 100
      ) / 100;

    Thelanis.data[Thelanis.data.length - 1].y =
      Math.round(
        (Thelanis.data[Thelanis.data.length - 1].y / entriesThisDay[6]) * 100
      ) / 100;

    Wayfinder.data[Wayfinder.data.length - 1].y =
      Math.round(
        (Wayfinder.data[Wayfinder.data.length - 1].y / entriesThisDay[7]) * 100
      ) / 100;

    Hardcore.data[Hardcore.data.length - 1].y =
      Math.round(
        (Hardcore.data[Hardcore.data.length - 1].y / entriesThisDay[8]) * 100
      ) / 100;

    Cormyr.data[Cormyr.data.length - 1].y =
      Math.round(
        (Cormyr.data[Cormyr.data.length - 1].y / entriesThisDay[7]) * 100
      ) / 100;

    Total.data[Total.data.length - 1].y =
      Math.round(
        (Total.data[Total.data.length - 1].y / entriesThisDay[9]) * 100
      ) / 100;

    let nivoData = [
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
      Total,
      Minimum,
      Maximum,
    ];

    nivoData.reverse();

    fs.writeFile(
      `../api_v1/population/quarter${
        reportType === "players" ? "" : "_groups"
      }.json`,
      JSON.stringify(nivoData),
      (err) => {
        if (err) throw err;
      }
    );

    var t1 = new Date();
    console.log(`Finished in ${t1 - t0}ms`);

    resolve(Total.data);
  });
};

export default runQuarterReport;
