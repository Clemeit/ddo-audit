const fs = require("fs");
require("dotenv").config();
const { isPlayerActive } = require("../ActivePredicate");

exports.runUniqueReport = (players) => {
    const SERVER_NAMES = [
        "Argonnessen",
        "Cannith",
        "Ghallanda",
        "Khyber",
        "Orien",
        "Sarlona",
        "Thelanis",
        "Wayfinder",
        "Hardcore",
    ];

    var t0 = new Date();
    console.log("Running Unique Population report");

    let characters = [];
    let activecharacters = [];
    // let guilds = [];
    // let guildlist = [];
    SERVER_NAMES.forEach((server) => {
        characters.push(0);
        activecharacters.push(0);
        // guilds.push(0);
    });

    players.forEach(
        ({
            server,
            lastseen,
            lastactive,
            lastmovement,
            lastlevelup,
            totallevel,
        }) => {
            let serverindex = SERVER_NAMES.indexOf(server);
            if (serverindex != -1) {
                if (
                    isPlayerActive(
                        lastseen,
                        lastactive,
                        lastmovement,
                        lastlevelup,
                        totallevel
                    )
                ) {
                    activecharacters[serverindex]++;
                    characters[serverindex]++;
                } else {
                    characters[serverindex]++;
                }
            }
        }
    );

    let output = [];

    for (let i = 0; i < SERVER_NAMES.length; i++) {
        output.push({
            Name: SERVER_NAMES[i],
            TotalCharacters: characters[i],
            ActiveCharacters: activecharacters[i],
        });
    }

    fs.writeFile(
        `../api_v1/population/uniquedata.json`,
        JSON.stringify(output),
        (err) => {
            if (err) throw err;
        }
    );

    var t1 = new Date();
    console.log(`-> Finished in ${t1 - t0}ms`);
};
