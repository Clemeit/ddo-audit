// Browser check
// Opera 8.0+
const isOpera = !!window.opera || navigator.userAgent.indexOf(" OPR/") >= 0;

// Firefox 1.0+
const isFirefox = typeof InstallTrigger !== "undefined";

// Internet Explorer 6-11
const isIE = /*@cc_on!@*/ false || !!document.documentMode;

// Edge 20+
const isEdge = !isIE && !!window.StyleMedia;

// Chrome 1 - 71
const isChrome =
    !!window.chrome && (!!window.chrome.webstore || !!window.chrome.runtime);

export function Submit(page, element, comment, options) {
    // event.preventDefault();
    let browser;
    if (isChrome) browser = "chrome";
    else if (isFirefox) browser = "firefox";
    else if (isIE) browser = "ie";
    else if (isEdge) browser = "edge";
    else if (isOpera) browser = "opera";
    else browser = "unknown";

    // let elem = JSON.stringify(element);
    // let comm = comment;
    // let opt = JSON.stringify(options);

    const url = "https://www.playeraudit.com/api/submit";
    const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ browser, page, element, options, comment }),
    };
    fetch(url, requestOptions)
        .then((response) => console.log("Submitted successfully"))
        .catch((error) => console.log("Submission error", error));
}
