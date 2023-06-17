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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_fetch_1 = __importDefault(require("node-fetch"));
const fs_1 = __importDefault(require("fs"));
const runServerStatusReport = () => {
    var t0 = new Date();
    console.log("Running Server Status report");
    const SERVERS = [
        "Argonnessen",
        "Cannith",
        "Ghallanda",
        "Khyber",
        "Orien",
        "Sarlona",
        "Thelanis",
        "Wayfinder",
        "Hardcore",
    ];
    function queryWorlds() {
        let ret = new Promise((resolve, reject) => {
            setTimeout(() => {
                if (!ret.isResolved) {
                    reject("timeout");
                }
            }, 5000);
            let worlds = [];
            const DATA_CENTER_SERVER_URL = "http://gls.ddo.com/GLS.DataCenterServer/Service.asmx";
            let soapAction = "http://www.turbine.com/SE/GLS/GetDatacenters";
            let contentType = "text/xml; charset=utf-8";
            let body = '<?xml version="1.0" encoding="utf-8"?><soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema"><soap:Body><GetDatacenters xmlns="http://www.turbine.com/SE/GLS"><game>DDO</game></GetDatacenters></soap:Body></soap:Envelope>';
            (0, node_fetch_1.default)(DATA_CENTER_SERVER_URL, {
                method: "POST",
                cache: "no-cache",
                headers: {
                    SOAPAction: soapAction,
                    "Content-Type": contentType,
                },
                body: body,
            })
                .then((res) => res.text())
                .then((data) => {
                const pattern = /<World><Name>(?<world>.*?)<\/Name>.*?<StatusServerUrl>(?<statusserver>.*?)<\/StatusServerUrl><Order>(?<order>.*?)<\/Order>/g;
                let d = pattern.exec(data);
                do {
                    worlds.push({
                        Name: d.groups.world,
                        StatusServerUrl: d.groups.statusserver,
                        Order: +d.groups.order,
                    });
                } while ((d = pattern.exec(data)) !== null);
                resolve(worlds);
            })
                .catch((err) => {
                reject(err);
            });
        });
        return ret;
    }
    function updateWorlds(worlds) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                let queue = 0;
                worlds.forEach((world) => {
                    queue++;
                    (0, node_fetch_1.default)(world.StatusServerUrl)
                        .then((response) => response.text())
                        .then((data) => {
                        if (data.length < 100) {
                            world.Status = 0;
                            queue--;
                            if (!queue) {
                                resolve(worlds);
                            }
                        }
                        else {
                            const pattern = /<allow_billing_role>(?<roles>.*?)<\/allow_billing_role>/;
                            if (pattern.test(data)) {
                                let billingroles = pattern.exec(data).groups.roles.split(",");
                                world.BillingRoles = billingroles;
                                if (world.BillingRoles.includes("StormreachGuest") ||
                                    world.BillingRoles.includes("StormreachStandard") ||
                                    world.BillingRoles.includes("StormreachLimited")) {
                                    world.Status = 1;
                                }
                                else {
                                    world.Status = 0;
                                }
                            }
                            else {
                                world.BillingRoles = [];
                                world.Status = 0;
                            }
                            delete world.StatusServerUrl;
                            delete world.BillingRoles;
                            queue--;
                            if (!queue) {
                                resolve(worlds);
                            }
                        }
                    })
                        .catch((err) => {
                        reject(err);
                    });
                });
            });
        });
    }
    function save(worlds) {
        fs_1.default.writeFile("../api_v1/gamestatus/serverstatus.json", JSON.stringify({ LastUpdateTime: new Date(), Worlds: worlds }), (err) => {
            if (err)
                throw err;
        });
        var t1 = new Date();
        console.log(`Finished in ${t1 - t0}ms`);
    }
    queryWorlds()
        .then((worlds) => {
        if (worlds.length === 0) {
            // Game worlds are down for maintenance
            SERVERS.forEach((server) => {
                worlds.push({
                    Name: server,
                    Status: 0,
                });
            });
            save(worlds);
        }
        else {
            updateWorlds(worlds).then((worlds) => {
                worlds.sort((a, b) => a.Name.localeCompare(b.Name));
                save(worlds);
            });
        }
    })
        .catch((err) => {
        // Game worlds are down for maintenance
        const worlds = [];
        SERVERS.forEach((server) => {
            worlds.push({
                Name: server,
                Status: 0,
            });
        });
        save(worlds);
    });
};
exports.default = runServerStatusReport;
