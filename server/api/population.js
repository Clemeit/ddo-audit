"use strict";
module.exports = function (app) {
	app.get("/api/v1/population/day", (req, res) => {
		res.sendFile("data/composite/24hr_by_minute.json", {
			root: __dirname,
		});
	});
	app.get("/api/v1/population/week", (req, res) => {
		res.sendFile("data/composite/1_week_by_hour.json", {
			root: __dirname,
		});
	});
	app.get("/api/v1/population/quarter", (req, res) => {
		res.sendFile("data/composite/90_days_by_day.json", {
			root: __dirname,
		});
	});
};
