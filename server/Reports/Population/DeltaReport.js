import fs from "fs";

const runDeltaReport = (data, reporttype) => {
	return new Promise(async (resolve, reject) => {
		var t0 = new Date();
		console.log("Running Population Delta report");

		let Delta = {
			id: "Delta",
			color:
				reporttype === "population"
					? "hsl(208, 100%, 50%)"
					: "hsl(25, 100%, 50%)",
			data: [],
		};

		let register = [];

		data.forEach((dp) => {
			if (register.length <= 7) {
				register.push(dp);
			} else {
				Delta.data.push({
					x: register[7].x,
					y:
						Math.round(
							((register[7].y - register[0].y) /
								(register[0].y != 0 ? register[0].y : 1)) *
								10000
						) / 100,
				});
				register = register.slice(1);
				register.push(dp);
			}
		});

		fs.writeFile(
			`../api_v1/population/quarter${
				reporttype === "population" ? "" : "_groups"
			}_delta.json`,
			JSON.stringify([Delta]),
			(err) => {
				if (err) throw err;
			}
		);

		var t1 = new Date();
		console.log(`Finished in ${t1 - t0}ms`);
	});
};

export default runDeltaReport;
