import React from "react";
import { Helmet } from "react-helmet";
import { useLocation } from "react-router-dom";
import Banner from "../global/Banner";
import PopupMessage from "../global/PopupMessage";
import BannerMessage from "../global/BannerMessage";
import { Submit } from "../../services/CommunicationService";
import ContentCluster from "../global/ContentCluster";
import FriendsPanel from "./FriendsPanel";
import { Log } from "../../services/CommunicationService";

const Friends = (props) => {
    // TODO: If this server is currently offline, don't bother checking for players
    const TITLE = "DDO Friends List";

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

    const [openPanels, setOpenPanels] = React.useState([]);

    // Popup message
    var [popupMessage, setPopupMessage] = React.useState(null);

    return (
        <div>
            <Helmet>
                <title>Friends List</title>
                <meta
                    name="description"
                    content="Build your own friends list to quickly check who's online!"
                />
                <meta property="og:image" content="/icons/friends-512px.png" />
                <meta property="og:site_name" content="DDO Audit" />
                <meta
                    property="twitter:image"
                    content="/icons/friends-512px.png"
                />
            </Helmet>
            <Banner
                small={true}
                showTitle={true}
                showSubtitle={true}
                showButtons={false}
                hideOnMobile={true}
                title="Friends List"
                subtitle="Placeholder"
            />
            <PopupMessage
                page={"friends"}
                message={popupMessage}
                popMessage={() => {
                    setPopupMessage(null);
                }}
            />
            <div
                className="content-container"
                style={{ minHeight: "700px", width: "100%" }}
            >
                <BannerMessage className="push-on-mobile" page="friends" />
                <div
                    id="top-content-padding"
                    className="top-content-padding hide-on-mobile"
                />
                <div className="multi-panel-container">{openPanels}</div>
                <div className="top-content-padding hide-on-mobile" />
            </div>
        </div>
    );
};

export default Friends;
