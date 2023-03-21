import useQuery from "./useQuery.js";

const caasApi = (api, mysqlConnection) => {
	const { queryAndRetry } = useQuery(mysqlConnection);

	function getValueFromLabel(label) {
		return new Promise(async (resolve, reject) => {
			const query = `SELECT value from \`caas\` WHERE \`label\` LIKE ${mysqlConnection.escape(
				label || ""
			)};`;
			queryAndRetry(query, 3)
				.then((result) => {
					if (result && result.length) {
						resolve(result[0]);
					} else {
						reject({ error: "null data" });
					}
				})
				.catch((err) => {
					reject(err);
				});
		});
	}

	function fetchCaaS() {
		return new Promise(async (resolve, reject) => {
			const query = `SELECT * from \`caas\`;`;
			queryAndRetry(query, 3)
				.then((result) => {
					resolve(result);
				})
				.catch((err) => {
					reject(err);
				});
		});
	}

	api.get(`/caas`, (req, res) => {
		res.setHeader("Content-Type", "application/json");
		if (req.query?.label) {
			getValueFromLabel(req.query?.label)
				.then((result) => {
					res.send(result);
				})
				.catch((err) => {
					console.log("Failed to read CaaS:", err);
					res.send([]);
				});
		} else {
			fetchCaaS()
				.then((result) => {
					res.send(result);
				})
				.catch((err) => {
					console.log("Failed to read CaaS:", err);
					res.send([]);
				});
		}
	});
};

export default caasApi;
