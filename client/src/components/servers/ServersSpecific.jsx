import React from "react";
import { Helmet } from "react-helmet";
import { Link, useLocation } from "react-router-dom";
import Banner from "../global/Banner";
import { Fetch, VerifyPlayerData } from "../../services/DataLoader";
import PopupMessage from "../global/PopupMessage";
import BannerMessage from "../global/BannerMessage";
import UniqueCountsSubtitle from "./UniqueCountsSubtitle";
import ContentCluster from "../global/ContentCluster";
import ChartLine from "../global/ChartLine";
import ChartBar from "../global/ChartBar";
import CurrentCountsSubtitle from "./CurrentCountsSubtitle";
import { Log } from "../../services/CommunicationService";

const ServersSpecific = () => {
    const TITLE = "Population and Character Demographics";

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

    function getBreadcrumbs(servername) {
        // prettier-ignore
        return {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
                {
                    "@type": "ListItem",
                    position: 1,
                    name: "Servers",
                    item: "https://www.ddoaudit.com/servers",
                },
                {
                    "@type": "ListItem",
                    position: 2,
                    name: `${servername}`,
                },
            ],
        };
    }

    const [population1Year, setPopulation1Year] = React.useState(null);
    const [population1Quarter, setPopulation1Quarter] = React.useState(null);

    const [dailyLfmDistribution, setDailyLfmDistribution] =
        React.useState(null);
    const [hourlyLfmDistribution, setHourlyLfmDistribution] =
        React.useState(null);

    function readAbout(r, callback) {
        switch (r) {
            case "active characters":
                Log("Read about active characters", `Servers ${currentServer}`);
                setPopupMessage({
                    title: "Active Characters",
                    message: (
                        <span>
                            We consider a character "active" when they meet the
                            following criteria:
                            <ul>
                                <li>
                                    A character has moved areas (public or
                                    private) within 2 days of last being online
                                </li>
                                <li>
                                    A character has run a quest (solo or in a
                                    group) within 7 days of last being online
                                </li>
                                <li>
                                    A character has increased in level within 20
                                    days of last being online (level 32
                                    characters are excluded)
                                </li>
                            </ul>
                            <span className="lfm-number">
                                This is an art, not a science. If you have
                                suggestions for improving this algorithm,{" "}
                                <Link to="/suggestions">
                                    please let me know
                                </Link>
                                .
                            </span>
                        </span>
                    ),
                    icon: "info",
                    fullscreen: true,
                });
                break;
            case "filter banks characters":
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
                            {callback && (
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
                            )}
                        </span>
                    ),
                    icon: "info",
                    fullscreen: true,
                });
                break;
            case "primary class only":
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

    function getServerNamePossessive() {
        return `${currentServer}${currentServer === "Thelanis" ? "'" : "'s"}`;
    }

    const location = useLocation().pathname.substring(
        useLocation().pathname.lastIndexOf("/") + 1
    );
    var [currentServer, setCurrentServer] = React.useState(null);
    React.useEffect(() => {
        let serverName =
            location.substring(0, 1).toUpperCase() + location.substring(1);
        if (SERVER_NAMES.includes(serverName)) {
            // Good server
            setCurrentServer(serverName);
        } else {
            // Bad server
            setCurrentServer(SERVER_NAMES[0]); // Just default to the first server in the good list
        }
    }, [window.location.pathname]);

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

    const [serverStatus, setServerStatus] = React.useState(null);
    const [serverData, setServerData] = React.useState(null);
    const [uniqueData, setUniqueData] = React.useState(null);
    const [currentData, setCurrentData] = React.useState(null);
    function refreshServerStatus() {
        if (currentServer === null) return;
        Fetch("https://api.ddoaudit.com/gamestatus/serverstatus", 5000)
            .then((val) => {
                setPopupMessage(null);
                if (
                    val?.Worlds?.filter(
                        (world) => world.Name === currentServer
                    )?.[0]?.Status === 1
                ) {
                    setServerStatus(true);
                    Fetch(
                        `https://api.ddoaudit.com/players/${currentServer.toLowerCase()}`,
                        5000
                    ).then((serverVal) => {
                        setServerData(serverVal);
                    });
                } else {
                    setServerStatus(false);
                    setServerData(null);
                }
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

    function fetchUniqueData() {
        Fetch("https://api.ddoaudit.com/population/uniquedata", 5000)
            .then((val) => {
                setUniqueData(val);
            })
            .catch(() => {
                setPopupMessage({
                    title: "Couldn't Fetch Unique Data",
                    message:
                        "We weren't able to find information on this server. You can refresh the page or report the issue.",
                    icon: "warning",
                    fullscreen: false,
                    reportMessage: "Could not fetch unique data. Timeout",
                });
            });
    }

    function fetchCurrentData() {
        Fetch("https://api.ddoaudit.com/gamestatus/populationoverview", 5000)
            .then((val) => {
                setCurrentData(val);
            })
            .catch(() => {
                setPopupMessage({
                    title: "Couldn't Fetch Current Data",
                    message:
                        "We weren't able to find information on this server. You can refresh the page or report the issue.",
                    icon: "warning",
                    fullscreen: false,
                    reportMessage: "Could not fetch unique data. Timeout",
                });
            });
    }

    function fetchPopulationData() {
        Fetch("https://api.ddoaudit.com/population/year", 5000).then((val) => {
            setPopulation1Year(val);
        });

        Fetch("https://api.ddoaudit.com/population/quarter", 5000).then(
            (val) => {
                setPopulation1Quarter(val);
            }
        );

        Fetch(
            "https://api.ddoaudit.com/population/dailydistribution_groups",
            5000
        ).then((val) => {
            setDailyLfmDistribution(val);
        });

        Fetch(
            "https://api.ddoaudit.com/population/hourlydistribution_groups",
            5000
        ).then((val) => {
            setHourlyLfmDistribution(val);
        });
    }

    React.useEffect(() => {
        const interval = setInterval(() => refreshServerStatus, 60000);
        if (currentServer !== null) {
            refreshServerStatus();
            fetchUniqueData();
            fetchCurrentData();
            fetchPopulationData();
        }
        return () => clearInterval(interval);
    }, [currentServer]);

    // Popup message
    var [popupMessage, setPopupMessage] = React.useState(null);

    function getServerNamePossessive() {
        return `${currentServer}${currentServer === "Thelanis" ? "'" : "'s"}`;
    }

    return (
        <div>
            <script type="application/ld+json">
                {JSON.stringify(getBreadcrumbs(currentServer))}
            </script>
            <Helmet>
                <title>{`${getServerNamePossessive()} ${TITLE}`} </title>
                <meta
                    name="description"
                    content={`${getServerNamePossessive()} server population, character demographics, content popularity, and long-term trends.`}
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
                title="Population, Demographics, and Trends"
                subtitle={currentServer}
            />
            <PopupMessage
                page={"servers/" + currentServer}
                message={popupMessage}
                popMessage={() => {
                    setPopupMessage(null);
                }}
            />
            <div className="content-container">
                <BannerMessage page={"servers"} />
                <div className="top-content-padding shrink-on-mobile" />
                <ContentCluster
                    title={`${currentServer} Population`}
                    altTitle="Population"
                    description={
                        serverData &&
                        currentServer &&
                        currentData &&
                        hourlyLfmDistribution &&
                        uniqueData ? (
                            <>
                                <CurrentCountsSubtitle
                                    serverData={serverData}
                                    server={currentServer}
                                    data={currentData}
                                    hourlyLfmDistribution={
                                        hourlyLfmDistribution
                                    }
                                />
                                <UniqueCountsSubtitle
                                    server={currentServer}
                                    data={uniqueData}
                                    readAbout={(m) => readAbout(m)}
                                />
                            </>
                        ) : serverStatus !== false ? (
                            <span>Loading all sorts of fun data...</span>
                        ) : (
                            <span>
                                This server is offline. Check back later.
                            </span>
                        )
                    }
                />
                <ContentCluster
                    title="Hourly LFM Activity"
                    description="Average LFM count for each hour of the day. Data is from the last quarter."
                >
                    <ChartLine
                        keys={null}
                        indexBy={null}
                        legendBottom="Time of day (EST)"
                        legendLeft="LFM Count"
                        data={
                            hourlyLfmDistribution &&
                            hourlyLfmDistribution.filter(
                                (series) => series.id === currentServer
                            )
                        }
                        noAnim={true}
                        title="Distribution"
                        markedEvents={timeNowEvent}
                        markedEventsType="numeric"
                        marginBottom={60}
                        trendType=""
                        noArea={false}
                        straightLegend={true}
                        tooltipPrefix="Hour"
                        forceHardcore={true}
                    />
                </ContentCluster>
                <ContentCluster
                    title="Daily LFM Activity"
                    description="Average LFM count for each day of the week. Data is from the last quarter."
                >
                    <ChartBar
                        keys={[
                            ...SERVER_NAMES.filter(
                                (server) => server === currentServer
                            ),
                        ]}
                        indexBy="Day"
                        legendBottom="Day of Week"
                        legendLeft="LFM Count"
                        data={dailyLfmDistribution}
                        noAnim={true}
                        display="Grouped"
                        straightLegend={true}
                        legendOffset={40}
                        dataIncludesColors={true}
                        paddingBottom={60}
                        forceHardcore={true}
                    />
                </ContentCluster>
                <ContentCluster
                    title="Annual Population Data"
                    description={`The last two years of trend data for ${currentServer}. Weekly averages are shown. Server downtimes are ignored.`}
                >
                    <ChartLine
                        data={
                            population1Year &&
                            population1Year.filter(
                                (server) => server.id === currentServer
                            )
                        }
                        trendType="annual"
                        activeFilter="Server Activity"
                        showActions={false}
                        showLastUpdated={true}
                        reportReference={null}
                        showArea={true}
                        marginBottom={120}
                        height="460px"
                        forceHardcore={true}
                    />
                </ContentCluster>
                <ContentCluster
                    title="Quarterly Population Data"
                    description={`The last quarter (92 days) of trend data for ${currentServer}. Daily averages are shown. Server downtimes are ignored.`}
                >
                    <ChartLine
                        data={
                            population1Quarter &&
                            population1Quarter.filter(
                                (server) => server.id === currentServer
                            )
                        }
                        trendType="quarter"
                        activeFilter="Server Activity"
                        showActions={false}
                        showLastUpdated={true}
                        reportReference={null}
                        showArea={true}
                        marginBottom={120}
                        height="460px"
                        forceHardcore={true}
                    />
                </ContentCluster>
                <ContentCluster
                    title={`${currentServer} vs.${
                        currentServer === "Hardcore"
                            ? ".. Itself? I guess?"
                            : " Hardcore League"
                    }`}
                    description={`The last two years of trend data comparing ${getServerNamePossessive()} population to ${
                        currentServer === "Hardcore"
                            ? "itself. Very informative!"
                            : "Hardcore League."
                    } Weekly averages are shown. Server downtimes are ignored.`}
                >
                    <ChartLine
                        data={
                            population1Year &&
                            population1Year.filter(
                                (server) =>
                                    server.id === currentServer ||
                                    server.id === "Hardcore"
                            )
                        }
                        trendType="annual"
                        activeFilter="Server Activity"
                        showActions={false}
                        showLastUpdated={true}
                        reportReference={null}
                        marginBottom={120}
                        height="460px"
                        showArea={true}
                        areaOpacity={0.1}
                        forceHardcore={true}
                    />
                </ContentCluster>
            </div>
        </div>
    );
};

export default ServersSpecific;
