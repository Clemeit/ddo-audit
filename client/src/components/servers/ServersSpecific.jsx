import React from "react";
import { Helmet } from "react-helmet";
import { useLocation } from "react-router-dom";
import Banner from "../global/Banner";
import { Fetch, VerifyPlayerData } from "../../services/DataLoader";
import PopupMessage from "../global/PopupMessage";
import BannerMessage from "../global/BannerMessage";

const ServersSpecific = () => {
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

    const [serverStatusData, set_serverStatusData] = React.useState(null);
    function refreshServerStatus() {
        Fetch("https://www.playeraudit.com/api/serverstatus", 5000)
            .then((val) => {
                set_serverStatusData(val);
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
        });
    }
    React.useEffect(() => {
        refreshServerStatus();
        const interval = setInterval(() => refreshServerStatus, 60000);
        return () => clearInterval(interval);
    }, []);
    // Popup message
    var [popupMessage, setPopupMessage] = React.useState(null);

    function getServerNamePossessive() {
        return `${currentServer}${currentServer === "Thelanis" ? "'" : "'s"}`;
    }

    return (
        <div>
            <Helmet>
                <title>{`${TITLE} for ${currentServer}`} </title>
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
            <div className="content-container" style={{ height: "2000px" }}>
                <BannerMessage className="push-on-mobile" page="servers" />
                <div className="top-content-padding hide-on-mobile" />
            </div>
        </div>
    );
};

export default ServersSpecific;
