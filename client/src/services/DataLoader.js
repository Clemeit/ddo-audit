async function fetchArbitraryData(url, type) {
  let response = await fetch(url);
  if (type === "json") response = await response.json();
  else if (type === "text") response = await response.text();
  return response;
}

async function postArbitraryData(url, body) {
  let response = await fetch(url, {
    method: "POST",
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  response = await response.json();
  return response;
}

export async function Fetch(url, timeout) {
  let ret = new Promise(async (resolve, reject) => {
    setTimeout(() => {
      if (!ret.isResolved) {
        reject("timeout");
      }
    }, timeout);

    await fetchArbitraryData(url, "json")
      .then((val) => {
        resolve(val);
      })
      .catch((err) => {
        console.log("Failed to fetch data", err);
        reject(err);
      });
  });
  return ret;
}

/*
export async function Fetch(url, timeout) {
    let ret = new Promise(async (resolve, reject) => {
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), timeout);

        const response = fetch(url, { signal: controller.signal })
        clearTimeout(timer);
        
        return response
    });
    return ret;
}
*/

export async function Post(url, body, timeout) {
  let ret = new Promise(async (resolve, reject) => {
    setTimeout(() => {
      if (!ret.isResolved) {
        reject("timeout");
      }
    }, timeout);

    await postArbitraryData(url, body)
      .then((val) => {
        resolve(val);
      })
      .catch((err) => {
        console.log("Failed to post data", err);
        reject(err);
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

export function VerifyCharacterAndLfmOverview(data) {
  if (data === null) return false;
  if (data.length !== 9) return false;
  let missingfields = false;
  data.forEach((server) => {
    if (server.ServerName === undefined) missingfields = true;
    if (server.PlayerCount === undefined) missingfields = true;
    if (server.LfmCount === undefined) missingfields = true;
  });
  if (missingfields) return false;
  return true;
}

export function VerifyServerLfmData(data) {
  if (data === null) return false;
  let missingfields = false;
  if (data.lfms === undefined) missingfields = true;
  if (data.last_updated === undefined) missingfields = true;
  if (data.lfm_count === undefined) missingfields = true;
  return !missingfields;
}

export function VerifyCharacterData(data) {
  if (data === null) return false;
  if (data.characters == null) return false;
  if (data.character_count == null) return false;
  if (data.last_updated == null) return false;
  return true; // TODO
}
