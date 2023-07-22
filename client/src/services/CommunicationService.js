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

const LOG_USER_EVENTS = true;

export async function Submit(title, comment) {
  // event.preventDefault();
  let browser;
  if (isChrome) browser = "chrome";
  else if (isFirefox) browser = "firefox";
  else if (isIE) browser = "ie";
  else if (isEdge) browser = "edge";
  else if (isOpera) browser = "opera";
  else browser = "unknown";

  const url = "https://api.ddoaudit.com/submitmessage";
  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ browser, title, comment }),
  };
  console.log(JSON.stringify({ browser, title, comment }));
  try {
    const res = await fetch(url, requestOptions);
    const response = await res.json();
    return response;
  } catch (error) {
    console.log("Submission error", error);
  }
}

export function Log(event, meta = "") {
  if (!LOG_USER_EVENTS) return;
  const url = "https://api.ddoaudit.com/log";
  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ event, meta }),
  };

  fetch(url, requestOptions)
    .then((res) => res.json())
    .then((response) => {})
    .catch((error) => {});
}
