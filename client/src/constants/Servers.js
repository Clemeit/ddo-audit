import { getConfig, getValueFromLabel } from "../services/CaaS";

const SERVER_LIST = [
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

const SERVER_LIST_LOWERCASE = SERVER_LIST.map((server) => server.toLowerCase());

/**
 * This function returns a list of all DDO servers. The Hardcore
 * server may be excluded depending on the current config.
 * @returns Array of server names
 */
async function getServers() {
    const caas = await getConfig();
    if (getValueFromLabel(caas, "hardcore") === "true") {
        return SERVER_LIST;
    } else {
        return SERVER_LIST.filter((server) => server !== "Hardcore");
    }
}

const SERVER_COLORS = [
    "hsl(205, 70%, 41%)",
    "hsl(28, 100%, 53%)",
    "hsl(120, 57%, 40%)",
    "hsl(360, 69%, 50%)",
    "hsl(271, 39%, 57%)",
    "hsl(10, 30%, 42%)",
    "hsl(318, 66%, 68%)",
    "hsl(0, 0%, 50%)",
    "hsl(60, 70%, 44%)",
    "hsl(208, 100%, 50%)",
];

function getServerColorByName(serverName) {
    const index = SERVER_LIST_LOWERCASE.indexOf(serverName.toLowerCase());
    return SERVER_COLORS[index];
}

function getServerNameTitleCase(serverName) {
    const index = SERVER_LIST_LOWERCASE.indexOf(serverName.toLowerCase());
    return SERVER_LIST[index];
}

export {
    getServers,
    SERVER_LIST,
    SERVER_LIST_LOWERCASE,
    SERVER_COLORS,
    getServerColorByName,
    getServerNameTitleCase,
};
