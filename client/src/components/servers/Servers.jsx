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
import ChartPie from "../global/ChartPie";
import ChartLine from "../global/ChartLine";

const Directory = (props) => {
    const TITLE = "DDO Server Status and Demographics";
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
    const [serverDistributionData, setServerDistributionData] =
        React.useState(null);
    const [hourlyDistributionData, setHourlyDistributionData] =
        React.useState(null);
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
        Fetch("https://www.playeraudit.com/api/uniquedata", 3000).then(
            (val) => {
                setUniqueData(val);
            }
        );
        Fetch(
            "https://api.ddoaudit.com/population/serverdistribution",
            3000
        ).then((val) => {
            setServerDistributionData(val);
        });
        Fetch(
            "https://api.ddoaudit.com/population/hourlydistribution",
            3000
        ).then((val) => {
            setHourlyDistributionData(val);
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
            <div className="content-container">
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
                    <h2 style={{ color: "var(--text)" }}>
                        Server Population Distribution
                    </h2>
                    <hr
                        style={{
                            backgroundColor: "var(--text)",
                            opacity: 0.2,
                        }}
                    />
                    <p
                        style={{
                            textAlign: "justify",
                            fontSize: "1.5rem",
                            lineHeight: "normal",
                            color: "var(--text-faded)",
                        }}
                    >
                        Population distribution across the servers over the last
                        90 days.
                    </p>
                    <ChartPie
                        data={serverDistributionData}
                        noAnim={true}
                        useDataColors={true}
                    />
                </div>
                <div className="content-cluster">
                    <h2 style={{ color: "var(--text)" }}>
                        Hourly Population Distribution
                    </h2>
                    <hr
                        style={{
                            backgroundColor: "var(--text)",
                            opacity: 0.2,
                        }}
                    />
                    <p
                        style={{
                            textAlign: "justify",
                            fontSize: "1.5rem",
                            lineHeight: "normal",
                            color: "var(--text-faded)",
                        }}
                    >
                        Average population over the course of a 24 hour day
                        cycle.
                    </p>
                    <ChartLine
                        keys={null}
                        indexBy={null}
                        legendBottom="Time of day (EST)"
                        legendLeft="Population"
                        data={hourlyDistributionData}
                        noAnim={true}
                        title="Hourly distribution"
                        marginBottom={60}
                        trendType=""
                        noArea={true}
                        // tickValues="every 1 day"
                        // trendType="week"
                    />
                </div>
                <div className="content-cluster">
                    <h2 style={{ color: "var(--text)" }}>See Also...</h2>
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
