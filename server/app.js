const compression = require("compression");
const express = require("express");
const cors = require("cors");
const app = express();

app.use(express.static("../client")); // This is probably good for production

app.use(cors());
app.use(compression());

const PORT = process.env.PORT || 8000;

// Major endpoints
//require("./population")(app);

// Report scheduler
//require("./cron");

// app.get("/", (req, res) => {
// 	res.send("The New DDO Audit Website - Coming Soon!");
// });

app.listen(PORT, () => {
	console.log(`Server listening on ${PORT}`);
});
