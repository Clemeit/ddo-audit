import useQuery from "../hooks/useQuery.js";

const groupsApi = (api, mysqlConnection) => {
  const { queryAndRetry } = useQuery(mysqlConnection);
  const servers = [
    "argonnessen",
    "cannith",
    "ghallanda",
    "khyber",
    "orien",
    "sarlona",
    "thelanis",
    "wayfinder",
    "hardcore",
    "all",
  ];

  function getGroupData(server) {
    return new Promise(async (resolve, reject) => {
      try {
        let query = `SELECT ${
          server == "all" ? "*" : server
        } FROM \`groups\` ORDER BY \`groups\`.\`datetime\` DESC LIMIT 1;`;
        queryAndRetry(query, 3)
          .then((result) => {
            if (result[0]) {
              const singular = result[0];
              if (server === "all") {
                resolve([
                  JSON.parse(singular["argonnessen"]),
                  JSON.parse(singular["cannith"]),
                  JSON.parse(singular["ghallanda"]),
                  JSON.parse(singular["khyber"]),
                  JSON.parse(singular["orien"]),
                  JSON.parse(singular["sarlona"]),
                  JSON.parse(singular["thelanis"]),
                  JSON.parse(singular["wayfinder"]),
                  JSON.parse(singular["hardcore"]),
                ]);
              } else {
                resolve(singular[server]);
              }
            } else {
              reject({ error: "No data found" });
            }
          })
          .catch((err) => {
            reject(err);
          });
      } catch {
        reject({ error: "Generic error" });
      }
    });
  }

  servers.forEach((entry) => {
    api.get(`/groups/${entry}`, (req, res) => {
      res.setHeader("Content-Type", "application/json");
      res.set("Cache-Control", "no-store");
      getGroupData(entry)
        .then((result) => {
          res.send(result);
        })
        .catch((err) => {
          res.send(err);
        });
    });
  });
};

export default groupsApi;
