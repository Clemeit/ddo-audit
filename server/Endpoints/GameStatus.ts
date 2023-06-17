import path from "path";
import useQuery from "../common/useQuery";
import express from "express";
import mysql from "mysql2";

interface Props {
  api: express.Express;
  mysqlConnection: mysql.Connection;
}

const gameStatusApi = ({ api, mysqlConnection }: Props) => {
  const { queryAndRetry } = useQuery({ mysqlConnection });
  const servers = [
    ["Argonnessen", "argonnessen"],
    ["Cannith", "cannith"],
    ["Ghallanda", "ghallanda"],
    ["Khyber", "khyber"],
    ["Orien", "orien"],
    ["Sarlona", "sarlona"],
    ["Thelanis", "thelanis"],
    ["Wayfinder", "wayfinder"],
    ["Hardcore", "hardcore"],
  ];

  const getPlayerAndLfmOverview = (): Promise<any> => {
    return new Promise(async (resolve, reject) => {
      const query = `SELECT * from \`population\` WHERE id=(SELECT max(id) FROM population);`;
      queryAndRetry(query, 3)
        .then((result) => {
          if (result) {
            let ret: any[] = [];
            servers.forEach((server) => {
              ret.push({
                ServerName: server[0],
                PlayerCount: result[0][`${server[1]}_playercount`],
                LfmCount: result[0][`${server[1]}_lfmcount`],
              });
            });

            resolve(ret);
          } else {
            reject({ error: "null data" });
          }
        })
        .catch((err) => {
          reject(err);
        });
    });
  };

  const getGroupTableCount = (): Promise<any> => {
    return new Promise(async (resolve, reject) => {
      const query = `SELECT COUNT(*) AS Count from \`groups\`;`;
      queryAndRetry(query, 3)
        .then((result) => {
          if (result && result.length) {
            resolve(result[0]);
          } else {
            reject({ error: "null data" });
          }
        })
        .catch((err) => {
          reject(err);
        });
    });
  };

  const getPlayerTableCount = (): Promise<any> => {
    return new Promise(async (resolve, reject) => {
      const query = `SELECT COUNT(*) AS Count from \`players_cached\`;`;
      queryAndRetry(query, 3)
        .then((result) => {
          if (result) {
            resolve(result[0]);
          } else {
            reject({ error: "null data" });
          }
        })
        .catch((err) => {
          reject(err);
        });
    });
  };

  api.get(`/gamestatus/populationoverview`, (_, res) => {
    res.setHeader("Content-Type", "application/json");
    getPlayerAndLfmOverview()
      .then((result) => {
        res.send(result);
      })
      .catch((err) => {
        console.log(err);
        return {};
      });
  });

  api.get(`/gamestatus/grouptablecount`, (_, res) => {
    res.setHeader("Content-Type", "application/json");
    getGroupTableCount()
      .then((result) => {
        res.send(result);
      })
      .catch((err) => {
        console.log(err);
        return {};
      });
  });

  api.get(`/gamestatus/playertablecount`, (_, res) => {
    res.setHeader("Content-Type", "application/json");
    getPlayerTableCount()
      .then((result) => {
        res.send(result);
      })
      .catch((err) => {
        console.log(err);
        return {};
      });
  });

  api.get(`/gamestatus/serverstatus`, (_, res) => {
    res.setHeader("Content-Type", "application/json");
    res.sendFile(path.resolve(`./api_v1/gamestatus/serverstatus.json`));
  });
};

export default gameStatusApi;
