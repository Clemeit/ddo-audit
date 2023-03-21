import mysql from "mysql2";
import useQuery from "../hooks/useQuery.js";

const friendsApi = (api, mysqlConnection) => {
	const { queryAndRetry } = useQuery(mysqlConnection);

	function lookupPlayerByName(body) {
		return new Promise(async (resolve, reject) => {
			const re = /^[a-z0-9- ]+$/i;
			let cname = body.name;
			let goodrequest = re.test(cname);
			cname = body.name;

			if (goodrequest) {
				const query = `SELECT CAST(p.playerid AS CHAR) as playerid, p.name, p.server, p.guild, p.totallevel 
                        FROM \`players\` p 
                        WHERE p.anonymous = 0 AND p.name != 'Anonymous' AND p.name LIKE ${mysqlConnection.escape(
													`${cname}`
												)} 
                        LIMIT 10;`;
				queryAndRetry(query, 3)
					.then((result) => {
						resolve(result);
					})
					.catch((err) => {
						reject(err);
					});
			} else {
				reject("bad name");
			}
		});
	}

	function lookupPlayersByGuild(body) {
		return new Promise(async (resolve, reject) => {
			const re = /^[a-z0-9- ]+$/i;
			let gname = body.guild;
			let gserver = body.server;

			let goodrequest = re.test(gname) && re.test(gserver);

			gname = body.guild;
			gserver = body.server;

			if (goodrequest) {
				const query = `SELECT CAST(p.playerid AS CHAR) as playerid, p.name, p.server, p.guild, p.totallevel 
                        FROM \`players\` p 
                        WHERE p.anonymous = 0 AND p.name != 'Anonymous' AND p.server = ${mysqlConnection.escape(
													gserver
												)} AND p.guild = ${mysqlConnection.escape(gname)} 
                        ORDER BY p.lastseen DESC 
                        LIMIT 50;`;
				queryAndRetry(query, 3)
					.then((result) => {
						resolve(result);
					})
					.catch((err) => {
						reject(err);
					});
			} else {
				reject("bad name");
			}
		});
	}

	function lookupGuildByName(body) {
		return new Promise(async (resolve, reject) => {
			const re = /^[a-z0-9-' ]+$/i;
			let cname = body.name;
			let goodrequest = re.test(cname);
			cname = body.name;

			if (goodrequest) {
				const query = `SELECT g.name, g.server, g.membercount 
                        FROM \`guilds_cached\` g 
                        WHERE g.name LIKE ${mysqlConnection.escape(`${cname}`)} 
                        LIMIT 10;`;
				queryAndRetry(query, 3)
					.then((result) => {
						resolve(result);
					})
					.catch((err) => {
						reject(err);
					});
			} else {
				reject("bad name");
			}
		});
	}

	function lookupPlayersById(body) {
		return new Promise(async (resolve, reject) => {
			let pids = body.ids;
			let goodrequest = true;
			let pidformat = [];
			pids.forEach((pid) => {
				try {
					if (!pid || isNaN(pid)) {
						goodrequest = false;
					} else {
						pidformat.push(`\`playerid\` = ${mysqlConnection.escape(pid)}`);
					}
				} catch (e) {
					reject();
				}
			});

			if (goodrequest) {
				if (!pids || !pids.length) {
					reject("bad format");
				} else {
					const query = `SELECT JSON_ARRAYAGG(JSON_OBJECT(
                            'Id', CAST(p.playerid AS CHAR),
                            'Name', IF(p.anonymous, 'Anonymous', p.name),
                            'Gender', p.gender,
                            'Race', p.race,
                            'Guild', IF(p.anonymous, '(redacted)', p.guild),
                            'Location', JSON_OBJECT('Name', IF(p.anonymous, '(redacted)', a.name), 'IsPublicSpace', a.ispublicspace, 'Region', a.region),
                            'TotalLevel', totallevel,
                            'Server', server,
                            'HomeServer', homeserver,
                            'GroupId', groupid,
                            'InParty', IF(groupid = 0, 0, 1),
                            'Online', IF(p.lastseen > DATE_ADD(UTC_TIMESTAMP(), INTERVAL -70 SECOND), true, false),
                            'Classes', JSON_ARRAY(
                                JSON_OBJECT(
                                    'Name', c1.name,
                                    'Level', p.level1
                                ),
                                JSON_OBJECT(
                                    'Name', c2.name,
                                    'Level', p.level2
                                ),
                                JSON_OBJECT(
                                    'Name', c3.name,
                                    'Level', p.level3
                                ),
                                JSON_OBJECT(
                                    'Name', c4.name,
                                    'Level', p.level4
                                )
                            )
                        )) as data
                        FROM \`players\` p
                        LEFT JOIN areas a ON p.location = a.areaid 
                        LEFT JOIN classes c1 ON p.class1 = c1.id 
                        LEFT JOIN classes c2 ON p.class2 = c2.id 
                        LEFT JOIN classes c3 ON p.class3 = c3.id 
                        LEFT JOIN classes c4 ON p.class4 = c4.id 
                        WHERE ${pidformat.join(" OR ")};`;

					queryAndRetry(query, 3)
						.then((result) => {
							resolve(result);
						})
						.catch((err) => {
							reject(err);
						});
				}
			} else {
				reject();
			}
		});
	}

	api.post(`/friends`, (req, res) => {
		res.setHeader("Content-Type", "application/json");
		lookupPlayersById(req.body)
			.then((result) => {
				res.send(result[0]["data"]);
			})
			.catch(() => {
				res.send({ error: "bad request" });
			});
	});

	api.post(`/friends/add`, (req, res) => {
		res.setHeader("Content-Type", "application/json");
		lookupPlayerByName(req.body)
			.then((characters) => {
				lookupGuildByName(req.body)
					.then((result2) => {
						res.send({
							characters: characters,
							guilds: result2,
						});
					})
					.catch(() => {
						res.send({ error: "bad request" });
					});
			})
			.catch(() => {
				res.send({ error: "bad request" });
			});
	});

	api.post(`/friends/add/guild`, (req, res) => {
		res.setHeader("Content-Type", "application/json");
		lookupPlayersByGuild(req.body)
			.then((result) => {
				res.send(result);
			})
			.catch(() => {
				res.send({ error: "bad request" });
			});
	});
};

export default friendsApi;
