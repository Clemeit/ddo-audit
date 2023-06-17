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
const fs_1 = __importDefault(require("fs"));
const runDeltaReport = (data, reporttype) => {
    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
        var t0 = new Date();
        console.log("Running Population Delta report");
        let Delta = {
            id: "Delta",
            color: reporttype === "players" ? "hsl(208, 100%, 50%)" : "hsl(25, 100%, 50%)",
            data: [],
        };
        let register = [];
        data.forEach((dp) => {
            if (register.length <= 7) {
                register.push(dp);
            }
            else {
                Delta.data.push({
                    x: register[7].x,
                    y: Math.round(((register[7].y - register[0].y) /
                        (register[0].y != 0 ? register[0].y : 1)) *
                        10000) / 100,
                });
                register = register.slice(1);
                register.push(dp);
            }
        });
        fs_1.default.writeFile(`../api_v1/population/quarter${reporttype === "players" ? "" : "_groups"}_delta.json`, JSON.stringify([Delta]), (err) => {
            if (err)
                throw err;
        });
        var t1 = new Date();
        console.log(`Finished in ${t1 - t0}ms`);
    }));
};
exports.default = runDeltaReport;
