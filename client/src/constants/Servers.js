import { Fetch } from "../services/DataLoader";

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

function showHardcoreLeague() {
    try {
        const response = Fetch(
            "https://api.ddoaudit.com/caas?label=hardcore",
            2000
        );
        return response?.value === "true";
    } catch (err) {
        return true;
    }
}

async function getServers() {
    if (showHardcoreLeague()) {
        return SERVER_LIST;
    } else {
        return SERVER_LIST.filter((server) => server !== "Hardcore");
    }
}

export { getServers, SERVER_LIST, SERVER_LIST_LOWERCASE };
