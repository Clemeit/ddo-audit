import { Fetch } from "./DataLoader";

const CAAS_LIFETIME = 1000 * 60 * 60 * 2; // Cache for 2 hours

/**
 * Returns cached config or, if the cached config has expired,
 * makes a network call to CaaS to fetch an up-to-date config.
 * @returns Config object from cache or CaaS
 */
async function getConfig() {
    try {
        const cachedCaaS = localStorage.getItem("caas");
        const caas = JSON.parse(cachedCaaS);
        const caasExists = cachedCaaS != null;
        const caasExpired =
            caas.fetched == null ||
            new Date().getTime() - caas.fetched > CAAS_LIFETIME;

        if (caasExists && !caasExpired) {
            return caas.caas;
        }
    } catch (err) {}
    const caas = await Fetch("https://api.ddoaudit.com/caas", 2000);
    localStorage.setItem(
        "caas",
        JSON.stringify({ caas, fetched: new Date().getTime() })
    );
    return caas;
}

function getValueFromLabel(caas, label) {
    let result = "";
    if (Array.isArray(caas)) {
        caas.forEach((entry) => {
            if (entry.label === label) result = entry.value;
        });
    }
    return result;
}

export { getConfig, getValueFromLabel };
