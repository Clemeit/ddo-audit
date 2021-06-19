async function fetchArbitraryData(url, type) {
    let response = await fetch(url);
    if (type === "json") response = await response.json();
    else if (type === "text") response = await response.text();
    return response;
}

export async function Fetch(url, timeout) {
    let ret = new Promise(async (resolve, reject) => {
        setTimeout(() => {
            if (!ret.isResolved) {
                reject();
            }
        }, timeout);

        await fetchArbitraryData(url, "json")
            .then((val) => {
                resolve(val);
            })
            .catch((val) => {
                console.log("Failed to fetch group data");
            });
    });
    return ret;
}

export function VerifyLfmData(data) {
    if (data === null) return false;
    if (data.length !== 9) return false;
    let missingfields = false;
    data.forEach((server) => {
        if (server.Name === undefined) missingfields = true;
        if (server.LastUpdateTime === undefined) missingfields = true;
        if (server.Groups === undefined) missingfields = true;
        if (server.GroupCount === undefined) missingfields = true;
    });
    if (missingfields) return false;
    return true;
}

// export default run;
