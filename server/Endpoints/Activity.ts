import useQuery from "../common/useQuery.js";
import express from "express";
import mysql from "mysql2";

interface Props {
  api: express.Express;
  mysqlConnection: mysql.Connection;
}

const activityApi = ({ api, mysqlConnection }: Props) => {
  const { queryAndRetry } = useQuery({ mysqlConnection });

  const getQuestActivity = (
    questId: string,
    minimumLevel: string,
    maximumLevel: string
  ): Promise<any> => {
    return new Promise(async (resolve, reject) => {
      const query = `SELECT a.playerlevel, a.start, TIME_TO_SEC(TIMEDIFF(end, start)) AS 'duration', a.server FROM activity a WHERE a.questid = ${mysqlConnection.escape(
        questId
      )} AND a.playerlevel >= ${mysqlConnection.escape(
        minimumLevel
      )} AND a.playerlevel <= ${mysqlConnection.escape(maximumLevel)};`;
      queryAndRetry(query, 3)
        .then((result) => {
          resolve(result);
        })
        .catch((err) => {
          reject(err);
        });
    });
  };

  const getActivityOverview = (questType: string): Promise<any> => {
    return new Promise(async (resolve, reject) => {
      const query = `SELECT * FROM activity_cached a WHERE a.level ${
        questType === "heroic" ? "<" : ">="
      } 20;`;
      queryAndRetry(query, 3)
        .then((result) => {
          resolve(result);
        })
        .catch((err) => {
          reject(err);
        });
    });
  };

  api.post(`/activity`, (req, res) => {
    res.setHeader("Content-Type", "application/json");
    if (req.body.questid && req.body.minimumlevel && req.body.maximumlevel) {
      getQuestActivity(
        req.body.questid,
        req.body.minimumlevel,
        req.body.maximumlevel
      ).then((result) => {
        res.send(result);
      });
    } else if (req.body.questtype) {
      getActivityOverview(req.body.questtype).then((result) => {
        res.send(result);
      });
    } else {
      res.send({
        error: "Invalid payload",
      });
    }
  });
};

export default activityApi;
