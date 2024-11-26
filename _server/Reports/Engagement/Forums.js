import fetch from "node-fetch";
import * as dotenv from "dotenv";
dotenv.config();

async function runClassDistribution() {
  var t0 = new Date();
  console.log("Running Forums Engagement report");

  const response = await fetch(
    "https://forums.ddo.com/forums/search.php?searchid=15400713"
  );
  const document = await response.text();
  // console.log(document);

  const POST_PATTERN =
    /<a class=\"title\" href=\"(.*?)\" id=\"(.*?)\" title=\"([\W\w]*?)\">(?<title>.*?)<\/a>([\W\w]*?)<!-- lastpost -->([\W\w]*?)\<span class=\"time\"\>(?<lastposttime>.*)\<\/span\>/g;

  while ((post = POST_PATTERN.exec(document))) {
    let {
      groups: { title, lastposttime },
    } = post;
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
}

runClassDistribution();
