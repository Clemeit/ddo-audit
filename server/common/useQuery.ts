import mysql from "mysql2";

interface Props {
  mysqlConnection: mysql.Connection;
}

interface Hook {
  queryAndRetry: (query: string, n: number) => Promise<any>;
}

const useQuery = ({ mysqlConnection }: Props): Hook => {
  const queryAndRetry = async (query: string, n: number): Promise<any> => {
    return new Promise((resolve, reject) => {
      const retry = () => {
        if (n === 1) {
          console.log("Failed to query");
          reject({});
        } else {
          return queryAndRetry(query, n - 1);
        }
      };
      if (!mysqlConnection) {
        console.log(mysqlConnection);
        reject({ error: "MySQL connection is not established" });
      } else {
        try {
          mysqlConnection.query(query, (err, result) => {
            if (err) {
              console.log(err);
              resolve(retry());
            } else {
              resolve(result);
            }
          });
        } catch (err) {
          console.log(err);
          return retry();
        }
      }
    });
  };

  return { queryAndRetry };
};

export default useQuery;
