import React from "react";
// import { Helmet } from "react-helmet";
// import Banner from "../global/Banner";
// import ServerStatusDisplay from "./ServerStatusDisplay";
// // import { Fetch } from "../DataLoader";
// import PopupMessage from "../global/PopupMessage";

const Directory = (props) => {
    // const TITLE = "Server Status and Demographics";
    // const [serverStatusData, set_serverStatusData] = React.useState(null);
    // function refreshServerStatus() {
    //     Fetch("https://www.playeraudit.com/api/serverstatus", 5000)
    //         .then((val) => {
    //             set_serverStatusData(val);
    //         })
    //         .catch(() => {
    //             set_popupMessages([
    //                 ...popupMessages,
    //                 {
    //                     title: "Can't Determine Server Status",
    //                     message:
    //                         "We weren't able to check on the servers. You can refresh the page or report the issue.",
    //                     icon: "warning",
    //                     fullscreen: false,
    //                     reportMessage: "Could not fetch ServerStatus. Timeout",
    //                 },
    //             ]);
    //         });
    //     async function fetchArbitraryData(url, type) {
    //         let response = await fetch(url);
    //         if (type === "json") response = await response.json();
    //         else if (type === "text") response = await response.text();
    //         return response;
    //     }
    //     fetchArbitraryData(
    //         "https://www.playeraudit.com/api/serverstatus",
    //         "json"
    //     ).then((val) => {
    //         set_serverStatusData(val);
    //     });
    // }
    // React.useEffect(() => {
    //     refreshServerStatus();
    //     const interval = setInterval(() => refreshServerStatus, 60000);
    //     return () => clearInterval(interval);
    // }, []);
    // // Popup message
    // var [popupMessages, set_popupMessages] = React.useState([]);
    // return (
    //     <div>
    //         <Helmet>
    //             <title>{TITLE}</title>
    //             <meta name="description" content="Description" />
    //         </Helmet>
    //         <PopupMessage
    //             page="grouping"
    //             messages={popupMessages}
    //             popMessage={() => {
    //                 if (popupMessages.length) {
    //                     let newMessages = [...popupMessages];
    //                     newMessages = newMessages.slice(1);
    //                     set_popupMessages(newMessages);
    //                 }
    //             }}
    //         />
    //         <Banner
    //             small={true}
    //             showTitle={true}
    //             showSubtitle={true}
    //             showButtons={false}
    //             title="Servers"
    //             subtitle="Server population, demographics, and trends"
    //         />
    //         <div id="content-container" style={{ height: "2000px" }}>
    // <BannerMessage page="servers" />
    //             <ServerStatusDisplay data={serverStatusData} />
    //         </div>
    //     </div>
    // );
};

export default Directory;
