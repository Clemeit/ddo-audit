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
import ChartLine from "../global/ChartLine";
import ServerStatusDisplay from "../global/ServerStatusDisplay";
// import PlayerAndLfmSubtitle from "./PlayerAndLfmSubtitle";
// import ChartPopulationHistory from "../ChartPopulationHistory";
import { ReactComponent as ServersSVG } from "../../assets/global/servers.svg";
import { ReactComponent as TrendsSVG } from "../../assets/global/trends.svg";
import { Link, useLocation } from "react-router-dom";
import { Helmet } from "react-helmet";
import BannerMessage from "../global/BannerMessage";
import ContentCluster from "../global/ContentCluster";

const Live = (props) => {
    const TITLE = "DDO Server Status";

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
            .catch(() => {});
    }

    React.useEffect(() => {
        refreshServerStatus();
        const interval = setInterval(() => refreshServerStatus(), 30000); // Server status should refresh on this page

        Fetch("https://www.playeraudit.com/api/quickinfo", 5000).then((val) => {
            setQuickInfoData(val);
        });
        Fetch("https://www.playeraudit.com/api/uniquedata", 5000).then(
            (val) => {
                setUniqueCountsData(val);
            }
        );
        Fetch("https://api.ddoaudit.com/population/day", 5000).then((val) => {
            setPopulation24HoursData(
                val.filter((series) => series.id !== "Total")
            );
        });
        Fetch("https://www.playeraudit.com/api/playerandlfmcount", 5000).then(
            (val) => {
                setPlayerAndLFMCountData(val);
            }
        );
        return () => clearInterval(interval); // Clear server status interval
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
