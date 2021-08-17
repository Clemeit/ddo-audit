import React from "react";
import Banner from "../global/Banner";
// import QuickInfo from "../QuickInfo";
import { Fetch } from "../../services/DataLoader";
// import "./default.css";
// import ReportIssueForm from "../ReportIssueForm";
import PopupMessage from "../global/PopupMessage";
import Card from "../global/Card";
import QuickInfo from "./QuickInfo";
import PlayerAndLfmSubtitle from "./PlayerAndLfmSubtitle";
import ChartPopulationHistory from "../global/ChartPopulationHistory";
import ServerStatusDisplay from "../global/ServerStatusDisplay";
// import PlayerAndLfmSubtitle from "./PlayerAndLfmSubtitle";
// import ChartPopulationHistory from "../ChartPopulationHistory";
import { ReactComponent as ServersSVG } from "../../assets/global/servers.svg";
import { ReactComponent as TrendsSVG } from "../../assets/global/trends.svg";
import { Link, useLocation } from "react-router-dom";
import { Helmet } from "react-helmet";

const Live = (props) => {
    const TITLE = "DDO Server Status";

    const [serverStatusData, setServerStatusData] = React.useState(null);
    const [quickInfoData, setQuickInfoData] = React.useState(null);
    const [uniqueCountsData, setUniqueCountsData] = React.useState(null);
    const [playerAndLFMCountData, setPlayerAndLFMCountData] =
        React.useState(null);

    const [population24HoursData, setPopulation24HoursData] =
        React.useState(null);

    React.useEffect(() => {
        Fetch("https://www.playeraudit.com/api/serverstatus", 5000)
            .then((val) => {
                setServerStatusData(val);
            })
            .catch(() => {});
        Fetch("https://www.playeraudit.com/api/quickinfo", 5000).then((val) => {
            setQuickInfoData(val);
        });
        Fetch("https://www.playeraudit.com/api/uniquedata", 5000).then(
            (val) => {
                setUniqueCountsData(val);
            }
        );
        Fetch("https://api.npafrequency.xyz/population/day", 5000).then(
            (val) => {
                setPopulation24HoursData(val);
            }
        );
        Fetch("https://www.playeraudit.com/api/playerandlfmcount", 5000).then(
            (val) => {
                setPlayerAndLFMCountData(val);
            }
        );
    }, []);

    return (
        <div>
            <Banner
                small={true}
                showTitle={true}
                showSubtitle={true}
                showButtons={false}
                hideOnMobile={true}
                title="Live"
                subtitle="Live population and quick info"
            />
            <Helmet>
                <title>{TITLE}</title>
                <meta
                    name="description"
                    content="DDO server status, most populated server, current default server, live and quarterly population."
                />
            </Helmet>
            <div id="content-container">
                <div className="top-content-padding shrink-on-mobile" />
                <ServerStatusDisplay data={serverStatusData} />
                <QuickInfo data={quickInfoData} unique={uniqueCountsData} />
                <div className="content-cluster">
                    <h2 style={{ color: "var(--text)" }}>Live Population</h2>
                    <hr
                        style={{
                            backgroundColor: "var(--text)",
                            opacity: 0.2,
                        }}
                    />
                    <PlayerAndLfmSubtitle data={playerAndLFMCountData} />
                    <ChartPopulationHistory
                        data={population24HoursData}
                        trendType="day"
                        activeFilter="Server Activity"
                        showActions={false}
                        showLastUpdated={true}
                        reportReference={null}
                    />
                </div>
                <div className="content-cluster">
                    <h2 style={{ color: "var(--text)" }}>
                        Historical Population
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
                        These reports have moved to the following locations:
                    </p>
                    <div className="content-cluster-options">
                        <Link to="/servers" className="nav-box">
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
                        <Link to="/trends" className="nav-box">
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

export default Live;
