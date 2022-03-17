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
import { Log } from "../../services/CommunicationService";
import { IsTheBigDay } from "../../services/TheBigDay";

const Live = (props) => {
    const TITLE = "DDO Server Status";

    // Popup message
    var [popupMessage, setPopupMessage] = React.useState(null);

    const [serverStatusData, setServerStatusData] = React.useState(null);
    const [uniqueCountsData, setUniqueCountsData] = React.useState(null);
    const [playerAndLFMCountData, setPlayerAndLFMCountData] =
        React.useState(null);
    const [serverDistributionData, setServerDistributionData] =
        React.useState(null);

    const [population24HoursData, setPopulation24HoursData] =
        React.useState(null);
    const [population24HoursType, setPopulation24HoursType] =
        React.useState("population");
    let firstLoadRef = React.useRef(true);

    React.useEffect(() => {
        if (firstLoadRef.current === true) {
            firstLoadRef.current = false;
            return;
        }
        Fetch(
            `https://api.ddoaudit.com/population/day${
                population24HoursType === "population" ? "" : "_groups"
            }`,
            5000
        ).then((val) => {
            if (IsTheBigDay()) {
                setPopulation24HoursData(
                    val.filter((series) => series.id === "Total")
                );
            } else {
                setPopulation24HoursData(
                    val.filter((series) => series.id !== "Total")
                );
            }
        });
    }, [population24HoursType]);

    function refreshServerStatus() {
        Fetch("https://api.ddoaudit.com/gamestatus/serverstatus", 5000)
            .then((val) => {
                setPopupMessage(null);
                val.Worlds = [
                    ...val.Worlds.filter((w) => w.Name !== "Hardcore"),
                    ...val.Worlds.filter((w) => w.Name === "Hardcore"),
                ];
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

    function refreshPopulationAndQuickInfo() {
        Fetch("https://api.ddoaudit.com/population/uniquedata", 5000)
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
                if (IsTheBigDay()) {
                    setPopulation24HoursData(
                        val.filter((series) => series.id === "Total")
                    );
                } else {
                    setPopulation24HoursData(
                        val.filter((series) => series.id !== "Total")
                    );
                }
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

        Fetch("https://api.ddoaudit.com/population/latest", 5000)
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

        Fetch("https://api.ddoaudit.com/population/serverdistribution", 5000)
            .then((val) => {
                setServerDistributionData(val);
            })
            .catch((err) => {
                setPopupMessage({
                    title: "Couldn't get most populated server",
                    message:
                        "We failed to look up recent population data. Try refreshing the page. If the issue continues, please report it.",
                    icon: "warning",
                    fullscreen: false,
                    reportMessage:
                        (err && err.toString()) || "Server distribution error",
                    submessage:
                        (err && err.toString()) || "Server distribution error",
                });
                setServerDistributionData(null);
            });
    }

    React.useEffect(() => {
        refreshServerStatus();
        refreshPopulationAndQuickInfo();
        const interval = setInterval(() => refreshServerStatus(), 30000); // Server status should refresh on this page
        const interval2 = setInterval(
            () => refreshPopulationAndQuickInfo(),
            60000 * 5
        );

        return () => {
            clearInterval(interval);
            clearInterval(interval2);
        };
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
                <div className="top-content-padding shrink-on-mobile" />
                <ServerStatusDisplay data={serverStatusData} />
                <QuickInfo
                    unique={uniqueCountsData}
                    serverstatus={serverStatusData}
                    serverdistribution={serverDistributionData}
                />
                <ContentCluster
                    title={`Live ${
                        population24HoursType === "population"
                            ? "Population"
                            : "LFM Count"
                    }`}
                    altTitle="Live Data"
                    description={
                        <span>
                            <PlayerAndLfmSubtitle
                                data={playerAndLFMCountData}
                            />
                            <span
                                className="faux-link"
                                onClick={() => {
                                    setPopulation24HoursType(
                                        population24HoursType === "population"
                                            ? "groups"
                                            : "population"
                                    );
                                    Log(
                                        "Switched between population/LFMs",
                                        "Live"
                                    );
                                }}
                            >
                                Click here to switch to{" "}
                                {population24HoursType === "population"
                                    ? "LFM"
                                    : "population"}{" "}
                                data
                            </span>
                        </span>
                    }
                >
                    <ChartLine
                        data={population24HoursData}
                        trendType="day"
                        activeFilter="Server Activity"
                        showActions={false}
                        showLastUpdated={true}
                        reportReference={null}
                        showArea={IsTheBigDay()}
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
                                Server population, character demographics, and
                                activity trends.
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
