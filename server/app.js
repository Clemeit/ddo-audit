const compression = require("compression");
const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(compression());

const PORT = process.env.PORT || 3000;

// Major endpoints
require("./population")(app);

// Report scheduler
// require("./cron");

app.listen(PORT, () => {
	console.log(`Server listening on ${PORT}`);
});
