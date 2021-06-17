function Log(event, meta) {
    const url = "https://www.playeraudit.com/api/logevent";
    const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ event, meta }),
    };
    fetch(url, requestOptions);
}

export default Log;
