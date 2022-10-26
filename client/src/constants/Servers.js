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

async function getServers() {
    const response = await Fetch(
        "https://api.ddoaudit.com/caas?label=hardcore",
        2000
    );
    if (response?.value === "true") {
        return SERVER_LIST;
    } else {
        return SERVER_LIST.filter((server) => server !== "Hardcore");
    }
}

export { getServers, SERVER_LIST, SERVER_LIST_LOWERCASE };
