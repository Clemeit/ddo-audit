const fs = require("fs");
require("dotenv").config();

exports.cachePlayers = (players) => {
    return new Promise((resolve, reject) => {
        var t0 = new Date();
        console.log(`Caching player data`);

        let argonnessen = { Name: "Argonnessen", Players: [], Population: 0 };
        let cannith = { Name: "Cannith", Players: [], Population: 0 };
        let ghallanda = { Name: "Ghallanda", Players: [], Population: 0 };
        let khyber = { Name: "Khyber", Players: [], Population: 0 };
        let orien = { Name: "Orien", Players: [], Population: 0 };
        let sarlona = { Name: "Sarlona", Players: [], Population: 0 };
        let thelanis = { Name: "Thelanis", Players: [], Population: 0 };
        let wayfinder = { Name: "Wayfinder", Players: [], Population: 0 };
        let hardcore = { Name: "Hardcore", Players: [], Population: 0 };

        players.forEach((player, i) => {
            if (player != null && player.Server != null) {
                switch (player.Server.toLowerCase()) {
                    case "argonnessen":
                        argonnessen.Players.push(player);
                        break;
                    case "cannith":
                        cannith.Players.push(player);
                        break;
                    case "ghallanda":
                        ghallanda.Players.push(player);
                        break;
                    case "khyber":
                        khyber.Players.push(player);
                        break;
                    case "orien":
                        orien.Players.push(player);
                        break;
                    case "sarlona":
                        sarlona.Players.push(player);
                        break;
                    case "thelanis":
                        thelanis.Players.push(player);
                        break;
                    case "wayfinder":
                        wayfinder.Players.push(player);
                        break;
                    case "hardcore":
                        hardcore.Players.push(player);
                        break;
                }
            }
        });

        argonnessen.Population = argonnessen.Players.length;
        cannith.Population = cannith.Players.length;
        ghallanda.Population = ghallanda.Players.length;
        khyber.Population = khyber.Players.length;
        orien.Population = orien.Players.length;
        sarlona.Population = sarlona.Players.length;
        thelanis.Population = thelanis.Players.length;
        wayfinder.Population = wayfinder.Players.length;
        hardcore.Population = hardcore.Players.length;

        var t1 = new Date();
        console.log(`-> Finished in ${t1 - t0}ms`);

        resolve([
            argonnessen,
            cannith,
            ghallanda,
            khyber,
            orien,
            sarlona,
            thelanis,
            wayfinder,
            hardcore,
        ]);
    });
};
