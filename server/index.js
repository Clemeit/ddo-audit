// server/index.js

const express = require("express");
//const webpush = require("web-push");
//const bodyParser = require("body-parser");
//const path = require("path");
var cors = require("cors");

const app = express();

app.use(cors());
//app.use(bodyParser.json());

// PUSH ///////////////
// const vapidKeys = {
// 	publicKey:
// 		"BLHgHfWx0GfeaHhiMFzYj3Q4qDcSYAV65jrCaNgArov7d5PsT3t_MYLIqmtxCcSsd-9pOEslxOZulKc7sMgc0tY",
// 	privateKey: "arQ36BcTIT_vg_T2BD68D8qCuNXvIsyRo6ec63z_ILQ",
// };

// webpush.setVapidDetails(
// 	"mailto:ddoaudit@fastmail.com",
// 	vapidKeys.publicKey,
// 	vapidKeys.privateKey
// );

// app.post("/subscribe", (req, res) => {
// 	const subscription = req.body;

// 	// Send status back to client
// 	res.status(201).json({});

// 	// Payload
// 	const payload = JSON.stringify({ title: "Push Test" });

// 	// Pass object into sendNotification function
// 	webpush.sendNotification(subscription, payload).catch((err) => {
// 		console.error(err);
// 	});
// });
////////////////////////

const PORT = process.env.PORT || 3001;

var api_population = require("./api/population");
api_population(app);

// Tasks
require("./cron");

//require("./push");

app.listen(PORT, () => {
	console.log(`Server listening on ${PORT}`);
});
