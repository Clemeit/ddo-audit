"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const ActivePredicate_js_1 = __importDefault(require("../ActivePredicate.js"));
const runUniqueReport = (players) => {
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
    let guilds = [];
    SERVER_NAMES.forEach((server) => {
        characters.push(0);
        activecharacters.push(0);
        guilds.push([]);
    });
    players.forEach(({ server, guild, lastseen, lastactive, lastmovement, lastlevelup, totallevel, }) => {
        let serverindex = SERVER_NAMES.indexOf(server);
        if (serverindex != -1) {
            if ((0, ActivePredicate_js_1.default)(lastseen, lastactive, lastmovement, lastlevelup, totallevel)) {
                activecharacters[serverindex]++;
                characters[serverindex]++;
            }
            else {
                characters[serverindex]++;
            }
            if (!guilds[serverindex].includes(guild)) {
                guilds[serverindex].push(guild);
            }
        }
    });
    let output = [];
    for (let i = 0; i < SERVER_NAMES.length; i++) {
        output.push({
            Name: SERVER_NAMES[i],
            TotalCharacters: characters[i],
            ActiveCharacters: activecharacters[i],
            TotalGuilds: guilds[i].length,
        });
    }
    fs_1.default.writeFile(`../api_v1/population/uniquedata.json`, JSON.stringify(output), (err) => {
        if (err)
            throw err;
    });
    var t1 = new Date();
    console.log(`-> Finished in ${t1 - t0}ms`);
};
exports.default = runUniqueReport;
