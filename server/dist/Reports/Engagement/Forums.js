"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const dotenv = __importStar(require("dotenv"));
dotenv.config();
function runClassDistribution() {
    return __awaiter(this, void 0, void 0, function* () {
        var t0 = new Date();
        console.log("Running Forums Engagement report");
        const response = yield (0, node_fetch_1.default)("https://forums.ddo.com/forums/search.php?searchid=15400713");
        const document = yield response.text();
        // console.log(document);
        const POST_PATTERN = /<a class=\"title\" href=\"(.*?)\" id=\"(.*?)\" title=\"([\W\w]*?)\">(?<title>.*?)<\/a>([\W\w]*?)<!-- lastpost -->([\W\w]*?)\<span class=\"time\"\>(?<lastposttime>.*)\<\/span\>/g;
        while ((post = POST_PATTERN.exec(document))) {
            let { groups: { title, lastposttime }, } = post;
            console.log(title, lastposttime);
        }
        // fs.writeFile(
        // 	`../api_v1/demographics/classdistributionquarter${
        // 		reporttype === "normal" ? "" : "_banks"
        // 	}.json`,
        // 	JSON.stringify(output),
        // 	(err) => {
        // 		if (err) throw err;
        // 	}
        // );
        var t1 = new Date();
        console.log(`-> Finished in ${t1 - t0}ms`);
    });
}
runClassDistribution();
