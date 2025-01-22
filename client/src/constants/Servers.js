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
  "Cormyr"
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

export { getServers, SERVER_LIST, SERVER_LIST_LOWERCASE };
