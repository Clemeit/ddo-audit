import * as React from "react";
import { Helmet } from "react-helmet";
import { connect } from "react-redux";
import Card from "./old_Card";
import PlayerAndLfmSubtitle from "./live/PlayerAndLfmSubtitle";
import QuickInfo from "../live/QuickInfo";
import WhatIsCard from "./WhatIsCard";
import ReportIssueForm from "./ReportIssueForm";
import ChartLine from "../global/ChartLine";
import PopupMessage from "./global/PopupMessage";

const TITLE = "DDO Audit";

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

const Home = (props) => {
    const [population24HoursData, set_population24HoursData] =
        React.useState(null);
    const [population1WeekData, set_population1WeekData] = React.useState(null);
    const [population1QuarterData, set_population1QuarterData] =
        React.useState(null);
    const [quickInfoData, set_quickInfoData] = React.useState(null);
    const [uniqueCountsData, set_uniqueCountsData] = React.useState(null);

    const [serverStatusData, set_serverStatusData] = React.useState(null); // Server status data

    function AppendToPopup(message) {
        set_popupMessages([...popupMessages, message]);
        console.log([...popupMessages, message].length);
    }

    React.useEffect(() => {
        async function fetchArbitraryData(url, type) {
            let response = await fetch(url);
            if (type === "json") response = await response.json();
            else if (type === "text") response = await response.text();
            return response;
        }

        fetchArbitraryData(
            "https://api.npafrequency.xyz/population/day",
            "json"
        )
            .then((val) => {
                set_population24HoursData(val);
            })
            .catch((error) => {
                AppendToPopup({
                    title: "Data failed to load",
                    message: "Some of the data on this page failed to load.",
                    icon: "warning",
                    fullscreen: false,
                });
            });

        fetchArbitraryData(
            "https://api.npafrequency.xyz/population/week",
            "json"
        ).then((val) => {
            set_population1WeekData(val);
        });

        fetchArbitraryData(
            "https://api.npafrequency.xyz/population/quarter",
            "json"
        ).then((val) => {
            set_population1QuarterData(val);
        });

        fetchArbitraryData(
            "https://www.playeraudit.com/api/quickinfo",
            "json"
        ).then((val) => {
            set_quickInfoData(val);
        });

        fetchArbitraryData(
            "https://www.playeraudit.com/api/uniquedata",
            "json"
        ).then((val) => {
            set_uniqueCountsData(val);
        });

        // Fetch server status
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
    }, []);

    var [chart24Hoursfilter, set_chart24Hoursfilter] =
        React.useState("Server Activity");
    var [chart1WeekFilter, set_chart1WeekFilter] =
        React.useState("Server Activity");
    var [chart1QuarterFilter, set_chart1QuarterFilter] =
        React.useState("Server Activity");

    var [reportFormVisibility, set_reportFormVisibility] =
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
        set_reportFormVisibility("block");
    }

    function hideReportForm() {
        set_reportFormVisibility("none");
    }

    function Filter24HourChart(type) {
        set_chart24Hoursfilter(type);
    }

    function Filter1WeekChart(type) {
        set_chart1WeekFilter(type);
    }

    function Filter1QuarterChart(type) {
        set_chart1QuarterFilter(type);
    }

    // Popup message
    var [popupMessages, set_popupMessages] = React.useState([]);

    // First visit to the site?
    React.useEffect(() => {
        // if (!("serviceWorker" in navigator)) {
        //     // Service Worker isn't supported on this browser, disable or hide UI.
        //     console.log("No push!");
        //     return;
        // }

        // if (!("PushManager" in window)) {
        //     // Push isn't supported on this browser, disable or hide UI.
        //     console.log("No push!");
        //     return;
        // }

        // const publicVapidKey =
        //     "BLHgHfWx0GfeaHhiMFzYj3Q4qDcSYAV65jrCaNgArov7d5PsT3t_MYLIqmtxCcSsd-9pOEslxOZulKc7sMgc0tY";

        // const subscription =
        //     await navigator.serviceWorker.controller.pushManager.subscribe({
        //         userVisibleOnly: true,
        //         applicationServerKey: urlBase64ToUint8Array(publicVapidKey),
        //     });

        // await fetch("/subscribe", {
        //     method: "POST",
        //     body: JSON.stringify(subsrciption),
        //     headers: {
        //         "content-type": "application/json",
        //     },
        // });

        // function registerServiceWorker() {
        //     return navigator.serviceWorker
        //         .register("/service-worker.js")
        //         .then(function (registration) {
        //             console.log("Service worker successfully registered.");
        //             return registration;
        //         })
        //         .catch(function (err) {
        //             console.error("Unable to register service worker.", err);
        //         });
        // }

        // registerServiceWorker();

        // function askPermission() {
        //     return new Promise(function (resolve, reject) {
        //         const permissionResult = Notification.requestPermission(
        //             function (result) {
        //                 resolve(result);
        //             }
        //         );

        //         if (permissionResult) {
        //             permissionResult.then(resolve, reject);
        //         }
        //     }).then(function (permissionResult) {
        //         if (permissionResult !== "granted") {
        //             console.log("We weren't granted permission.");
        //         } else {
        //             subscribeUserToPush();
        //         }
        //     });
        // }

        // askPermission();

        function urlBase64ToUint8Array(base64String) {
            var padding = "=".repeat((4 - (base64String.length % 4)) % 4);
            var base64 = (base64String + padding)
                .replace(/\-/g, "+")
                .replace(/_/g, "/");

            var rawData = window.atob(base64);
            var outputArray = new Uint8Array(rawData.length);

            for (var i = 0; i < rawData.length; ++i) {
                outputArray[i] = rawData.charCodeAt(i);
            }
            return outputArray;
        }
        // function subscribeUserToPush() {
        //     return navigator.serviceWorker
        //         .register("/service-worker.js")
        //         .then(function (registration) {
        //             const subscribeOptions = {
        //                 userVisibleOnly: true,
        //                 applicationServerKey: urlBase64ToUint8Array(
        //                     "BEl62iUYgUivxIkv69yViEuiBIa-Ib9-SkvMeAtA3LFgDzkrxZJjSgSnfckjBJuBkr3qBUYIHBQFLXYp5Nksh8U"
        //                 ),
        //             };

        //             return registration.pushManager.subscribe(subscribeOptions);
        //         })
        //         .then(function (pushSubscription) {
        //             console.log(
        //                 "Received PushSubscription: ",
        //                 JSON.stringify(pushSubscription)
        //             );
        //             return pushSubscription;
        //         });
        // }
    }, []);

    // React.useState(() => {
    //     setTimeout(() => {
    //         // Do some cookie check!
    //         AppendToPopup({
    //             title: "New Website!",
    //             message: (
    //                 <div style={{ fontSize: "larger" }}>
    //                     <p>
    //                         DDO Audit has been completely rebuilt to improve
    //                         responsiveness and offer additional functionality!
    //                     </p>
    //                     <h3
    //                         style={{
    //                             marginBottom: "5px",
    //                         }}
    //                     >
    //                         Experiencing an issue?
    //                     </h3>
    //                     <p
    //                         style={{
    //                             marginLeft: "10px",
    //                         }}
    //                     >
    //                         Report it with the{" "}
    //                         <span
    //                             className="blue-link chart-action-bar-item"
    //                             style={{ padding: "0px" }}
    //                         >
    //                             Report a problem
    //                         </span>{" "}
    //                         link located under each graph.
    //                     </p>
    //                     <h3
    //                         style={{
    //                             marginBottom: "5px",
    //                         }}
    //                     >
    //                         Comments or suggestions for new features?
    //                     </h3>
    //                     <p
    //                         style={{
    //                             marginBottom: "0px",
    //                             marginLeft: "10px",
    //                         }}
    //                     >
    //                         Contact me!
    //                     </p>
    //                     <ul>
    //                         <li>Discord: Clemeit#7994</li>
    //                         <li>Twitter: @DDOAudit</li>
    //                         <li>DDO Forums: Clemeit</li>
    //                     </ul>
    //                 </div>
    //             ),
    //             icon: "info",
    //             fullscreen: true,
    //         });
    //     }, 2000);
    // }, []);

    return (
        <div>
            <Helmet>
                <title>{TITLE}</title>
                <meta
                    name="description"
                    content="A live summary of DDO's current player population and LFM status. View population trends, check server status, browse live grouping panels, and see what server is best for you!"
                />
            </Helmet>
            <ReportIssueForm
                page="home"
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
            <WhatIsCard className="on-home" />
            <div className="home-card-splitter">
                <QuickInfo
                    className="card home-card-splitter-pane1"
                    data={quickInfoData}
                    unique={uniqueCountsData}
                />
                <Card
                    pageName=""
                    showLink={true}
                    className="home-card-splitter-pane2"
                    title="Currently on Dungeons and Dragons Online"
                    subtitle={
                        <PlayerAndLfmSubtitle
                            data={population24HoursData}
                            server="Total"
                        />
                    }
                    tiles={[
                        {
                            title: "Players and LFMs by Minute - All Servers",
                            description: (
                                <div className="tile-description">
                                    <p>
                                        A 24-hour rolling window of the total
                                        {chart24Hoursfilter === "Composite"
                                            ? " population of each server"
                                            : " game population"}
                                        .
                                    </p>
                                </div>
                            ),
                            content: (
                                <ChartLine
                                    data={population24HoursData}
                                    trendType="day"
                                    activeFilter={chart24Hoursfilter}
                                    filters={[
                                        {
                                            name: "Filter",
                                            reference: Filter24HourChart,
                                            options: [
                                                "Server Activity",
                                                "Combined Activity",
                                            ],
                                            index: 0,
                                        },
                                    ]}
                                    showActions={true}
                                    showLastUpdated={true}
                                    reportReference={showReportForm}
                                />
                            ),
                        },
                    ]}
                />
            </div>
            <Card
                pageName=""
                showLink={true}
                title="Recently on Dungeons and Dragons Online"
                subtitle=""
                tiles={[
                    {
                        title: "Players and LFMs by Hour - All Servers",
                        description: (
                            <div className="tile-description">
                                <p>
                                    A 1-week rolling window of the total
                                    {chart1WeekFilter === "Composite"
                                        ? " population of each server"
                                        : " game population"}
                                    .{" "}
                                    <span className="blue-text">
                                        Hourly averages
                                    </span>{" "}
                                    are displayed.
                                </p>
                            </div>
                        ),
                        content: (
                            <ChartLine
                                data={population1WeekData}
                                trendType="week"
                                activeFilter={chart1WeekFilter}
                                filters={[
                                    {
                                        name: "Filter",
                                        reference: Filter1WeekChart,
                                        options: [
                                            "Server Activity",
                                            "Combined Activity",
                                        ],
                                        index: 0,
                                    },
                                ]}
                                showActions={true}
                                showLastUpdated={true}
                                reportReference={showReportForm}
                            />
                        ),
                    },
                    {
                        title: "Players and LFMs by Day - All Servers",
                        description: (
                            <div className="tile-description">
                                <p>
                                    A 90-day rolling window of the total
                                    {chart1QuarterFilter === "Composite"
                                        ? " population of each server"
                                        : " game population"}
                                    .{" "}
                                    <span className="blue-text">
                                        Daily averages
                                    </span>{" "}
                                    are displayed.
                                </p>
                            </div>
                        ),
                        content: (
                            <ChartLine
                                data={population1QuarterData}
                                trendType="quarter"
                                activeFilter={chart1QuarterFilter}
                                filters={[
                                    {
                                        name: "Filter",
                                        reference: Filter1QuarterChart,
                                        options: [
                                            "Server Activity",
                                            "Combined Activity",
                                        ],
                                        index: 0,
                                    },
                                ]}
                                showActions={true}
                                showLastUpdated={true}
                                reportReference={showReportForm}
                            />
                        ),
                    },
                ]}
            />
        </div>
    );
};

export default connect()(Home);
