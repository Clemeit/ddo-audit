import React, { useState, useEffect, useRef } from "react";
import Banner from "../global/Banner";
import { Fetch } from "../../services/DataLoader";
import PopupMessage from "../global/PopupMessage";
import QuickInfo from "./QuickInfo";
import ServerStatusDisplay from "../global/serverStatusDisplay/ServerStatusDisplay";
import { ReactComponent as ServersSVG } from "../../assets/global/servers.svg";
import { ReactComponent as TrendsSVG } from "../../assets/global/trends.svg";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import BannerMessage from "../global/BannerMessage";
import ContentCluster from "../global/ContentCluster";
import DataClassification from "../global/DataClassification";
import usePollGameInfo from "../../hooks/usePollGameInfo";
import LiveContentCluster from "./LiveContentCluster";
import { SERVER_LIST_LOWERCASE } from "../../constants/Servers";
import News from "./News";
import FAQ from "./FAQ";

const Live = (props) => {
    const TITLE = "DDO Server Status";
    const API_HOST = "https://api.hcnxsryjficudzazjxty.com";
    const API_VERSION = "v1";
    const API_URL = `${API_HOST}/${API_VERSION}`;
    const GAME_INFO_24HR_API = `${API_URL}/reports/game_info_24_hour`;

    const { gameStatusData, isLoaded, isError } = usePollGameInfo();

    // Popup message
    var [popupMessage, setPopupMessage] = React.useState(null);

    // const [serverStatusData, setServerStatusData] = React.useState([null, null]);
    const [uniqueCountsData, setUniqueCountsData] = React.useState(null);
    const [playerAndLFMCountData, setPlayerAndLFMCountData] =
        React.useState(null);
    const [serverDistributionData, setServerDistributionData] =
        React.useState(null);
    const [game24HourData, setGame24HourData] = React.useState(undefined);

    // const [population24HoursData, setPopulation24HoursData] =
    //     React.useState(null);
    // const [population24HoursType, setPopulation24HoursType] =
    //     React.useState("population");

    function refreshPopulationAndQuickInfo() {
        // Fetch("https://api.ddoaudit.com/population/uniquedata", 5000)
        //     .then((val) => {
        //         setUniqueCountsData(val);
        //     })
        //     .catch((err) => {
        //         setPopupMessage({
        //             title: "Couldn't get unique data",
        //             message:
        //                 "We failed to look up quarterly players and guilds. Try refreshing the page. If the issue continues, please report it.",
        //             icon: "warning",
        //             fullscreen: false,
        //             reportMessage:
        //                 (err && err.toString()) || "Unique data error",
        //             submessage: (err && err.toString()) || "Unique data error",
        //         });
        //         setUniqueCountsData(null);
        //     });
        // Fetch("https://api.ddoaudit.com/population/latest", 5000)
        //     .then((val) => {
        //         setPlayerAndLFMCountData(val);
        //     })
        //     .catch((err) => {
        //         setPopupMessage({
        //             title: "Couldn't get population data",
        //             message:
        //                 "We failed to look up current population data. Try refreshing the page. If the issue continues, please report it.",
        //             icon: "warning",
        //             fullscreen: false,
        //             reportMessage:
        //                 (err && err.toString()) || "Current population error",
        //             submessage:
        //                 (err && err.toString()) || "Current population error",
        //         });
        //         setPlayerAndLFMCountData(null);
        //     });
        // Fetch(
        //     "https://api.ddoaudit.com/population/serverdistributionmonth",
        //     5000
        // )
        //     .then((val) => {
        //         setServerDistributionData(val);
        //     })
        //     .catch((err) => {
        //         setPopupMessage({
        //             title: "Couldn't get most populated server",
        //             message:
        //                 "We failed to look up recent population data. Try refreshing the page. If the issue continues, please report it.",
        //             icon: "warning",
        //             fullscreen: false,
        //             reportMessage:
        //                 (err && err.toString()) || "Server distribution error",
        //             submessage:
        //                 (err && err.toString()) || "Server distribution error",
        //         });
        //         setServerDistributionData(null);
        //     });
    }

    const [news, setNews] = React.useState(null);

    function getNews() {
        Fetch("https://api.ddoaudit.com/news", 5000)
            .then((val) => {
                setNews(val || []);
            })
            .catch(() => {});
    }

    React.useEffect(() => {
        fetch(GAME_INFO_24HR_API)
            .then((response) => response.json())
            .then((data) => {
                setGame24HourData(data);
            });
    }, []);

    React.useEffect(() => {
        // refreshServerStatus();
        refreshPopulationAndQuickInfo();
        // const interval = setInterval(() => refreshServerStatus(), 5000); // Server status should refresh on this page
        const interval2 = setInterval(
            () => refreshPopulationAndQuickInfo(),
            60000 * 5
        );

        getNews();

        return () => {
            // clearInterval(interval);
            clearInterval(interval2);
        };
    }, []);

    function getMostPopulatedServerLink(nameonly = false) {
        let mostpopulatedserver = "";
        let population = 0;
        if (serverDistributionData == null || serverDistributionData == []) {
            return (
                <span style={{ color: "var(--red-text)" }}>
                    unknown (failed to fetch data)
                </span>
            );
        }
        serverDistributionData.forEach((series) => {
            if (series.value > population && series.id !== "Hardcore") {
                population = series.value;
                mostpopulatedserver = series.id;
            }
        });
        if (nameonly) {
            return mostpopulatedserver;
        }
        if (mostpopulatedserver == "unknown (servers are offline)") {
            return (
                <span style={{ color: "var(--red-text)" }}>
                    unknown (servers are offline)
                </span>
            );
        }
        return (
            <Link
                id="populous_server"
                className="blue-link"
                to={"/servers/" + mostpopulatedserver}
                style={{ textDecoration: "underline" }}
            >
                {mostpopulatedserver}
            </Link>
        );
    }

    function getDefaultServerLink() {
        let defaultServerName = "";
        if (!isLoaded) {
            return <span>unknown (loading...)</span>;
        }
        if (isError) {
            return (
                <span style={{ color: "var(--red-text)" }}>
                    unknown (failed to fetch data)
                </span>
            );
        }
        Object.entries(gameStatusData.servers).forEach(
            ([serverName, serverData]) => {
                if (serverData.index == 0) {
                    defaultServerName = serverName;
                }
            }
        );
        if (!SERVER_LIST_LOWERCASE.includes(defaultServerName)) {
            return (
                <span style={{ color: "var(--red-text)" }}>
                    unknown (servers are offline)
                </span>
            );
        }
        return (
            <Link
                id="default_server"
                className="blue-link"
                to={"/servers/" + defaultServerName}
                style={{ textDecoration: "underline" }}
            >
                {toSentenceCase(defaultServerName)}
            </Link>
        );
    }

    function toSentenceCase(str) {
        if (str === null) return "";
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    function getTotalUniquePlayerCount() {
        if (!uniqueCountsData) return "N/A";
        let total = 0;
        uniqueCountsData.forEach((server) => {
            total += server.TotalCharacters;
        });
        return formatWithCommas(total.toString());
    }

    function getTotalUniqueGuildCount() {
        if (!uniqueCountsData) return "N/A";
        let total = 0;
        uniqueCountsData.forEach((server) => {
            total += server.TotalGuilds;
        });
        return formatWithCommas(total.toString());
    }

    return (
        <div>
            <Helmet>
                <title>{TITLE}</title>
                <meta
                    name="description"
                    content="DDO server status, most populated server, current default server, and recent population trends."
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
            <Banner
                small={true}
                showTitle={true}
                showSubtitle={true}
                showButtons={false}
                hideOnMobile={true}
                hideVote={true}
                title="Live"
                subtitle="Server Status and Quick Info"
            />
            <PopupMessage
                page="live"
                message={popupMessage}
                popMessage={() => {
                    setPopupMessage(null);
                }}
            />
            <div className="content-container">
                <BannerMessage page="live" />
                <DataClassification classification="observed" />
                <div className="top-content-padding-small shrink-on-mobile" />
                <ServerStatusDisplay
                    gameStatusData={gameStatusData}
                    isLoaded={isLoaded}
                    isError={isError}
                />
                <QuickInfo
                    unique={uniqueCountsData}
                    gameStatusData={gameStatusData}
                    serverdistribution={serverDistributionData}
                    isLoaded={isLoaded}
                    isError={isError}
                    mostPopulatedServerLink={(nameOnly) =>
                        getMostPopulatedServerLink(nameOnly)
                    }
                    defaultServerLink={getDefaultServerLink}
                    totalUniquePlayerCount={getTotalUniquePlayerCount}
                    totalUniqueGuildCount={getTotalUniqueGuildCount}
                />
                <News news={news} />
                <FAQ
                    mostPopulatedServer={getMostPopulatedServerLink()}
                    defaultServer={getDefaultServerLink()}
                    uniquePlayerCount={getTotalUniquePlayerCount()}
                    uniqueGuildCount={getTotalUniqueGuildCount()}
                />
                <LiveContentCluster
                    gameStatusData={gameStatusData}
                    game24HourData={game24HourData}
                />
                <ContentCluster
                    title="Historical Population"
                    description="These reports have moved to the following locations:"
                >
                    <div className="content-cluster-options">
                        <Link
                            to="/servers"
                            className="nav-box shrinkable"
                            style={{
                                height: "auto",
                                minHeight: "150px",
                            }}
                        >
                            <div className="nav-box-title">
                                <ServersSVG className="nav-icon should-invert" />
                                <h2 className="content-option-title">
                                    Server Statistics
                                </h2>
                            </div>
                            <p className="content-option-description">
                                Server population, character demographics, and
                                activity trends.
                            </p>
                        </Link>
                        <Link
                            to="/trends"
                            className="nav-box shrinkable"
                            style={{
                                height: "auto",
                                minHeight: "150px",
                            }}
                        >
                            <div className="nav-box-title">
                                <TrendsSVG className="nav-icon should-invert" />
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

export default Live;
