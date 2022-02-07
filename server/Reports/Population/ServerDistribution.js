const fs = require("fs");
require("dotenv").config();

exports.runServerDistribution = (population, reporttype) => {
    var t0 = new Date();
    console.log("Running Server Distribution report");

    const IGNORE_DOWNTIME = true;

    let a_count = 0;
    let c_count = 0;
    let g_count = 0;
    let k_count = 0;
    let o_count = 0;
    let s_count = 0;
    let t_count = 0;
    let w_count = 0;
    let h_count = 0;

    let Argonnessen = {
        id: "Argonnessen",
        label: "Argonnessen",
        color: "hsl(205, 70%, 41%)",
        value: 0,
    };
    let Cannith = {
        id: "Cannith",
        label: "Cannith",
        color: "hsl(28, 100%, 53%)",
        value: 0,
    };
    let Ghallanda = {
        id: "Ghallanda",
        label: "Ghallanda",
        color: "hsl(120, 57%, 40%)",
        value: 0,
    };
    let Khyber = {
        id: "Khyber",
        label: "Khyber",
        color: "hsl(360, 69%, 50%)",
        value: 0,
    };
    let Orien = {
        id: "Orien",
        label: "Orien",
        color: "hsl(271, 39%, 57%)",
        value: 0,
    };
    let Sarlona = {
        id: "Sarlona",
        label: "Sarlona",
        color: "hsl(10, 30%, 42%)",
        value: 0,
    };
    let Thelanis = {
        id: "Thelanis",
        label: "Thelanis",
        color: "hsl(318, 66%, 68%)",
        value: 0,
    };
    let Wayfinder = {
        id: "Wayfinder",
        label: "Wayfinder",
        color: "hsl(0, 0%, 50%)",
        value: 0,
    };
    let Hardcore = {
        id: "Hardcore",
        label: "Hardcore",
        color: "hsl(60, 70%, 44%)",
        value: 0,
    };
    let Total = {
        id: "Total",
        label: "Total",
        color: "hsl(208, 100%, 50%)",
        value: 0,
    };

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
            argonnessen_lfmcount,
            cannith_lfmcount,
            ghallanda_lfmcount,
            khyber_lfmcount,
            orien_lfmcount,
            sarlona_lfmcount,
            thelanis_lfmcount,
            wayfinder_lfmcount,
            hardcore_lfmcount,
        }) => {
            if (
                new Date().getTime() - datetime.getTime() <=
                1000 * 60 * 60 * 24 * 91
            ) {
                // datetime = new Date(datetime.getTime() - 1000 * 60 * 60 * 5); // UTC -> EST
                if (reporttype === "population") {
                    if (argonnessen_playercount || !IGNORE_DOWNTIME) {
                        Argonnessen.value += argonnessen_playercount;
                        a_count++;
                    }
                    if (cannith_playercount || !IGNORE_DOWNTIME) {
                        Cannith.value += cannith_playercount;
                        c_count++;
                    }
                    if (ghallanda_playercount || !IGNORE_DOWNTIME) {
                        Ghallanda.value += ghallanda_playercount;
                        g_count++;
                    }
                    if (khyber_playercount || !IGNORE_DOWNTIME) {
                        Khyber.value += khyber_playercount;
                        k_count++;
                    }
                    if (orien_playercount || !IGNORE_DOWNTIME) {
                        Orien.value += orien_playercount;
                        o_count++;
                    }
                    if (sarlona_playercount || !IGNORE_DOWNTIME) {
                        Sarlona.value += sarlona_playercount;
                        s_count++;
                    }
                    if (thelanis_playercount || !IGNORE_DOWNTIME) {
                        Thelanis.value += thelanis_playercount;
                        t_count++;
                    }
                    if (wayfinder_playercount || !IGNORE_DOWNTIME) {
                        Wayfinder.value += wayfinder_playercount;
                        w_count++;
                    }
                    if (hardcore_playercount || !IGNORE_DOWNTIME) {
                        Hardcore.value += hardcore_playercount;
                        h_count++;
                    }
                } else {
                    Argonnessen.value += argonnessen_lfmcount;
                    a_count++;

                    Cannith.value += cannith_lfmcount;
                    c_count++;

                    Ghallanda.value += ghallanda_lfmcount;
                    g_count++;

                    Khyber.value += khyber_lfmcount;
                    k_count++;

                    Orien.value += orien_lfmcount;
                    o_count++;

                    Sarlona.value += sarlona_lfmcount;
                    s_count++;

                    Thelanis.value += thelanis_lfmcount;
                    t_count++;

                    Wayfinder.value += wayfinder_lfmcount;
                    w_count++;

                    Hardcore.value += hardcore_lfmcount;
                    h_count++;
                }
            }
        }
    );

    Argonnessen.value = Math.round((Argonnessen.value / a_count) * 100) / 100;
    Cannith.value = Math.round((Cannith.value / c_count) * 100) / 100;
    Ghallanda.value = Math.round((Ghallanda.value / g_count) * 100) / 100;
    Khyber.value = Math.round((Khyber.value / k_count) * 100) / 100;
    Orien.value = Math.round((Orien.value / o_count) * 100) / 100;
    Sarlona.value = Math.round((Sarlona.value / s_count) * 100) / 100;
    Thelanis.value = Math.round((Thelanis.value / t_count) * 100) / 100;
    Wayfinder.value = Math.round((Wayfinder.value / w_count) * 100) / 100;
    Hardcore.value = Math.round((Hardcore.value / h_count) * 100) / 100;

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
    ];

    output.reverse();

    fs.writeFile(
        `../api_v1/population/serverdistributionquarter${
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
