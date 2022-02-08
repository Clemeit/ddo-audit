var path = require("path");

module.exports = function (api) {
    const population = [
        ["day", "day"],
        ["day_groups", "day_groups"],
        ["week", "week"],
        ["quarter", "quarter"],
        ["year", "year"],
        ["serverdistribution", "serverdistributionquarter"],
        ["hourlydistribution", "hourlydistributionquarter"],
        ["dailydistribution", "dailydistributionquarter"],
        ["uniquedata", "uniquedata"],
        ["serverdistribution_groups", "serverdistributionquarter_groups"],
        ["hourlydistribution_groups", "hourlydistributionquarter_groups"],
        ["dailydistribution_groups", "dailydistributionquarter_groups"],
        ["quarter_delta", "quarter_delta"],
        ["quarter_groups_delta", "quarter_groups_delta"],
    ];

    population.forEach((entry) => {
        api.get(`/population/${entry[0]}`, (req, res) => {
            res.setHeader("Content-Type", "application/json");
            res.sendFile(path.resolve(`./api_v1/population/${entry[1]}.json`));
        });
    });
};
