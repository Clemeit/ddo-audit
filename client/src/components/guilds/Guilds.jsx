import React from "react";
import { Helmet } from "react-helmet";
import Banner from "../global/Banner";
import BannerMessage from "../global/BannerMessage";
import NoMobileOptimization from "../global/NoMobileOptimization";
import { Fetch } from "../../services/DataLoader";
import { ReactComponent as SortSVG } from "../../assets/global/sort.svg";
import { ReactComponent as ArrowRightSVG } from "../../assets/global/arrow_right.svg";
import ContentCluster from "../global/ContentCluster";
import PopupMessage from "../global/PopupMessage";

const Guilds = (props) => {
    const TITLE = "DDO Guild Member Search";
    const PAGE_SIZE = 30;
    const [isRunning, setIsRunning] = React.useState(null);

    const [guildNameSearch, setGuildNameSearch] = React.useState("");
    const [playerNameSearch, setPlayerNameSearch] = React.useState("");

    const [guilds, setGuilds] = React.useState(null);
    const [guildsSorted, setGuildsSorted] = React.useState(null);
    const [guildsPaginated, setGuildsPaginated] = React.useState(null);
    const [guildsPageNumber, setGuildsPageNumber] = React.useState(0);
    const [guildSortMethod, setGuildSortMethod] = React.useState({
        method: "membercount",
        direction: "asc",
    });

    const [players, setPlayers] = React.useState(null);
    const [playersSorted, setPlayersSorted] = React.useState(null);
    const [playersPaginated, setPlayersPaginated] = React.useState(null);
    const [playersPageNumber, setPlayersPageNumber] = React.useState(0);
    const [playersSortMethod, setPlayersSortMethod] = React.useState({
        method: "laston",
        direction: "asc",
    });
    const [focusedGuildName, setFocusedGuildName] = React.useState(null);
    const [reportDate, setReportDate] = React.useState(null);

    React.useEffect(() => {
        setPlayersPageNumber(0);
        if (!players) {
            setPlayersSorted(null);
            setPlayersPaginated(null);
            return;
        }
        setPlayersSorted([
            ...players
                .filter((player) =>
                    player.Name.toLowerCase().includes(
                        playerNameSearch.toLowerCase()
                    )
                )
                .sort((a, b) => {
                    if (playersSortMethod.method === "name") {
                        if (playersSortMethod.direction === "asc") {
                            return a.Name.localeCompare(b.Name);
                        } else {
                            return b.Name.localeCompare(a.Name);
                        }
                    } else if (playersSortMethod.method === "level") {
                        if (playersSortMethod.direction === "asc") {
                            return a.TotalLevel - b.TotalLevel;
                        } else {
                            return b.TotalLevel - a.TotalLevel;
                        }
                    } else if (playersSortMethod.method === "location") {
                        if (playersSortMethod.direction === "asc") {
                            return a.Location.localeCompare(b.Location);
                        } else {
                            return b.Location.localeCompare(a.Location);
                        }
                    } else {
                        if (playersSortMethod.direction === "asc") {
                            return new Date(b.LastSeen) - new Date(a.LastSeen);
                        } else {
                            return new Date(a.LastSeen) - new Date(b.LastSeen);
                        }
                    }
                }),
        ]);
    }, [players, playersSortMethod, playerNameSearch]);

    React.useEffect(() => {
        if (!playersSorted) return;

        setPlayersPaginated(
            playersSorted.slice(
                playersPageNumber * PAGE_SIZE,
                playersPageNumber * PAGE_SIZE + PAGE_SIZE
            )
        );
    }, [playersSorted, playersPageNumber]);

    function handleGuildSort(method) {
        if (guildSortMethod.method === method) {
            if (guildSortMethod.direction === "asc") {
                setGuildSortMethod({
                    method: method,
                    direction: "desc",
                });
            } else {
                setGuildSortMethod({
                    method: method,
                    direction: "asc",
                });
            }
        } else {
            setGuildSortMethod({
                method: method,
                direction: "asc",
            });
        }
    }

    function handlePlayerSort(method) {
        if (playersSortMethod.method === method) {
            if (playersSortMethod.direction === "asc") {
                setPlayersSortMethod({
                    method: method,
                    direction: "desc",
                });
            } else {
                setPlayersSortMethod({
                    method: method,
                    direction: "asc",
                });
            }
        } else {
            setPlayersSortMethod({
                method: method,
                direction: "asc",
            });
        }
    }

    function playerClassString(player) {
        let clsstring = "";
        player.Classes.map((cls) =>
            cls.Name ? (clsstring += cls.Level + " " + cls.Name + " / ") : ""
        );
        if (clsstring) {
            clsstring = clsstring.substring(0, clsstring.length - 3);
        }
        return `(${clsstring})`;
    }

    function playerLastOnString(player) {
        let diff_ms =
            reportDate.getTime() - new Date(player.LastSeen + "Z").getTime();
        if (diff_ms < 60000) {
            return "Online";
        }

        let years = 0;
        let months = 0;
        let weeks = 0;
        let days = 0;
        let hours = 0;
        let minutes = 0;

        years = Math.floor(diff_ms / (1000 * 60 * 60 * 24 * 365));
        diff_ms = diff_ms % (1000 * 60 * 60 * 24 * 365);

        months = Math.floor(diff_ms / (1000 * 60 * 60 * 24 * 31));
        diff_ms = diff_ms % (1000 * 60 * 60 * 24 * 31);

        weeks = Math.floor(diff_ms / (1000 * 60 * 60 * 24 * 7));
        diff_ms = diff_ms % (1000 * 60 * 60 * 24 * 7);

        days = Math.floor(diff_ms / (1000 * 60 * 60 * 24));
        diff_ms = diff_ms % (1000 * 60 * 60 * 24);

        hours = Math.floor(diff_ms / (1000 * 60 * 60));
        diff_ms = diff_ms % (1000 * 60 * 60);

        minutes = Math.floor(diff_ms / (1000 * 60));
        diff_ms = diff_ms % (1000 * 60);

        let rtn =
            (years ? `${years} ${years !== 1 ? "years" : "year"}, ` : "") +
            (months ? `${months} ${months !== 1 ? "months" : "month"}, ` : "") +
            (weeks ? `${weeks} ${weeks !== 1 ? "weeks" : "week"}, ` : "") +
            (days ? `${days} ${days !== 1 ? "days" : "day"}, ` : "") +
            (hours ? `${hours} ${hours !== 1 ? "hours" : "hour"}, ` : "") +
            (minutes
                ? `${minutes} ${minutes !== 1 ? "minutes" : "minute"}, `
                : "");
        if (rtn) {
            rtn = rtn.substring(0, rtn.length - 2);
        }

        return rtn;
    }

    React.useEffect(() => {
        setGuildsPageNumber(0);
        if (!guilds) return;
        setGuildsSorted([
            ...guilds
                .filter((guild) =>
                    guild.Name.toLowerCase().includes(
                        guildNameSearch.toLowerCase()
                    )
                )
                .sort((a, b) => {
                    if (guildSortMethod.method === "name") {
                        if (guildSortMethod.direction === "asc") {
                            return a.Name.localeCompare(b.Name);
                        } else {
                            return b.Name.localeCompare(a.Name);
                        }
                    } else if (guildSortMethod.method === "server") {
                        if (guildSortMethod.direction === "asc") {
                            return a.Server.localeCompare(b.Server);
                        } else {
                            return b.Server.localeCompare(a.Server);
                        }
                    } else {
                        if (guildSortMethod.direction === "asc") {
                            return b.MemberCount - a.MemberCount;
                        } else {
                            return a.MemberCount - b.MemberCount;
                        }
                    }
                }),
        ]);
    }, [guilds, guildSortMethod, guildNameSearch]);

    React.useEffect(() => {
        if (!guildsSorted) return;
        setGuildsPaginated(
            guildsSorted.slice(
                guildsPageNumber * PAGE_SIZE,
                guildsPageNumber * PAGE_SIZE + PAGE_SIZE
            )
        );
    }, [guildsSorted, guildsPageNumber]);

    let updateTime;
    function runAudit() {
        if (isRunning) return;
        setIsRunning(true);

        Fetch("https://www.playeraudit.com/api_new/guilds", 30000)
            .then((val) => {
                setGuilds(val);
                setIsRunning(false);
            })
            .catch(() => {
                setIsRunning(false);
                setPopupMessage({
                    title: "Failed to run audit",
                    message:
                        "The report timed out. You can refresh the page or report the issue.",
                    icon: "warning",
                    fullscreen: false,
                    reportMessage: "Activity report timed out",
                });
            });
    }

    function auditGuild(name, server) {
        if (isRunning) return;

        setIsRunning(true);
        Fetch(
            `https://www.playeraudit.com/api_new/guilds?server=${server}&guild=${name}`,
            30000
        )
            .then((val) => {
                setPlayerNameSearch("");
                setReportDate(new Date());
                setIsRunning(false);
                setPlayers(val);
                setFocusedGuildName(name);
            })
            .catch(() => {
                setIsRunning(false);
                setPopupMessage({
                    title: "Failed to fetch guild",
                    message:
                        "We were unable to find this guild. You can refresh the page or report the issue.",
                    icon: "warning",
                    fullscreen: false,
                    reportMessage: "Guild report timed out",
                });
            });
    }

    // Popup message
    var [popupMessage, setPopupMessage] = React.useState(null);

    return (
        <div>
            <Helmet>
                <title>{TITLE}</title>
                <meta
                    name="description"
                    content="Check guild size, activity, and members lists. Browse through all members from any guild on any server!"
                />
                <meta
                    property="og:image"
                    content="/icons/logo-512px.png"
                    data-react-helmet="true"
                />
                <meta
                    property="twitter:image"
                    content="/icons/logo-512px.png"
                    data-react-helmet="true"
                />
            </Helmet>
            {/* <ReportIssueForm
                page="quests"
                showLink={false}
                visibility={reportFormVisibility}
                componentReference={reportFormReference}
                hideReportForm={hideReportForm}
            /> */}
            <PopupMessage
                page="guilds"
                message={popupMessage}
                popMessage={() => {
                    setPopupMessage(null);
                }}
            />
            <Banner
                small={true}
                showTitle={true}
                showSubtitle={true}
                showButtons={false}
                hideOnMobile={true}
                title="Guilds"
                subtitle="Guild size, activity, and members lists"
            />
            <div className="content-container">
                <BannerMessage page="guilds" />
                <div className="top-content-padding shrink-on-mobile" />
                {!guildsPaginated && (
                    <ContentCluster
                        title="Guild Audit"
                        description="Run a new Guild Audit by pressing the button below."
                    >
                        <div
                            className={
                                "primary-button should-invert full-width-mobile" +
                                (isRunning && " disabled")
                            }
                            onClick={() => runAudit()}
                            disabled={isRunning}
                        >
                            {isRunning ? "Please wait..." : "Run Audit"}
                        </div>
                    </ContentCluster>
                )}
                {(guildsPaginated || playersPaginated) && (
                    <ContentCluster
                        title={
                            <>
                                {playersPaginated ? (
                                    <>
                                        <span
                                            className="guild-header"
                                            onClick={() => setPlayers(null)}
                                        >
                                            Guilds
                                        </span>
                                        <ArrowRightSVG
                                            className="nav-icon should-invert"
                                            style={{
                                                width: "30px",
                                                height: "30px",
                                                margin: "0px",
                                            }}
                                        />
                                        {focusedGuildName}
                                    </>
                                ) : (
                                    <>Guilds</>
                                )}
                            </>
                        }
                        altTitle="Guild Selected"
                    >
                        {playersPaginated ? (
                            <input
                                id="player-filter"
                                className="full-width-mobile"
                                placeholder="Filter players..."
                                style={{
                                    fontSize: "1.2rem",
                                }}
                                value={playerNameSearch}
                                onChange={(e) =>
                                    setPlayerNameSearch(e.target.value)
                                }
                            />
                        ) : (
                            <input
                                id="guild-filter"
                                className="full-width-mobile"
                                placeholder="Filter guilds..."
                                style={{
                                    fontSize: "1.2rem",
                                }}
                                value={guildNameSearch}
                                onChange={(e) =>
                                    setGuildNameSearch(e.target.value)
                                }
                            />
                        )}
                        <table
                            className={
                                "guild-table" + (isRunning ? " disabled" : "")
                            }
                        >
                            <thead className="guild-table-head">
                                {playersPaginated ? (
                                    <tr>
                                        <th
                                            className="guild-table-header"
                                            onClick={() =>
                                                handlePlayerSort("name")
                                            }
                                        >
                                            Name{" "}
                                            <SortSVG className="nav-icon should-invert" />
                                        </th>
                                        <th
                                            className="guild-table-header"
                                            onClick={() =>
                                                handlePlayerSort("level")
                                            }
                                        >
                                            Level{" "}
                                            <SortSVG className="nav-icon should-invert" />
                                        </th>
                                        <th
                                            className="guild-table-header"
                                            onClick={() =>
                                                handlePlayerSort("location")
                                            }
                                        >
                                            Location{" "}
                                            <SortSVG className="nav-icon should-invert" />
                                        </th>
                                        <th
                                            className="guild-table-header"
                                            onClick={() =>
                                                handlePlayerSort("laston")
                                            }
                                        >
                                            Last On{" "}
                                            <SortSVG className="nav-icon should-invert" />
                                        </th>
                                    </tr>
                                ) : (
                                    <tr>
                                        <th
                                            className="guild-table-header"
                                            onClick={() =>
                                                handleGuildSort("name")
                                            }
                                        >
                                            Guild{" "}
                                            <SortSVG className="nav-icon should-invert" />
                                        </th>
                                        <th
                                            className="guild-table-header"
                                            onClick={() =>
                                                handleGuildSort("server")
                                            }
                                        >
                                            Server{" "}
                                            <SortSVG className="nav-icon should-invert" />
                                        </th>
                                        <th
                                            className="guild-table-header"
                                            onClick={() =>
                                                handleGuildSort("membercount")
                                            }
                                        >
                                            Member Count{" "}
                                            <SortSVG className="nav-icon should-invert" />
                                        </th>
                                    </tr>
                                )}
                            </thead>
                            <tbody>
                                {playersPaginated
                                    ? playersPaginated.map((player, i) => (
                                          <tr
                                              key={i}
                                              className="guild-table-row"
                                              style={{ cursor: "default" }}
                                          >
                                              <td className="guild-table-cell">
                                                  {player.Name}
                                              </td>
                                              <td className="guild-table-cell">
                                                  <span>
                                                      {player.TotalLevel}{" "}
                                                  </span>
                                                  <span
                                                      style={{
                                                          color: "var(--text-faded)",
                                                      }}
                                                  >
                                                      {playerClassString(
                                                          player
                                                      )}
                                                  </span>
                                              </td>
                                              <td className="guild-table-cell">
                                                  {player.Location}
                                              </td>
                                              <td className="guild-table-cell">
                                                  {playerLastOnString(player)}
                                              </td>
                                          </tr>
                                      ))
                                    : guildsPaginated.map((guild, i) => (
                                          <tr
                                              key={i}
                                              className="guild-table-row"
                                              onClick={() =>
                                                  auditGuild(
                                                      guild.Name,
                                                      guild.Server
                                                  )
                                              }
                                          >
                                              <td className="guild-table-cell">
                                                  {guild.Name}
                                              </td>
                                              <td className="guild-table-cell">
                                                  {guild.Server}
                                              </td>
                                              <td className="guild-table-cell">
                                                  {guild.MemberCount +
                                                      (guild.MemberCount >
                                                          1000 &&
                                                          " (includes past members)")}
                                              </td>
                                          </tr>
                                      ))}
                            </tbody>
                        </table>
                        <div
                            style={{
                                display: "flex",
                                flexDirection: "row",
                                gap: "5px",
                                justifyContent: "center",
                                alignItems: "center",
                                flexWrap: "wrap",
                            }}
                        >
                            {playersSorted
                                ? playersSorted &&
                                  [
                                      ...Array(
                                          Math.ceil(
                                              playersSorted.length / PAGE_SIZE
                                          )
                                      ),
                                  ].map((o, i) =>
                                      Math.ceil(
                                          playersSorted.length / PAGE_SIZE
                                      ) > 20 ? (
                                          (i === 0 ||
                                              i ===
                                                  Math.ceil(
                                                      playersSorted.length /
                                                          PAGE_SIZE
                                                  ) -
                                                      1 ||
                                              (i > playersPageNumber - 5 &&
                                                  i <
                                                      playersPageNumber +
                                                          5)) && (
                                              <div
                                                  key={i}
                                                  className={
                                                      playersPageNumber === i
                                                          ? "paginationPage active"
                                                          : "paginationPage"
                                                  }
                                                  onClick={() => {
                                                      setPlayersPageNumber(i);
                                                  }}
                                              >
                                                  {i + 1}
                                              </div>
                                          )
                                      ) : (
                                          <div
                                              key={i}
                                              className={
                                                  playersPageNumber === i
                                                      ? "paginationPage active"
                                                      : "paginationPage"
                                              }
                                              onClick={() => {
                                                  setPlayersPageNumber(i);
                                              }}
                                          >
                                              {i + 1}
                                          </div>
                                      )
                                  )
                                : guildsSorted &&
                                  [
                                      ...Array(
                                          Math.ceil(
                                              guildsSorted.length / PAGE_SIZE
                                          )
                                      ),
                                  ].map((o, i) =>
                                      Math.ceil(
                                          guildsSorted.length / PAGE_SIZE
                                      ) > 20 ? (
                                          (i === 0 ||
                                              i ===
                                                  Math.ceil(
                                                      guildsSorted.length /
                                                          PAGE_SIZE
                                                  ) -
                                                      1 ||
                                              (i > guildsPageNumber - 5 &&
                                                  i <
                                                      guildsPageNumber +
                                                          5)) && (
                                              <div
                                                  key={i}
                                                  className={
                                                      guildsPageNumber === i
                                                          ? "paginationPage active"
                                                          : "paginationPage"
                                                  }
                                                  onClick={() => {
                                                      setGuildsPageNumber(i);
                                                  }}
                                              >
                                                  {i + 1}
                                              </div>
                                          )
                                      ) : (
                                          <div
                                              key={i}
                                              className={
                                                  guildsPageNumber === i
                                                      ? "paginationPage active"
                                                      : "paginationPage"
                                              }
                                              onClick={() => {
                                                  setGuildsPageNumber(i);
                                              }}
                                          >
                                              {i + 1}
                                          </div>
                                      )
                                  )}
                        </div>
                    </ContentCluster>
                )}
            </div>
        </div>
    );
};

export default Guilds;
