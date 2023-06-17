import requestIp from "request-ip";
import useQuery from "../common/useQuery.js";
import express from "express";
import mysql from "mysql2";

interface Props {
  api: express.Express;
  mysqlConnection: mysql.Connection;
}

const messageServiceApi = ({ api, mysqlConnection }: Props) => {
  const { queryAndRetry } = useQuery({ mysqlConnection });

  const getMarkedEvents = (): Promise<any> => {
    return new Promise(async (resolve, reject) => {
      const query = `SELECT * from \`marked_events\`;`;
      queryAndRetry(query, 3)
        .then((result) => {
          resolve(result);
        })
        .catch((err) => {
          reject(err);
        });
    });
  };

  const getNews = (): Promise<any> => {
    return new Promise(async (resolve, reject) => {
      const query = `SELECT * from \`news\`;`;
      queryAndRetry(query, 3)
        .then((result) => {
          resolve(result);
        })
        .catch((err) => {
          reject(err);
        });
    });
  };

  const getMessages = (): Promise<any> => {
    return new Promise(async (resolve, reject) => {
      const query = `SELECT * from \`public_messages\`;`;
      queryAndRetry(query, 3)
        .then((result) => {
          resolve(result);
        })
        .catch((err) => {
          reject(err);
        });
    });
  };

  const submitMessage = (
    message: any,
    ipaddress: string,
    ticket: number
  ): Promise<any> => {
    return new Promise(async (resolve, reject) => {
      if (
        message == null ||
        message.title == null ||
        message.comment == null ||
        ticket == null
      ) {
        reject("Bad request");
      } else {
        const query = `INSERT INTO \`feedback\` (\`datetime\`, \`ip\`, \`ticket\`, \`browser\`, \`title\`, \`comment\`, \`resolved\`) VALUES (CURRENT_TIMESTAMP, ${mysqlConnection.escape(
          ipaddress || ""
        )}, ${mysqlConnection.escape(ticket || "")}, ${
          mysqlConnection.escape(message.browser) || ""
        }, ${mysqlConnection.escape(message.title) || ""}, ${
          mysqlConnection.escape(message.comment) || ""
        }, '0');`;
        queryAndRetry(query, 1)
          .then(() => {
            resolve({ success: true });
          })
          .catch((err) => {
            reject(err);
          });
      }
    });
  };

  const getPrivateMessages = (requestBody: any): Promise<any> => {
    return new Promise(async (resolve, reject) => {
      if (
        requestBody == null ||
        requestBody.tickets == null ||
        requestBody.tickets.length === 0
      ) {
        reject("Bad ticket");
      }
      let escapedTickets: string[] = [];
      requestBody.tickets.forEach((ticket: string) => {
        escapedTickets.push(mysqlConnection.escape(ticket));
      });
      const query = `SELECT \`datetime\`, \`ticket\`, \`comment\`, \`response\` FROM \`feedback\` WHERE (ticket = ${escapedTickets.join(
        " OR ticket = "
      )}) AND \`resolved\` = 1 AND \`response\` IS NOT NULL ORDER BY \`feedback\`.\`datetime\` DESC LIMIT 1;`;
      queryAndRetry(query, 3)
        .then((result) => {
          if (result && result.length) {
            result[0].comment = result[0].comment.split("(Contact:")[0];
          }
          resolve(result);
        })
        .catch((err) => {
          reject(err);
        });
    });
  };

  const logEvent = (event: any, ipaddress: string): Promise<any> => {
    return new Promise(async (resolve, reject) => {
      if (event == null) {
        reject();
      } else {
        const query = `INSERT INTO \`log\` (\`datetime\`, \`ip\`, \`event\`, \`meta\`) VALUES (CURRENT_TIMESTAMP, ${mysqlConnection.escape(
          ipaddress || ""
        )}, ${mysqlConnection.escape(event.event) || ""}, ${
          mysqlConnection.escape(event.meta) || ""
        });`;
        queryAndRetry(query, 1)
          .then(() => {
            resolve({ success: true });
          })
          .catch((err) => {
            reject(err);
          });
      }
    });
  };

  api.get(`/markedevents`, (_, res) => {
    res.setHeader("Content-Type", "application/json");
    getMarkedEvents()
      .then((result) => {
        res.send(result);
      })
      .catch((err) => {
        console.log(err);
        return {};
      });
  });

  api.get(`/news`, (_, res) => {
    res.setHeader("Content-Type", "application/json");
    getNews()
      .then((result) => {
        res.send(result);
      })
      .catch((err) => {
        console.log(err);
        return {};
      });
  });

  api.get(`/messageservice`, (_, res) => {
    res.setHeader("Content-Type", "application/json");
    getMessages()
      .then((result) => {
        res.send(result);
      })
      .catch((err) => {
        console.log(err);
        return {};
      });
  });

  api.post(`/submitmessage`, (req, res) => {
    var clientIp = requestIp.getClientIp(req) || "";
    var ticket = Date.now();
    res.setHeader("Content-Type", "application/json");
    submitMessage(req.body, clientIp, ticket)
      .then(() => {
        res.send({ state: "Success", ticket });
      })
      .catch((err) => {
        console.log("Failed to post message:", err);
        res.send({ state: "Failed" });
      });
  });

  api.post(`/retrieveresponse`, (req, res) => {
    res.setHeader("Content-Type", "application/json");
    getPrivateMessages(req.body)
      .then((result) => {
        res.send(result);
      })
      .catch((err) => {
        console.log("Failed to read message:", err);
        res.send([]);
      });
  });

  api.post(`/log`, (req, res) => {
    var clientIp = requestIp.getClientIp(req) || "";
    res.setHeader("Content-Type", "application/json");
    logEvent(req.body, clientIp)
      .then(() => {
        res.send({ state: "Success" });
      })
      .catch((err) => {
        console.log("Failed to log event:", err);
        res.send({ state: "Failed" });
      });
  });
};

export default messageServiceApi;
