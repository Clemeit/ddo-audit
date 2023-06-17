"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const useQuery = ({ mysqlConnection }) => {
    const queryAndRetry = (query, n) => __awaiter(void 0, void 0, void 0, function* () {
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
    });
    return { queryAndRetry };
};
exports.default = useQuery;
