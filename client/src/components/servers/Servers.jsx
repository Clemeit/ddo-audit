import React, { useState } from "react";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import { ReactComponent as OnlineSVG } from "../../assets/global/online.svg";
import { ReactComponent as OfflineSVG } from "../../assets/global/offline.svg";
import { ReactComponent as PendingSVG } from "../../assets/global/pending.svg";
import { ReactComponent as LiveSVG } from "../../assets/global/live.svg";
import { ReactComponent as TrendsSVG } from "../../assets/global/trends.svg";
import Banner from "../global/Banner";
import ServerStatusDisplay from "../global/ServerStatusDisplay";
import { Fetch, VerifyPlayerData } from "../../services/DataLoader";
import PopupMessage from "../global/PopupMessage";
import BannerMessage from "../global/BannerMessage";

const Directory = (props) => {
    const TITLE = "Server Status and Demographics";
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

    function GetServerDescription(name) {
        if (uniqueData === null || uniqueData === undefined) {
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
            .filter((server) => server.ServerName === name)
            .map((server) => (
                <p
                    className="content-option-description"
                    style={{
                        fontSize: "1.4rem",
                    }}
                >
                    <span
                        style={{
                            color: "var(--text-player-number)",
                        }}
                    >{`${server.UniquePlayers} unique players`}</span>
                    <span style={{ opacity: "0.7" }}> (quarterly)</span>
                    <br />
                    <span
                        style={{
                            color: "var(--text-lfm-number)",
                        }}
                    >{`${server.UniqueGuilds} unique guilds`}</span>
                    <span style={{ opacity: "0.7" }}> (quarterly)</span>
                </p>
            ));
    }

    const [uniqueData, setUniqueData] = React.useState(null);
    const [serverStatusData, set_serverStatusData] = React.useState(null);
    function refreshServerStatus() {
        Fetch("https://www.playeraudit.com/api/serverstatus", 5000)
            .then((val) => {
                set_serverStatusData(val);
            })
            .catch(() => {
                set_popupMessages([
                    ...popupMessages,
                    {
                        title: "Can't Determine Server Status",
                        message:
                            "We weren't able to check on the servers. You can refresh the page or report the issue.",
                        icon: "warning",
                        fullscreen: false,
                        reportMessage: "Could not fetch ServerStatus. Timeout",
                    },
                ]);
            });
    }
    React.useEffect(() => {
        async function fetchArbitraryData(url, type) {
            let response = await fetch(url);
            if (type === "json") response = await response.json();
            else if (type === "text") response = await response.text();
            return response;
        }
        fetchArbitraryData(
            "https://www.playeraudit.com/api/uniquedata",
            "json"
        ).then((val) => {
            setUniqueData(val);
        });

        refreshServerStatus();
        const interval = setInterval(() => refreshServerStatus(), 60000);
        return () => clearInterval(interval);
    }, []);

    // Popup message
    var [popupMessages, set_popupMessages] = React.useState([]);
    return (
        <div>
            <Helmet>
                <title>{TITLE}</title>
                <meta name="description" content="Description" />
            </Helmet>
            <Banner
                small={true}
                showTitle={true}
                showSubtitle={true}
                showButtons={false}
                hideOnMobile={true}
                title="Servers"
                subtitle="Server population, demographics, and trends"
            />
            <PopupMessage
                page="grouping"
                messages={popupMessages}
                popMessage={() => {
                    if (popupMessages.length) {
                        let newMessages = [...popupMessages];
                        newMessages = newMessages.slice(1);
                        set_popupMessages(newMessages);
                    }
                }}
            />
            <div id="content-container">
                <BannerMessage className="push-on-mobile" page="servers" />
                <div className="top-content-padding shrink-on-mobile" />
                <div className="content-cluster">
                    <h2 style={{ color: "var(--text)" }}>Select a Server</h2>
                    <hr
                        style={{
                            backgroundColor: "var(--text)",
                            opacity: 0.2,
                        }}
                    />
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
                </div>
                <div className="content-cluster">
                    <h2 style={{ color: "var(--text)" }}>Overview</h2>
                    <hr
                        style={{
                            backgroundColor: "var(--text)",
                            opacity: 0.2,
                        }}
                    />
                </div>
                <div className="content-cluster">
                    <h2 style={{ color: "var(--text)" }}>
                        You might also be looking for...
                    </h2>
                    <hr
                        style={{
                            backgroundColor: "var(--text)",
                            opacity: 0.2,
                        }}
                    />
                    <div className="content-cluster-options">
                        <Link
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
                                Most populated server, default server, and
                                server status.
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
                </div>
            </div>
        </div>
    );
};

export default Directory;
