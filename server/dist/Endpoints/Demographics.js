"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const demographicsApi = ({ api }) => {
    const demographicsMap = [
        ["leveldistribution", "leveldistributionquarter"],
        ["classdistribution", "classdistributionquarter"],
        ["racedistribution", "racedistributionquarter"],
        ["leveldistribution_banks", "leveldistributionquarter_banks"],
        ["classdistribution_banks", "classdistributionquarter_banks"],
        ["racedistribution_banks", "racedistributionquarter_banks"],
    ];
    demographicsMap.forEach((entry) => {
        api.get(`/demographics/${entry[0]}`, (_, res) => {
            res.setHeader("Content-Type", "application/json");
            res.sendFile(path_1.default.resolve(`./api_v1/demographics/${entry[1]}.json`));
        });
    });
};
exports.default = demographicsApi;
