import React, { useState, useEffect, useRef } from "react";
import Banner from "../global/Banner";
import { Fetch } from "../../services/DataLoader";
import PopupMessage from "../global/PopupMessage";
import QuickInfo from "./QuickInfo";
import PlayerAndLfmSubtitle from "./PlayerAndLfmSubtitle";
import ChartLine from "../global/ChartLine";
import ServerStatusDisplay from "../global/ServerStatusDisplay";
import { ReactComponent as ServersSVG } from "../../assets/global/servers.svg";
import { ReactComponent as TrendsSVG } from "../../assets/global/trends.svg";
import { Link, useLocation } from "react-router-dom";
import { Helmet } from "react-helmet";
import BannerMessage from "../global/BannerMessage";
import ContentCluster from "../global/ContentCluster";

const Live = (props) => {
    const TITLE = "DDO Server Status";

    // Popup message
    var [popupMessage, setPopupMessage] = React.useState(null);

    const [serverStatusData, setServerStatusData] = React.useState(null);
    const [quickInfoData, setQuickInfoData] = React.useState(null);
    const [uniqueCountsData, setUniqueCountsData] = React.useState(null);
    const [playerAndLFMCountData, setPlayerAndLFMCountData] =
        React.useState(null);

    const [population24HoursData, setPopulation24HoursData] =
        React.useState(null);

    function refreshServerStatus() {
        Fetch("https://www.playeraudit.com/api/serverstatus", 5000)
            .then((val) => {
                setServerStatusData(val);
            })
            .catch((err) => {
                setPopupMessage({
                    title: "Couldn't get server status",
                    message:
                        "We failed to look up server staus. Try refreshing the page. If the issue continues, please report it.",
                    icon: "warning",
                    fullscreen: false,
                    reportMessage:
                        (err && err.toString()) || "Server status error",
                    submessage:
                        (err && err.toString()) || "Server status error",
                });
                setServerStatusData(null);
            });
    }

    React.useEffect(() => {
        refreshServerStatus();
        const interval = setInterval(() => refreshServerStatus(), 30000); // Server status should refresh on this page

        Fetch("https://www.playeraudit.com/api/quickinfo", 5000)
            .then((val) => {
                setQuickInfoData(val);
            })
            .catch((err) => {
                setPopupMessage({
                    title: "Couldn't get population data",
                    message:
                        "We failed to look up the most populated server. Try refreshing the page. If the issue continues, please report it.",
                    icon: "warning",
                    fullscreen: false,
                    reportMessage:
                        (err && err.toString()) || "Quick info error",
                    submessage: (err && err.toString()) || "Quick info error",
                });
                setQuickInfoData(null);
            });

        Fetch("https://www.playeraudit.com/api/uniquedata", 5000)
            .then((val) => {
                setUniqueCountsData(val);
            })
            .catch((err) => {
                setPopupMessage({
                    title: "Couldn't get unique data",
                    message:
                        "We failed to look up quarterly players and guilds. Try refreshing the page. If the issue continues, please report it.",
                    icon: "warning",
                    fullscreen: false,
                    reportMessage:
                        (err && err.toString()) || "Unique data error",
                    submessage: (err && err.toString()) || "Unique data error",
                });
                setUniqueCountsData(null);
            });

        Fetch("https://api.ddoaudit.com/population/day", 5000)
            .then((val) => {
                setPopulation24HoursData(
                    val.filter((series) => series.id !== "Total")
                );
            })
            .catch((err) => {
                setPopupMessage({
                    title: "Couldn't get population data",
                    message:
                        "We failed to look up recent population data. Try refreshing the page. If the issue continues, please report it.",
                    icon: "warning",
                    fullscreen: false,
                    reportMessage:
                        (err && err.toString()) || "24 hour population error",
                    submessage:
                        (err && err.toString()) || "24 hour population error",
                });
                setPopulation24HoursData(null);
            });

        Fetch("https://www.playeraudit.com/api/playerandlfmcount", 5000)
            .then((val) => {
                setPlayerAndLFMCountData(val);
            })
            .catch((err) => {
                setPopupMessage({
                    title: "Couldn't get population data",
                    message:
                        "We failed to look up current population data. Try refreshing the page. If the issue continues, please report it.",
                    icon: "warning",
                    fullscreen: false,
                    reportMessage:
                        (err && err.toString()) || "Current population error",
                    submessage:
                        (err && err.toString()) || "Current population error",
                });
                setPlayerAndLFMCountData(null);
            });

        return () => clearInterval(interval); // Clear server status interval
    }, []);

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
                title="Live"
                subtitle="Live population and quick info"
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
                <div className="top-content-padding shrink-on-mobile" />
                <ServerStatusDisplay data={serverStatusData} />
                <QuickInfo
                    data={quickInfoData}
                    unique={uniqueCountsData}
                    serverstatus={serverStatusData}
                />
                <ContentCluster title="Live Population">
                    <PlayerAndLfmSubtitle data={playerAndLFMCountData} />
                    <ChartLine
                        data={population24HoursData}
                        trendType="day"
                        activeFilter="Server Activity"
                        showActions={false}
                        showLastUpdated={true}
                        reportReference={null}
                    />
                </ContentCluster>
                <ContentCluster
                    title="Historical Population"
                    description="These reports have moved to the following locations:"
                >
                    <div className="content-cluster-options">
                        <Link
                            to="/servers"
                            className="nav-box"
                            style={{
                                height: "auto",
                                minHeight: "150px",
                            }}
                        >
                            <div className="nav-box-title">
                                <ServersSVG className="nav-icon-large should-invert" />
                                <h2 className="content-option-title">
                                    Server Statistics
                                </h2>
                            </div>
                            <p className="content-option-description">
                                Server population, demographics, and trends.
                            </p>
                        </Link>
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

export default Live;
