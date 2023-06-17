"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const useQuery = ({ mysqlConnection }) => {
    const queryAndRetry = async (query, n) => {
        return new Promise((resolve, reject) => {
            const retry = () => {
                if (n === 1) {
                    console.log("Failed to query");
                    reject({});
                }
                else {
                    return queryAndRetry(query, n - 1);
                }
            };
            if (!mysqlConnection) {
                console.log(mysqlConnection);
                reject({ error: "MySQL connection is not established" });
            }
            else {
                try {
                    mysqlConnection.query(query, (err, result) => {
                        if (err) {
                            console.log(err);
                            resolve(retry());
                        }
                        else {
                            resolve(result);
                        }
                    });
                }
                catch (err) {
                    console.log(err);
                    return retry();
                }
            }
        });
    };
    return { queryAndRetry };
};
exports.default = useQuery;
