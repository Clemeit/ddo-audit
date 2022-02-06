async function fetchArbitraryData(url, type) {
    let response = await fetch(url);
    if (type === "json") response = await response.json();
    else if (type === "text") response = await response.text();
    return response;
}

// Fetch server status
export default fetchArbitraryData(
    "https://api.ddoaudit.com/gamestatus/serverstatus",
    "json"
).then((val) => {
    return val;
});
