import React from "react";
import { Helmet } from "react-helmet";
import Card from "../components/Card";
import ReportIssueForm from "./ReportIssueForm";
import { useLocation } from "react-router-dom";
import UniqueCountsSubtitle from "./UniqueCountsSubtitle";
import ServerDemographicsContainer from "./ServerDemographicsContainer";
import PopupMessage from "./PopupMessage";
import PlayerAndLfmSubtitle from "./PlayerAndLfmSubtitle";
import ChartPopulationHistory from "./ChartPopulationHistory";
import ContentTable from "./ContentTable";

const TITLE = "DDO Server Status";

const serverNames = [
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

const ServerSpecific = (props) => {
    // Data
    var [serverStatusData, set_serverStatusData] = React.useState(null);
    var [currentServer, set_currentServer] = React.useState(null);
    var [genderData, set_genderData] = React.useState(null);
    var [guildData, set_guildData] = React.useState(null);
    var [activityData, set_activityData] = React.useState(null);
    var [raceData, set_raceData] = React.useState(null);
    var [classData, set_classData] = React.useState(null);
    var [uniqueData, set_uniqueData] = React.useState(null);
    const [population24HoursData, set_population24HoursData] =
        React.useState(null);
    const [population1WeekData, set_population1WeekData] = React.useState(null);
    const [population1QuarterData, set_population1QuarterData] =
        React.useState(null);
    const [contentData, set_contentData] = React.useState(null);

    // Filters
    var [demographicsFilter, set_demographicsFilter] =
        React.useState("All Players");
    var [contentFilter, set_contentFilter] = React.useState("Active Players");
    var [contentOrder, set_contentOrder] = React.useState("Most Popular");

    const location = useLocation().pathname.substring(
        useLocation().pathname.lastIndexOf("/") + 1
    );

    function filterDemographics(type) {
        set_demographicsFilter(type);
    }

    React.useEffect(() => {
        let serverName =
            location.substring(0, 1).toUpperCase() + location.substring(1);
        if (serverNames.includes(serverName)) {
            // Good server
            set_currentServer(serverName);
        } else {
            // Bad server
            set_currentServer(serverNames[0]); // Just default to the first server in the good list
        }
    }, [props.location]);

    function FilterContentTable(type) {
        async function fetchArbitraryData(url, type) {
            let response = await fetch(url);
            if (type === "json") response = await response.json();
            else if (type === "text") response = await response.text();
            return response;
        }

        if (
            type === "By Adventure Pack" &&
            contentFilter !== "By Adventure Pack"
        ) {
            fetchArbitraryData(
                "https://www.playeraudit.com/api/compendiumcount?s=adventurepacks",
                "json"
            ).then((val) => {
                set_contentData(val);
                set_contentFilter(type);
            });
        } else if (
            type !== "By Adventure Pack" &&
            contentFilter === "By Adventure Pack"
        ) {
            fetchArbitraryData(
                "https://www.playeraudit.com/api/compendiumcount?s=" +
                    currentServer,
                "json"
            ).then((val) => {
                set_contentData(val);
                set_contentFilter(type);
            });
        } else {
            set_contentFilter(type);
        }
    }

    function OrderContentTable(type) {
        set_contentOrder(type);
    }

    React.useEffect(() => {
        async function fetchArbitraryData(url, type) {
            let response = await fetch(url);
            if (type === "json") response = await response.json();
            else if (type === "text") response = await response.text();
            return response;
        }

        fetchArbitraryData(
            "https://www.playeraudit.com/api/serverstatus",
            "json"
        ).then((val) => {
            set_serverStatusData(val);
            // Display the appropriate server status message
            if (!val.hasOwnProperty("Worlds")) {
                set_popupMessages([
                    ...popupMessages,
                    {
                        title: "Something went wrong!",
                        message:
                            "The server list is missing. We're not sure if the servers are online or not. You'll have to login and check.",
                        icon: "error",
                    },
                ]);
            } else {
                let offlineWorlds = [];
                if (val.Worlds === null) {
                    offlineWorlds.push(...serverNames);
                } else {
                    val.Worlds.forEach(function (World) {
                        if (!World.hasOwnProperty("Status")) {
                            // Status is missing from this World
                        } else if (World.Status === 0) {
                            // This World is offline
                            offlineWorlds.push(World.Name);
                        }
                    });
                }
                if (offlineWorlds.length >= 8) {
                    set_popupMessages([
                        ...popupMessages,
                        {
                            messageType: "all servers offline",
                        },
                    ]);
                } else if (offlineWorlds.length > 1) {
                    set_popupMessages([
                        ...popupMessages,
                        {
                            messageType: "some servers offline",
                        },
                    ]);
                } else if (offlineWorlds.length === 1) {
                    if (offlineWorlds[0] === "Hardcore") {
                        // Only Hardcore is down
                    } else {
                        set_popupMessages([
                            ...popupMessages,
                            {
                                title: offlineWorlds[0] + " Offline",
                                message:
                                    offlineWorlds[0] +
                                    " appears to be temporarily offline.",
                                icon: "info",
                                fullscreen: false,
                            },
                        ]);
                    }
                } else {
                    // set_popupMessages([
                    //     ...popupMessages,
                    //     {
                    //         messageType: "all servers online",
                    //     },
                    // ]);
                }
            }
        });

        fetchArbitraryData(
            "https://www.playeraudit.com/api/genderdistribution",
            "json"
        ).then((val) => {
            set_genderData(val);
        });

        fetchArbitraryData(
            "https://www.playeraudit.com/api/racedistribution",
            "json"
        ).then((val) => {
            set_raceData(val);
        });

        fetchArbitraryData(
            "https://www.playeraudit.com/api/guildaffiliationdistribution",
            "json"
        ).then((val) => {
            set_guildData(val);
        });

        fetchArbitraryData(
            "https://www.playeraudit.com/api/activitydistribution",
            "json"
        ).then((val) => {
            set_activityData(val);
        });

        fetchArbitraryData(
            "https://www.playeraudit.com/api/classdistributionpie",
            "json"
        ).then((val) => {
            set_classData(val);
        });

        fetchArbitraryData(
            "https://www.playeraudit.com/api/uniquedata",
            "json"
        ).then((val) => {
            set_uniqueData(val);
        });

        fetchArbitraryData(
            "http://localhost:3001/api/v1/population/day",
            "json"
        ).then((val) => {
            set_population24HoursData(val);
        });

        fetchArbitraryData(
            "http://localhost:3001/api/v1/population/week",
            "json"
        ).then((val) => {
            set_population1WeekData(val);
        });

        fetchArbitraryData(
            "http://localhost:3001/api/v1/population/quarter",
            "json"
        ).then((val) => {
            set_population1QuarterData(val);
        });

        // fetchArbitraryData(
        //     "https://www.playeraudit.com/api/compendiumcount?s=" +
        //         currentServer,
        //     "json"
        // ).then((val) => {
        //     set_contentData(val);
        // });
    }, []);

    React.useEffect(() => {
        if (!currentServer) return;
        async function fetchArbitraryData(url, type) {
            let response = await fetch(url);
            if (type === "json") response = await response.json();
            else if (type === "text") response = await response.text();
            return response;
        }

        setTimeout(
            () =>
                fetchArbitraryData(
                    "https://www.playeraudit.com/api/compendiumcount?s=" +
                        currentServer,
                    "json"
                ).then((val) => {
                    set_contentData(val);
                }),
            1000
        );
    }, [currentServer]);

    // Report Form
    var [reportFormVisibility, setReportFormVisibility] =
        React.useState("none");
    var [reportFormReference, setReportFormReference] = React.useState(null);
    function showReportForm(reference) {
        // Grab relevant info from the tile element that's being reported
        let referenceInfo = {
            title: reference.title,
            type: reference.chartType,
            displayType: reference.displayType,
            trendType: reference.trendType,
            showActions: reference.showActions,
            //data: reference.chartData,
        };
        // Show the report form
        setReportFormReference(referenceInfo);
        setReportFormVisibility("block");
    }
    function hideReportForm() {
        setReportFormVisibility("none");
    }

    // Popup message
    var [popupMessages, set_popupMessages] = React.useState([]);

    return (
        currentServer && (
            <div>
                <Helmet>
                    <title>{TITLE}</title>
                    <meta
                        name="description"
                        content="Check server status, browse live server reports, view a detailed population demographics by server, and decide which server best fits your time zone."
                    />
                </Helmet>
                <ReportIssueForm
                    page={"servers/" + currentServer.toLowerCase()}
                    showLink={false}
                    visibility={reportFormVisibility}
                    componentReference={reportFormReference}
                    hideReportForm={hideReportForm}
                />
                <PopupMessage
                    messages={popupMessages}
                    popMessage={() => {
                        if (popupMessages.length) {
                            let newMessages = [...popupMessages];
                            newMessages = newMessages.slice(1);
                            set_popupMessages(newMessages);
                        }
                    }}
                />
                <Card
                    pageName={"servers/" + currentServer.toLowerCase()}
                    serverName={currentServer}
                    showLink={true}
                    title={"Demographics of " + currentServer}
                    subtitle={
                        <UniqueCountsSubtitle
                            data={uniqueData}
                            server={currentServer}
                        />
                    }
                    tiles={[
                        {
                            title: "Player Demographics",
                            description: (
                                <p>
                                    The last quarter of{" "}
                                    <span className="blue-text">
                                        {demographicsFilter.toLowerCase()}
                                    </span>{" "}
                                    by gender, class, race, and guild
                                    affiliation.
                                </p>
                            ),
                            content: (
                                <ServerDemographicsContainer
                                    filter={demographicsFilter}
                                    filters={[
                                        {
                                            name: "Filter",
                                            reference: filterDemographics,
                                            options: [
                                                "All Players",
                                                "Active Players",
                                                "Inactive Players",
                                                "End-game Players",
                                            ],
                                            index: 0,
                                        },
                                    ]}
                                    server={currentServer}
                                    genderData={genderData}
                                    guildData={guildData}
                                    activityData={activityData}
                                    raceData={raceData}
                                    classData={classData}
                                    showActions={true}
                                    showLastUpdated={false}
                                    reportReference={showReportForm}
                                />
                            ),
                        },
                        {
                            title: "Most Popular Content",
                            description: (
                                <p>
                                    The most commonly-played quests on{" "}
                                    {currentServer} for the last 30 days.
                                    <br />
                                    Click on a quest to see recent popularity
                                    history.
                                </p>
                            ),
                            content: (
                                <ContentTable
                                    data={contentData}
                                    activeFilter={contentFilter}
                                    activeOrder={contentOrder}
                                    filters={[
                                        {
                                            name: "Filter",
                                            reference: FilterContentTable,
                                            options: [
                                                "All Content",
                                                "Raids Only",
                                                "Free to Play",
                                            ],
                                            index: 0,
                                        },
                                        {
                                            name: "Order By",
                                            reference: OrderContentTable,
                                            options: [
                                                "Most Popular",
                                                "Least Popular",
                                            ],
                                            index: 0,
                                        },
                                    ]}
                                    showServerFilters={false}
                                    specificServer={currentServer}
                                    showActions={true}
                                    showLastUpdated={false}
                                    reportReference={showReportForm}
                                />
                            ),
                        },
                    ]}
                />
                <Card
                    serverName={currentServer}
                    pageName={"servers/" + currentServer.toLowerCase()}
                    showLink={true}
                    title={"Currently on " + currentServer}
                    subtitle={
                        <PlayerAndLfmSubtitle
                            data={population24HoursData}
                            server={currentServer}
                        />
                    }
                    tiles={[
                        {
                            title: "Players and LFMs by Minute - All Servers",
                            description: (
                                <div className="tile-description">
                                    <p>
                                        A 24-hour rolling window of the total
                                        players on {currentServer}.
                                    </p>
                                </div>
                            ),
                            content: (
                                <ChartPopulationHistory
                                    data={population24HoursData}
                                    activeFilter={currentServer}
                                    trendType="day"
                                    showActions={true}
                                    showLastUpdated={true}
                                    reportReference={showReportForm}
                                />
                            ),
                        },
                    ]}
                />
                <Card
                    serverName={currentServer}
                    pageName={"servers/" + currentServer.toLowerCase()}
                    showLink={true}
                    title={"Recently on " + currentServer}
                    subtitle=""
                    tiles={[
                        {
                            title: "Players by Hour on " + currentServer,
                            description: (
                                <div className="tile-description">
                                    <p>
                                        A 1-week rolling window of the total
                                        players on {currentServer}.{" "}
                                        <span className="blue-text">
                                            Hourly averages
                                        </span>{" "}
                                        are displayed.
                                    </p>
                                </div>
                            ),
                            content: (
                                <ChartPopulationHistory
                                    data={population1WeekData}
                                    trendType="week"
                                    activeFilter={currentServer}
                                    showActions={true}
                                    showLastUpdated={true}
                                    reportReference={showReportForm}
                                />
                            ),
                        },
                        {
                            title: "Players by Day on " + currentServer,
                            description: (
                                <div className="tile-description">
                                    <p>
                                        A 90-day rolling window of the total
                                        players on {currentServer}.{" "}
                                        <span className="blue-text">
                                            Daily averages
                                        </span>{" "}
                                        are displayed.
                                    </p>
                                </div>
                            ),
                            content: (
                                <ChartPopulationHistory
                                    data={population1QuarterData}
                                    trendType="quarter"
                                    activeFilter={currentServer}
                                    showActions={true}
                                    showLastUpdated={true}
                                    reportReference={showReportForm}
                                />
                            ),
                        },
                    ]}
                />
            </div>
        )
    );
};

export default ServerSpecific;
