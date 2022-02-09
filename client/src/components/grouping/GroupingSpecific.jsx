import React from "react";
import { Helmet } from "react-helmet";
import Banner from "../global/Banner";
import { useLocation } from "react-router-dom";
import PopupMessage from "../global/PopupMessage";
import BannerMessage from "../global/BannerMessage";
import { ReactComponent as AddSVG } from "../../assets/global/add.svg";
import LfmPanel from "./GroupingPanel";
import PanelSelectPopup from "./PanelSelectPopup";
import WhoPanel from "../who/WhoPanel";

const GroupingSpecific = (props) => {
    const TITLE = "DDO Live LFM Viewer";

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
    const [panelSelectPopupVisibility, setPanelSelectPopupVisibility] =
        React.useState(false);

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
            setOpenPanels([
                <LfmPanel
                    server={serverName}
                    key={1}
                    triggerPopup={(message) => setPopupMessage(message)}
                />,
            ]);
        } else {
            // Bad server
            setCurrentServer(SERVER_NAMES[0]); // Just default to the first server in the good list
        }
    }, [window.location.pathname]);

    function getServerNamePossessive() {
        return `${currentServer}${currentServer === "Thelanis" ? "'" : "'s"}`;
    }

    function addPanel(obj) {
        if (obj.type === "lfm") {
            setOpenPanels((openPanels) => [
                ...openPanels,
                <LfmPanel
                    key={2}
                    server={obj.server}
                    minimal={true}
                    closePanel={() => setOpenPanels(openPanels)}
                    triggerPopup={(message) => setPopupMessage(message)}
                />,
            ]);
        } else if (obj.type === "who") {
            setOpenPanels((openPanels) => [
                ...openPanels,
                <WhoPanel
                    key={2}
                    server={obj.server}
                    minimal={true}
                    closePanel={() => setOpenPanels(openPanels)}
                    triggerPopup={(message) => setPopupMessage(message)}
                />,
            ]);
        }
    }

    // Popup message
    var [popupMessage, setPopupMessage] = React.useState(null);

    return (
        currentServer && (
            <div>
                <Helmet>
                    <title>{`${TITLE} for ${currentServer}`} </title>
                    <meta
                        name="description"
                        content={`Browse ${getServerNamePossessive()} LFMs! Check the LFM panel before you login, or setup notifications and never miss raid night again!`}
                    />
                    <meta
                        property="og:image"
                        content="/icons/grouping-512px.png"
                    />
                    <meta property="og:site_name" content="DDO Audit" />
                    <meta
                        property="twitter:image"
                        content="/icons/grouping-512px.png"
                    />
                </Helmet>
                <Banner
                    small={true}
                    showTitle={true}
                    showSubtitle={true}
                    showButtons={false}
                    hideOnMobile={true}
                    title={"Live LFM Viewer"}
                    subtitle={currentServer && currentServer}
                />
                <PopupMessage
                    page={"grouping/" + currentServer.toLowerCase()}
                    message={popupMessage}
                    popMessage={() => {
                        setPopupMessage(null);
                    }}
                />
                <PanelSelectPopup
                    visible={panelSelectPopupVisibility}
                    handleClose={() => setPanelSelectPopupVisibility(false)}
                    userSelected={(obj) => addPanel(obj)}
                />
                <div
                    className="content-container"
                    style={{ minHeight: "700px" }}
                >
                    <BannerMessage className="push-on-mobile" page="grouping" />
                    <div
                        id="top-content-padding"
                        className="top-content-padding hide-on-mobile"
                    />
                    <div className="multi-panel-container">
                        {openPanels && openPanels.length === 1 && (
                            <div
                                className="add-panel-button grouping"
                                onClick={() => {
                                    setPanelSelectPopupVisibility(true);
                                }}
                            >
                                <span>
                                    <AddSVG className="add-panel-icon" />
                                    Add a panel
                                </span>
                            </div>
                        )}
                        {openPanels}
                    </div>
                    <div className="top-content-padding hide-on-mobile" />
                </div>
            </div>
        )
    );
};

export default GroupingSpecific;
