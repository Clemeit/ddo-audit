// import * as React from "react";
// import { Helmet } from "react-helmet";
// import Card from "../components/Card";
// import ReportIssueForm from "./ReportIssueForm";
// import ChartServerDistributionPie from "./ChartServerDistributionPie";
// import ChartTimeOfDay from "./ChartTimeOfDay";
// import ChartDayOfWeek from "./ChartDayOfWeek";
// import ChartClassDistribution from "./ChartClassDistribution";
// import ChartLevelDistribution from "./ChartLevelDistribution";
// import ServerStatusDisplay from "./servers/ServerStatusDisplay";
// import ContentTable from "./ContentTable";
// import PopupMessage from "./PopupMessage";

// const TITLE = "DDO Server Status";

// const serverNames = [
//     "Argonnessen",
//     "Cannith",
//     "Ghallanda",
//     "Khyber",
//     "Orien",
//     "Sarlona",
//     "Thelanis",
//     "Wayfinder",
//     "Hardcore",
// ];

// const Servers = (props) => {
//     React.useEffect(() => {
//         const interval = setInterval(() => {
//             async function fetchArbitraryData(url, type) {
//                 let response = await fetch(url);
//                 if (type === "json") response = await response.json();
//                 else if (type === "text") response = await response.text();
//                 return response;
//             }

//             fetchArbitraryData(
//                 "https://www.playeraudit.com/api/serverstatus",
//                 "json"
//             ).then((val) => {
//                 set_serverStatusData(val);
//             });
//         }, 60000);
//         return () => clearInterval(interval);
//     }, []);

//     // Data states
//     const [serverStatusData, set_serverStatusData] = React.useState(null);
//     const [serverDistributionPieData, set_serverDistributionPieData] =
//         React.useState(null);
//     const [timeOfDayData, set_timeOfDayData] = React.useState(null);
//     const [dayOfWeekData, set_dayOfWeekData] = React.useState(null);
//     const [classDistributionData, set_classDistributionData] =
//         React.useState(null);
//     const [levelDistributionData, set_levelDistributionData] =
//         React.useState(null);
//     const [contentLevelDistributionData, set_contentLevelDistributionData] =
//         React.useState(null);
//     const [contentData, set_contentData] = React.useState(null);

//     // Filter states
//     var [serverDistributionPieHistory, set_serverDistributionPieHistory] =
//         React.useState("1 Week");
//     var [timeOfDayHistory, set_timeOfDayHistory] = React.useState("1 Week");
//     var [dayOfWeekHistory, set_dayOfWeekHistory] = React.useState("1 Week");
//     var [classDistributionFilter, set_classDistributionFilter] =
//         React.useState("Active Players");
//     var [levelDistributionFilter, set_levelDistributionFilter] =
//         React.useState("Active Players");
//     var [contentFilter, set_contentFilter] = React.useState("Active Players");
//     var [contentOrder, set_contentOrder] = React.useState("Most Popular");

//     // Display states
//     var [dayOfWeekDisplay, set_dayOfWeekDisplay] = React.useState("Grouped");
//     var [classDistributionDisplay, set_classDistributionDisplay] =
//         React.useState("Grouped");

//     function DisplayDayOfWeek(type) {
//         set_dayOfWeekDisplay(type);
//     }

//     function DisplayClassDistribution(type) {
//         set_classDistributionDisplay(type);
//     }

//     function FilterClassDistribution(type) {
//         set_classDistributionFilter(type);

//         async function fetchArbitraryData(url, type) {
//             let response = await fetch(url);
//             if (type === "json") response = await response.json();
//             else if (type === "text") response = await response.text();
//             return response;
//         }

//         fetchArbitraryData(
//             type === "Active Players"
//                 ? "https://www.playeraudit.com/api/classdistribution?filter=active"
//                 : type === "Inactive Players"
//                 ? "https://www.playeraudit.com/api/classdistribution?filter=inactive"
//                 : type === "End-game Players"
//                 ? "https://www.playeraudit.com/api/classdistribution?filter=endgame"
//                 : "https://www.playeraudit.com/api/classdistribution",
//             "json"
//         ).then((val) => {
//             set_classDistributionData(val);
//         });
//     }

//     function FilterLevelDistribution(type) {
//         set_levelDistributionFilter(type);

//         async function fetchArbitraryData(url, type) {
//             let response = await fetch(url);
//             if (type === "json") response = await response.json();
//             else if (type === "text") response = await response.text();
//             return response;
//         }

//         fetchArbitraryData(
//             type === "Active Players"
//                 ? "https://www.playeraudit.com/api/leveldistribution?filter=active"
//                 : type === "Inactive Players"
//                 ? "https://www.playeraudit.com/api/leveldistribution?filter=inactive"
//                 : "https://www.playeraudit.com/api/leveldistribution",
//             "json"
//         ).then((val) => {
//             set_levelDistributionData(val);
//         });
//     }

//     function FilterContentTable(type) {
//         async function fetchArbitraryData(url, type) {
//             let response = await fetch(url);
//             if (type === "json") response = await response.json();
//             else if (type === "text") response = await response.text();
//             return response;
//         }

//         if (
//             type === "By Adventure Pack" &&
//             contentFilter !== "By Adventure Pack"
//         ) {
//             fetchArbitraryData(
//                 "https://www.playeraudit.com/api/compendiumcount?s=adventurepacks",
//                 "json"
//             ).then((val) => {
//                 set_contentData(val);
//                 set_contentFilter(type);
//             });
//         } else if (
//             type !== "By Adventure Pack" &&
//             contentFilter === "By Adventure Pack"
//         ) {
//             fetchArbitraryData(
//                 "https://www.playeraudit.com/api/compendiumcount",
//                 "json"
//             ).then((val) => {
//                 set_contentData(val);
//                 set_contentFilter(type);
//             });
//         } else {
//             set_contentFilter(type);
//         }
//     }

//     function OrderContentTable(type) {
//         set_contentOrder(type);
//     }

//     function FilterContentTableGranular(servers) {
//         if (contentFilter === "By Adventure Pack") {
//             return;
//         }
//         let serverString = "";
//         for (let i = 0; i < servers.length; i++) {
//             if (servers[i]) {
//                 serverString += serverNames[i].toLowerCase() + ",";
//             }
//         }
//         if (serverString) {
//             serverString = serverString.substring(0, serverString.length - 1);
//         }

//         async function fetchArbitraryData(url, type) {
//             let response = await fetch(url);
//             if (type === "json") response = await response.json();
//             else if (type === "text") response = await response.text();
//             return response;
//         }

//         fetchArbitraryData(
//             "https://www.playeraudit.com/api/compendiumcount?s=" + serverString,
//             "json"
//         ).then((val) => {
//             set_contentData(val);
//         });
//     }

//     function HistoryPieByServer(type) {
//         set_serverDistributionPieHistory(type);

//         async function fetchArbitraryData(url, type) {
//             let response = await fetch(url);
//             if (type === "json") response = await response.json();
//             else if (type === "text") response = await response.text();
//             return response;
//         }

//         fetchArbitraryData(
//             type === "1 Week"
//                 ? "https://www.playeraudit.com/api/distribution_1w"
//                 : "https://www.playeraudit.com/api/distribution_1q",
//             "json"
//         ).then((val) => {
//             set_serverDistributionPieData(val);
//         });
//     }

//     function HistoryTimeOfDay(type) {
//         set_timeOfDayHistory(type);

//         async function fetchArbitraryData(url, type) {
//             let response = await fetch(url);
//             if (type === "json") response = await response.json();
//             else if (type === "text") response = await response.text();
//             return response;
//         }

//         fetchArbitraryData(
//             type === "1 Week"
//                 ? "https://www.playeraudit.com/api/timeofday_1w"
//                 : "https://www.playeraudit.com/api/timeofday_1q",
//             "json"
//         ).then((val) => {
//             set_timeOfDayData(val);
//         });
//     }

//     function HistoryDayOfWeek(type) {
//         set_dayOfWeekHistory(type);

//         async function fetchArbitraryData(url, type) {
//             let response = await fetch(url);
//             if (type === "json") response = await response.json();
//             else if (type === "text") response = await response.text();
//             return response;
//         }

//         fetchArbitraryData(
//             type === "1 Week"
//                 ? "https://www.playeraudit.com/api/dayofweek_1w"
//                 : "https://www.playeraudit.com/api/dayofweek_1q",
//             "json"
//         ).then((val) => {
//             set_dayOfWeekData(val);
//         });
//     }

//     // Fetch the data on page load
//     React.useEffect(() => {
//         async function fetchArbitraryData(url, type) {
//             let response = await fetch(url);
//             if (type === "json") response = await response.json();
//             else if (type === "text") response = await response.text();
//             return response;
//         }

//         fetchArbitraryData(
//             "https://www.playeraudit.com/api/serverstatus",
//             "json"
//         ).then((val) => {
//             set_serverStatusData(val);
//             // Display the appropriate server status message
//             if (!val.hasOwnProperty("Worlds")) {
//                 set_popupMessages([
//                     ...popupMessages,
//                     {
//                         title: "Something went wrong!",
//                         message:
//                             "The server list is missing. We're not sure if the servers are online or not. You'll have to login and check.",
//                         icon: "error",
//                     },
//                 ]);
//             } else {
//                 let offlineWorlds = [];
//                 if (val.Worlds === null) {
//                     offlineWorlds.push(...serverNames);
//                 } else {
//                     val.Worlds.forEach(function (World) {
//                         if (!World.hasOwnProperty("Status")) {
//                             // Status is missing from this World
//                         } else if (World.Status === 0) {
//                             // This World is offline
//                             offlineWorlds.push(World.Name);
//                         }
//                     });
//                 }
//                 if (offlineWorlds.length >= 8) {
//                     set_popupMessages([
//                         ...popupMessages,
//                         {
//                             messageType: "all servers offline",
//                         },
//                     ]);
//                 } else if (offlineWorlds.length > 1) {
//                     set_popupMessages([
//                         ...popupMessages,
//                         {
//                             messageType: "some servers offline",
//                         },
//                     ]);
//                 } else if (offlineWorlds.length === 1) {
//                     if (offlineWorlds[0] === "Hardcore") {
//                         // Only Hardcore is down
//                     } else {
//                         set_popupMessages([
//                             ...popupMessages,
//                             {
//                                 title: offlineWorlds[0] + " Offline",
//                                 message:
//                                     offlineWorlds[0] +
//                                     " appears to be temporarily offline.",
//                                 icon: "info",
//                                 fullscreen: false,
//                             },
//                         ]);
//                     }
//                 } else {
//                     // set_popupMessages([
//                     //     ...popupMessages,
//                     //     {
//                     //         messageType: "all servers online",
//                     //     },
//                     // ]);
//                 }
//             }
//         });

//         fetchArbitraryData(
//             "https://www.playeraudit.com/api/distribution_1w",
//             "json"
//         ).then((val) => {
//             set_serverDistributionPieData(val);
//         });

//         fetchArbitraryData(
//             "https://www.playeraudit.com/api/timeofday_1w",
//             "json"
//         ).then((val) => {
//             set_timeOfDayData(val);
//         });

//         fetchArbitraryData(
//             "https://www.playeraudit.com/api/dayofweek_1w",
//             "json"
//         ).then((val) => {
//             set_dayOfWeekData(val);
//         });

//         fetchArbitraryData(
//             "https://www.playeraudit.com/api/classdistribution?filter=active",
//             "json"
//         ).then((val) => {
//             set_classDistributionData(val);
//         });

//         fetchArbitraryData(
//             "https://www.playeraudit.com/api/leveldistribution?filter=active",
//             "json"
//         ).then((val) => {
//             set_levelDistributionData(val);
//         });

//         fetchArbitraryData(
//             "https://www.playeraudit.com/api/contentleveldistribution",
//             "json"
//         ).then((val) => {
//             set_contentLevelDistributionData(val);
//         });

//         fetchArbitraryData(
//             "https://www.playeraudit.com/api/compendiumcount",
//             "json"
//         ).then((val) => {
//             set_contentData(val);
//         });
//     }, []);

//     // Report Form
//     var [reportFormVisibility, setReportFormVisibility] =
//         React.useState("none");
//     var [reportFormReference, setReportFormReference] = React.useState(null);
//     function showReportForm(reference) {
//         // Grab relevant info from the tile element that's being reported
//         let referenceInfo = {
//             title: reference.title,
//             type: reference.chartType,
//             displayType: reference.displayType,
//             trendType: reference.trendType,
//             showActions: reference.showActions,
//             //data: reference.chartData,
//         };
//         // Show the report form
//         setReportFormReference(referenceInfo);
//         setReportFormVisibility("block");
//     }
//     function hideReportForm() {
//         setReportFormVisibility("none");
//     }

//     // Popup message
//     var [popupMessages, set_popupMessages] = React.useState([]);

//     return (
//         <div>
//             <Helmet>
//                 <title>{TITLE}</title>
//                 <meta
//                     name="description"
//                     content="Check server status, browse live server reports, view a detailed population demographics by server, and decide which server best fits your time zone."
//                 />
//             </Helmet>
//             <ReportIssueForm
//                 page="servers"
//                 showLink={false}
//                 visibility={reportFormVisibility}
//                 componentReference={reportFormReference}
//                 hideReportForm={hideReportForm}
//             />
//             <PopupMessage
//                 messages={popupMessages}
//                 popMessage={() => {
//                     if (popupMessages.length) {
//                         let newMessages = [...popupMessages];
//                         newMessages = newMessages.slice(1);
//                         set_popupMessages(newMessages);
//                     }
//                 }}
//             />
//             <Card pageName="servers" title="" subtitle="">
//                 <ServerStatusDisplay data={serverStatusData} />
//             </Card>
//             <Card
//                 pageName="servers"
//                 showLink={true}
//                 title="Who's Playing Where?"
//                 subtitle=""
//                 tiles={[
//                     {
//                         title: "Player Population by Server",
//                         description: (
//                             <p>
//                                 The last{" "}
//                                 {serverDistributionPieHistory === "1 Week"
//                                     ? "week"
//                                     : "quarter"}{" "}
//                                 averaged{" "}
//                                 <span className="blue-text">by server</span>.
//                                 Click on a server to see more detailed
//                                 information.
//                             </p>
//                         ),
//                         content: (
//                             <ChartServerDistributionPie
//                                 data={serverDistributionPieData}
//                                 filters={[
//                                     {
//                                         name: "History",
//                                         reference: HistoryPieByServer,
//                                         options: ["1 Week", "1 Quarter"],
//                                         index: 0,
//                                     },
//                                 ]}
//                                 showActions={true}
//                                 showLastUpdated={false}
//                                 reportReference={showReportForm}
//                             />
//                         ),
//                     },
//                 ]}
//             />
//             <Card
//                 pageName="servers"
//                 showLink={true}
//                 title="Who's Playing When?"
//                 subtitle=""
//                 tiles={[
//                     {
//                         title: "Time of Day",
//                         description: (
//                             <p>
//                                 The last{" "}
//                                 {timeOfDayHistory === "1 Week"
//                                     ? "week"
//                                     : "quarter"}{" "}
//                                 averaged by{" "}
//                                 <span className="blue-text">time-of-day</span>.
//                                 24-Hour format.
//                             </p>
//                         ),
//                         content: (
//                             <ChartTimeOfDay
//                                 data={timeOfDayData}
//                                 filters={[
//                                     {
//                                         name: "History",
//                                         reference: HistoryTimeOfDay,
//                                         options: ["1 Week", "1 Quarter"],
//                                         index: 0,
//                                     },
//                                 ]}
//                                 showActions={true}
//                                 showLastUpdated={false}
//                                 reportReference={showReportForm}
//                             />
//                         ),
//                     },
//                     {
//                         title: "Day of Week",
//                         description: (
//                             <p>
//                                 The last{" "}
//                                 {dayOfWeekHistory === "1 Week"
//                                     ? "week"
//                                     : "quarter"}{" "}
//                                 averaged by{" "}
//                                 <span className="blue-text">day-of-week</span>.
//                             </p>
//                         ),
//                         content: (
//                             <ChartDayOfWeek
//                                 display={dayOfWeekDisplay}
//                                 data={dayOfWeekData}
//                                 filters={[
//                                     {
//                                         name: "History",
//                                         reference: HistoryDayOfWeek,
//                                         options: ["1 Week", "1 Quarter"],
//                                         index: 0,
//                                     },
//                                     {
//                                         name: "Display",
//                                         reference: DisplayDayOfWeek,
//                                         options: ["Grouped", "Stacked"],
//                                         index: 0,
//                                     },
//                                 ]}
//                                 showActions={true}
//                                 showLastUpdated={false}
//                                 reportReference={showReportForm}
//                             />
//                         ),
//                     },
//                 ]}
//             />
//             <Card
//                 pageName="servers"
//                 showLink={true}
//                 title="Who's Playing What?"
//                 subtitle=""
//                 tiles={[
//                     {
//                         title: "Class Distribution",
//                         description: (
//                             <p>
//                                 The percentage of{" "}
//                                 {classDistributionFilter === "Active Players"
//                                     ? "active players"
//                                     : classDistributionFilter ===
//                                       "Inactive Players"
//                                     ? "inactive players"
//                                     : classDistributionFilter ===
//                                       "End-game Players"
//                                     ? "end-game players (level 28+)"
//                                     : "all players"}{" "}
//                                 running each class. This report counts{" "}
//                                 <span className="blue-text">
//                                     primary class only
//                                 </span>
//                                 . Normalized for population. Quarterly rolling
//                                 average.
//                             </p>
//                         ),
//                         content: (
//                             <ChartClassDistribution
//                                 display={classDistributionDisplay}
//                                 data={classDistributionData}
//                                 activeFilter={classDistributionFilter}
//                                 filters={[
//                                     {
//                                         name: "Filter",
//                                         reference: FilterClassDistribution,
//                                         options: [
//                                             "All Players",
//                                             "Active Players",
//                                             "Inactive Players",
//                                             "End-game Players",
//                                         ],
//                                         index: 1,
//                                     },
//                                     {
//                                         name: "Display",
//                                         reference: DisplayClassDistribution,
//                                         options: ["Grouped", "Stacked"],
//                                         index: 0,
//                                     },
//                                 ]}
//                                 showActions={true}
//                                 showLastUpdated={false}
//                                 reportReference={showReportForm}
//                             />
//                         ),
//                     },
//                     {
//                         title: "Character Level Distribution",
//                         description: (
//                             <p>
//                                 The percentage of{" "}
//                                 {levelDistributionFilter === "Active Players"
//                                     ? "active players"
//                                     : levelDistributionFilter ===
//                                       "Inactive Players"
//                                     ? "inactive players"
//                                     : levelDistributionFilter ===
//                                       "End-game Players"
//                                     ? "end-game players (level 28+)"
//                                     : "all players"}{" "}
//                                 at each level. This report counts{" "}
//                                 <span className="blue-text">
//                                     total level (including epic)
//                                 </span>
//                                 . Normalized for population. Quarterly rolling
//                                 average.
//                             </p>
//                         ),
//                         content: (
//                             <ChartLevelDistribution
//                                 data={levelDistributionData}
//                                 activeFilter={levelDistributionFilter}
//                                 filters={[
//                                     {
//                                         name: "Filter",
//                                         reference: FilterLevelDistribution,
//                                         options: [
//                                             "All Players",
//                                             "Active Players",
//                                             "Inactive Players",
//                                         ],
//                                         index: 1,
//                                     },
//                                 ]}
//                                 showActions={true}
//                                 showLastUpdated={false}
//                                 reportReference={showReportForm}
//                             />
//                         ),
//                     },
//                     {
//                         title: "Content Level Distribution",
//                         description: (
//                             <p>
//                                 The level of content being played. This report
//                                 counts{" "}
//                                 <span className="blue-text">
//                                     each time a player enters a quest regardless
//                                     of whether or not the quest is completed
//                                 </span>
//                                 . Normalized for population. Quarterly rolling
//                                 average.
//                             </p>
//                         ),
//                         content: (
//                             <ChartLevelDistribution
//                                 data={contentLevelDistributionData}
//                                 showActions={true}
//                                 showLastUpdated={false}
//                                 reportReference={showReportForm}
//                             />
//                         ),
//                     },
//                     {
//                         title: "Most Popular Content",
//                         description: (
//                             <p>
//                                 The most commonly-played quests across DDO for
//                                 the last 30 days.
//                                 <br />
//                                 Click on a quest to see recent popularity
//                                 history.
//                             </p>
//                         ),
//                         content: (
//                             <ContentTable
//                                 data={contentData}
//                                 activeFilter={contentFilter}
//                                 activeOrder={contentOrder}
//                                 filters={[
//                                     {
//                                         name: "Filter",
//                                         reference: FilterContentTable,
//                                         options: [
//                                             "All Content",
//                                             "Raids Only",
//                                             "Free to Play",
//                                             "By Adventure Pack",
//                                         ],
//                                         index: 0,
//                                     },
//                                     {
//                                         name: "Order By",
//                                         reference: OrderContentTable,
//                                         options: [
//                                             "Most Popular",
//                                             "Least Popular",
//                                         ],
//                                         index: 0,
//                                     },
//                                 ]}
//                                 showServerFilters={
//                                     contentFilter !== "By Adventure Pack"
//                                 }
//                                 serverFilterReference={
//                                     FilterContentTableGranular
//                                 }
//                                 showActions={true}
//                                 showLastUpdated={false}
//                                 reportReference={showReportForm}
//                             />
//                         ),
//                     },
//                 ]}
//             />
//         </div>
//     );
// };

// export default Servers;
