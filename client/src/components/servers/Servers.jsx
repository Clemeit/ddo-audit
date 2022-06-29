import React, { useState } from "react";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import { ReactComponent as OnlineSVG } from "../../assets/global/online.svg";
import { ReactComponent as OfflineSVG } from "../../assets/global/offline.svg";
import { ReactComponent as PendingSVG } from "../../assets/global/pending.svg";
import { ReactComponent as LiveSVG } from "../../assets/global/live.svg";
import { ReactComponent as TrendsSVG } from "../../assets/global/trends.svg";
import Banner from "../global/Banner";
import { Fetch } from "../../services/DataLoader";
import PopupMessage from "../global/PopupMessage";
import BannerMessage from "../global/BannerMessage";
import ChartPie from "../global/ChartPie";
import ChartLine from "../global/ChartLine";
import ContentCluster from "../global/ContentCluster";
import ChartBar from "../global/ChartBar";
import { Log } from "../../services/CommunicationService";

// no-change

const Directory = (props) => {
    const TITLE = "DDO Server Population and Demographics";
    const SERVER_NAMES = [
        "Argonnessen",
        "Cannith",
        "Ghallanda",
        "Khyber",
        "Orien",
        "Sarlona",
        "Thelanis",
        "Wayfinder",
        "Hardcore",
    ];

    function GetSVG(world) {
        if (world === undefined || world === null) return <PendingSVG />;
        if (!world.hasOwnProperty("Status")) return <PendingSVG />;
        switch (world.Status) {
            case 0:
                return <OfflineSVG />;
            case 1:
                return <OnlineSVG />;
            default:
                return <PendingSVG />;
        }
    }

    function readAbout(r, callback) {
        switch (r) {
            case "filter banks characters":
                Log("Read about bank characters", "Servers");
                setPopupMessage({
                    title: "Bank Characters",
                    message: (
                        <span>
                            We attempt to filter out bank characters by not
                            including:
                            <ul>
                                <li>
                                    Characters that haven't been actively
                                    running quests
                                </li>
                                <li>
                                    Characters that aren't making observable
                                    level progression
                                </li>
                                <li>
                                    Characters that sit in a single area
                                    indefinitely
                                </li>
                            </ul>
                            <p>
                                To see the distribution of what we consider
                                "bank characters,"{" "}
                                <span
                                    className="faux-link"
                                    onClick={() => callback()}
                                >
                                    click here
                                </span>
                                .
                            </p>
                        </span>
                    ),
                    icon: "info",
                    fullscreen: true,
                });
                break;
            case "primary class only":
                Log("Read about primary class", "Servers");
                setPopupMessage({
                    title: "Primary Class Only",
                    message: (
                        <span>
                            This report only counts a character's primary class.
                            For example, a character with 18 levels of Wizard
                            and 2 levels of Rogue will count towards Wizard.
                        </span>
                    ),
                    icon: "info",
                    fullscreen: true,
                });
                break;
        }
    }

    function GetServerDescription(name) {
        if (uniqueData == null) {
            return (
                <p
                    className="content-option-description"
                    style={{ fontSize: "1.4rem" }}
                >
                    Loading...
                </p>
            );
        }
        return uniqueData
            .filter((server) => server.Name === name)
            .map((server, i) => (
                <p
                    key={i}
                    className="content-option-description"
                    style={{
                        fontSize: "1.4rem",
                    }}
                >
                    <span
                        style={{
                            color: "var(--text-player-number)",
                        }}
                    >{`${server.TotalCharacters} unique players`}</span>
                    <br />
                    <span
                        style={{
                            color: "var(--text-lfm-number)",
                        }}
                    >{`${server.TotalGuilds} unique guilds`}</span>
                </p>
            ));
    }

    const [uniqueData, setUniqueData] = React.useState(null);
    const [serverStatusData, set_serverStatusData] = React.useState(null);

    const [serverDistributionData, setServerDistributionData] =
        React.useState(null);
    const [hourlyDistributionData, setHourlyDistributionData] =
        React.useState(null);
    const [dailyDistributionData, setDailyDistributionData] =
        React.useState(null);
    const [serverDistributionType, setServerDistributionType] =
        React.useState("population");
    const [hourlyDistributionType, setHourlyDistributionType] =
        React.useState("population");
    const [dailyDistributionType, setDailyDistributionType] =
        React.useState("population");
    const [levelDistributionDataBanks, setLevelDistributionDataBanks] =
        React.useState(false);
    const [classDistributionDataBanks, setClassDistributionDataBanks] =
        React.useState(false);
    const [raceDistributionDataBanks, setRaceDistributionDataBanks] =
        React.useState(false);

    const [timeNowEvent, setTimeNowEvent] = React.useState([]);

    React.useEffect(() => {
        setTimeNowEvent([
            {
                id: 0,
                date: (((new Date().getUTCHours() - 5) % 24) + 24) % 24,
                type: "timeevent",
                message: "Current Time EST",
                color: "#FF0000",
                width: 4,
            },
        ]);
    }, []);

    React.useEffect(() => {
        Fetch(
            `https://api.ddoaudit.com/population/serverdistribution${
                serverDistributionType === "population" ? "" : "_groups"
            }`,
            5000
        )
            .then((val) => {
                setServerDistributionData(val);
            })
            .catch((err) => {
                dataFailedToLoad();
            });
    }, [serverDistributionType]);

    React.useEffect(() => {
        Fetch(
            `https://api.ddoaudit.com/population/hourlydistribution${
                hourlyDistributionType === "population" ? "" : "_groups"
            }`,
            5000
        )
            .then((val) => {
                setHourlyDistributionData(val);
            })
            .catch((err) => {
                dataFailedToLoad();
            });
    }, [hourlyDistributionType]);

    React.useEffect(() => {
        Fetch(
            `https://api.ddoaudit.com/population/dailydistribution${
                dailyDistributionType === "population" ? "" : "_groups"
            }`,
            5000
        )
            .then((val) => {
                setDailyDistributionData(val);
            })
            .catch((err) => {
                dataFailedToLoad();
            });
    }, [dailyDistributionType]);

    const [levelDistributionData, setLevelDistributionData] =
        React.useState(null);
    const [classDistributionData, setClassDistributionData] =
        React.useState(null);
    const [raceDistributionData, setRaceDistributionData] =
        React.useState(null);
    function refreshServerStatus() {
        Fetch("https://api.ddoaudit.com/gamestatus/serverstatus", 5000)
            .then((val) => {
                setPopupMessage(null);
                set_serverStatusData(val);
            })
            .catch(() => {
                setPopupMessage({
                    title: "Can't Determine Server Status",
                    message:
                        "We weren't able to check on the servers. You can refresh the page or report the issue.",
                    icon: "warning",
                    fullscreen: false,
                    reportMessage: "Could not fetch ServerStatus. Timeout",
                });
            });
    }
    React.useEffect(() => {
        Fetch("https://api.ddoaudit.com/population/uniquedata", 5000)
            .then((val) => {
                setUniqueData(val);
            })
            .catch((err) => {
                dataFailedToLoad();
            });
        Fetch("https://api.ddoaudit.com/population/serverdistribution", 5000)
            .then((val) => {
                setServerDistributionData(val);
            })
            .catch((err) => {
                dataFailedToLoad();
            });
        Fetch("https://api.ddoaudit.com/population/hourlydistribution", 5000)
            .then((val) => {
                setHourlyDistributionData(val);
            })
            .catch((err) => {
                dataFailedToLoad();
            });
        Fetch("https://api.ddoaudit.com/population/dailydistribution", 5000)
            .then((val) => {
                setDailyDistributionData(val);
            })
            .catch((err) => {
                dataFailedToLoad();
            });
        Fetch("https://api.ddoaudit.com/demographics/leveldistribution", 5000)
            .then((val) => {
                setLevelDistributionData(val);
            })
            .catch((err) => {
                dataFailedToLoad();
            });
        Fetch("https://api.ddoaudit.com/demographics/classdistribution", 5000)
            .then((val) => {
                setClassDistributionData(val);
            })
            .catch((err) => {
                dataFailedToLoad();
            });
        Fetch("https://api.ddoaudit.com/demographics/racedistribution", 5000)
            .then((val) => {
                setRaceDistributionData(val);
            })
            .catch((err) => {
                dataFailedToLoad();
            });

        refreshServerStatus();
        const interval = setInterval(() => refreshServerStatus(), 60000);
        return () => clearInterval(interval);
    }, []);

    function loadLevelDistributionBanks() {
        Fetch(
            "https://api.ddoaudit.com/demographics/leveldistribution_banks",
            3000
        )
            .then((val) => {
                setLevelDistributionData(val);
            })
            .catch((err) => {
                dataFailedToLoad();
            });
        setLevelDistributionDataBanks(true);
    }

    function loadClassDistributionBanks() {
        Fetch(
            "https://api.ddoaudit.com/demographics/classdistribution_banks",
            3000
        )
            .then((val) => {
                setClassDistributionData(val);
            })
            .catch((err) => {
                dataFailedToLoad();
            });
        setClassDistributionDataBanks(true);
    }

    function loadRaceDistributionBanks() {
        Fetch(
            "https://api.ddoaudit.com/demographics/racedistribution_banks",
            3000
        )
            .then((val) => {
                setRaceDistributionData(val);
            })
            .catch((err) => {
                dataFailedToLoad();
            });
        setRaceDistributionDataBanks(true);
    }

    function dataFailedToLoad() {
        setPopupMessage({
            title: "Some data failed to load",
            message:
                "Some of the reports on this page may have failed to load. Please refresh the page. If the issue continues, report it.",
            icon: "warning",
            fullscreen: false,
            reportMessage: "Failed to fetch data.",
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
                    content="DDO's server populations, character demographics, content popularity, and long-term trends. Check time zone activity and choose which server is best for you!"
                />
                <meta property="og:image" content="/icons/servers-512px.png" />
                <meta property="og:site_name" content="DDO Audit" />
                <meta
                    property="twitter:image"
                    content="/icons/servers-512px.png"
                />
            </Helmet>
            <Banner
                small={true}
                showTitle={true}
                showSubtitle={true}
                showButtons={false}
                hideOnMobile={true}
                title="Servers"
                subtitle="Server Population, Demographics, and Trends"
            />
            <PopupMessage
                page="servers"
                message={popupMessage}
                popMessage={() => {
                    setPopupMessage(null);
                }}
            />
            <div className="content-container">
                <BannerMessage page="servers" />
                <div className="top-content-padding shrink-on-mobile" />
                <ContentCluster title="Select a Server">
                    <div className="content-cluster-options">
                        {SERVER_NAMES.map((name, i) => (
                            <Link
                                to={"/servers/" + name.toLowerCase()}
                                key={i}
                                className="nav-box shrinkable"
                            >
                                <div className="nav-box-title">
                                    {serverStatusData
                                        ? GetSVG(
                                              serverStatusData.Worlds.filter(
                                                  (server) =>
                                                      server.Name === name
                                              )[0]
                                          )
                                        : GetSVG()}
                                    <h2 className="content-option-title">
                                        {name}
                                    </h2>
                                </div>
                                {GetServerDescription(name)}
                            </Link>
                        ))}
                    </div>
                    <p
                        style={{
                            fontSize: "1.2rem",
                            lineHeight: "normal",
                            color: "var(--text-faded)",
                            marginTop: "20px",
                            marginBottom: "0px",
                        }}
                    >
                        Unique player counts are based on the last quarter.
                    </p>
                </ContentCluster>
                <ContentCluster
                    title={`Server ${
                        serverDistributionType === "population"
                            ? "Population"
                            : "LFM"
                    } Distribution`}
                    altTitle="Server Distribution"
                    description={
                        <span>
                            <span className="lfm-number">
                                {`Which server ${
                                    serverDistributionType === "population"
                                        ? "is the most populated"
                                        : "has the most LFMs"
                                }?`}
                            </span>{" "}
                            {`${
                                serverDistributionType === "population"
                                    ? "Population"
                                    : "LFM"
                            } distribution across the servers over the
                            last 90 days.`}
                            <br />
                            <span
                                className="faux-link"
                                onClick={() => {
                                    setServerDistributionType(
                                        serverDistributionType === "population"
                                            ? "groups"
                                            : "population"
                                    );
                                    Log(
                                        "Switched between population/LFMs",
                                        "Server pie chart"
                                    );
                                }}
                            >
                                Click here to switch to{" "}
                                {serverDistributionType === "population"
                                    ? "LFM"
                                    : "population"}{" "}
                                data
                            </span>
                        </span>
                    }
                >
                    <ChartPie
                        data={serverDistributionData}
                        noAnim={true}
                        useDataColors={true}
                        alwaysShow={true}
                    />
                </ContentCluster>
                <ContentCluster
                    title={`Hourly ${
                        hourlyDistributionType === "population"
                            ? "Population"
                            : "LFM"
                    } Distribution`}
                    altTitle="Hourly Distribution"
                    description={
                        <span>
                            <span className="lfm-number">
                                {`Which server ${
                                    hourlyDistributionType === "population"
                                        ? "is the most active for my time zone"
                                        : "has the most LFMs for my time zone"
                                }?`}
                            </span>{" "}
                            {`Average ${
                                hourlyDistributionType === "population"
                                    ? "Population"
                                    : "LFM count"
                            } for each hour of the day.`}
                            <br />
                            <span
                                className="faux-link"
                                onClick={() => {
                                    setHourlyDistributionType(
                                        hourlyDistributionType === "population"
                                            ? "groups"
                                            : "population"
                                    );
                                    Log(
                                        "Switched between population/LFMs",
                                        "Server hourly distribution"
                                    );
                                }}
                            >
                                Click here to switch to{" "}
                                {hourlyDistributionType === "population"
                                    ? "LFM"
                                    : "population"}{" "}
                                data
                            </span>
                        </span>
                    }
                >
                    <ChartLine
                        keys={null}
                        indexBy={null}
                        legendBottom="Time of day (EST)"
                        legendLeft={
                            hourlyDistributionType === "population"
                                ? "Population"
                                : "LFM Count"
                        }
                        data={hourlyDistributionData}
                        markedEvents={timeNowEvent}
                        markedEventsType="numeric"
                        noAnim={true}
                        title="Distribution"
                        marginBottom={60}
                        trendType=""
                        noArea={true}
                        straightLegend={true}
                        tooltipPrefix="Hour"
                    />
                </ContentCluster>
                <ContentCluster
                    title={`Daily ${
                        dailyDistributionType === "population"
                            ? "Population"
                            : "LFM"
                    } Distribution`}
                    altTitle="Daily Distribution"
                    description={
                        <span>
                            <span className="lfm-number">
                                {`Which days ${
                                    dailyDistributionType === "population"
                                        ? "are my server most populated"
                                        : "have the most LFMs posted"
                                }?`}
                            </span>{" "}
                            {`Average ${
                                dailyDistributionType === "population"
                                    ? "Population"
                                    : "LFM count"
                            } for each day of the week.`}
                            <br />
                            <span
                                className="faux-link"
                                onClick={() => {
                                    setDailyDistributionType(
                                        dailyDistributionType === "population"
                                            ? "groups"
                                            : "population"
                                    );
                                    Log(
                                        "Switched between population/LFMs",
                                        "Server daily distribution"
                                    );
                                }}
                            >
                                Click here to switch to{" "}
                                {dailyDistributionType === "population"
                                    ? "LFM"
                                    : "population"}{" "}
                                data
                            </span>
                        </span>
                    }
                >
                    <ChartBar
                        keys={[...SERVER_NAMES]}
                        indexBy="Day"
                        legendBottom="Day of Week"
                        legendLeft={
                            dailyDistributionType === "population"
                                ? "Population"
                                : "LFM Count"
                        }
                        data={dailyDistributionData}
                        noAnim={true}
                        display="Grouped"
                        straightLegend={true}
                        legendOffset={40}
                        dataIncludesColors={true}
                        paddingBottom={60}
                    />
                </ContentCluster>
                <ContentCluster
                    title="Population Distribution by Level"
                    description={
                        <>
                            Average percentage of the population at each level.{" "}
                            <span
                                className={
                                    levelDistributionDataBanks
                                        ? "red-text"
                                        : "lfm-number"
                                }
                            >
                                {levelDistributionDataBanks
                                    ? "Showing bank characters"
                                    : "Bank characters were filtered out of this report"}{" "}
                                <span
                                    className="faux-link"
                                    onClick={() =>
                                        readAbout(
                                            "filter banks characters",
                                            loadLevelDistributionBanks
                                        )
                                    }
                                >
                                    (read more)
                                </span>
                            </span>
                            . Normalized for server population.
                        </>
                    }
                >
                    <ChartLine
                        keys={null}
                        indexBy={null}
                        legendBottom="Character level"
                        legendLeft="Population Percentage"
                        data={levelDistributionData}
                        noAnim={true}
                        title="Distribution"
                        marginBottom={60}
                        trendType=""
                        noArea={true}
                        curve="linear"
                        straightLegend={true}
                        tooltipPrefix="Level"
                    />
                </ContentCluster>
                <ContentCluster
                    title="Population Distribution by Class"
                    description={
                        <>
                            Average percentage of the population for each class.{" "}
                            <span className="lfm-number">
                                Primary class only{" "}
                                <span
                                    className="faux-link"
                                    onClick={() =>
                                        readAbout("primary class only")
                                    }
                                >
                                    (read more)
                                </span>
                            </span>
                            .{" "}
                            <span
                                className={
                                    classDistributionDataBanks
                                        ? "red-text"
                                        : "lfm-number"
                                }
                            >
                                {classDistributionDataBanks
                                    ? "Showing bank characters"
                                    : "Bank characters were filtered out of this report"}{" "}
                                <span
                                    className="faux-link"
                                    onClick={() =>
                                        readAbout(
                                            "filter banks characters",
                                            loadClassDistributionBanks
                                        )
                                    }
                                >
                                    (read more)
                                </span>
                            </span>
                            . Normalized for server population.
                        </>
                    }
                >
                    <ChartBar
                        keys={[...SERVER_NAMES]}
                        indexBy="Class"
                        legendBottom="Class"
                        legendLeft="Population Percentage"
                        data={classDistributionData}
                        noAnim={true}
                        display="Grouped"
                        straightLegend={true}
                        legendOffset={40}
                        dataIncludesColors={true}
                        paddingBottom={60}
                    />
                </ContentCluster>
                <ContentCluster
                    title="Population Distribution by Race"
                    description={
                        <>
                            Average percentage of the population for each race.{" "}
                            <span
                                className={
                                    raceDistributionDataBanks
                                        ? "red-text"
                                        : "lfm-number"
                                }
                            >
                                {raceDistributionDataBanks
                                    ? "Showing bank characters"
                                    : "Bank characters were filtered out of this report"}{" "}
                                <span
                                    className="faux-link"
                                    onClick={() =>
                                        readAbout(
                                            "filter banks characters",
                                            loadRaceDistributionBanks
                                        )
                                    }
                                >
                                    (read more)
                                </span>
                            </span>
                            .
                        </>
                    }
                >
                    <ChartPie
                        data={raceDistributionData}
                        hideCustomLegend={true}
                        innerRadius={0.5}
                        arcLabelsRadiusOffset={0.5}
                    />
                </ContentCluster>
                <ContentCluster title="See Also...">
                    <div className="content-cluster-options">
                        {/* <Link
                            to="/live"
                            className="nav-box"
                            style={{
                                height: "auto",
                                minHeight: "150px",
                            }}
                        >
                            <div className="nav-box-title">
                                <LiveSVG className="nav-icon-large should-invert" />
                                <h2 className="content-option-title">
                                    Quick Info
                                </h2>
                            </div>
                            <p className="content-option-description">
                                Server status, most populated server, and
                                default server.
                            </p>
                        </Link> */}
                        <Link
                            to="/trends"
                            className="nav-box"
                            style={{
                                height: "auto",
                                minHeight: "150px",
                            }}
                        >
                            <div className="nav-box-title">
                                <TrendsSVG className="nav-icon-large should-invert" />
                                <h2 className="content-option-title">Trends</h2>
                            </div>
                            <p className="content-option-description">
                                Long-term trends, daily minimum and maximum
                                population, and important game events.
                            </p>
                        </Link>
                    </div>
                </ContentCluster>
            </div>
        </div>
    );
};

export default Directory;
