import React from "react";
import { Helmet } from "react-helmet";
import Banner from "../global/Banner";
import { Fetch, VerifyPlayerData } from "../../services/DataLoader";
import PopupMessage from "../global/PopupMessage";
import BannerMessage from "../global/BannerMessage";

const ServersSpecific = () => {
    const TITLE = "Server Status and Demographics";

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
            <div id="content-container" style={{ height: "2000px" }}>
                <BannerMessage className="push-on-mobile" page="servers" />
                <div className="top-content-padding hide-on-mobile" />
            </div>
        </div>
    );
};

export default ServersSpecific;
