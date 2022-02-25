import React from "react";
import { Helmet } from "react-helmet";
import { useLocation } from "react-router-dom";
// import ReportIssueForm from "./ReportIssueForm";
// import PopupMessage from "./global/PopupMessage";
import { Fetch, VerifyPlayerData } from "../../services/DataLoader";
import Player from "./Player";
import { ReactComponent as CloseSVG } from "../../assets/global/close.svg";
import Banner from "../global/Banner";
import FilterBar from "../global/FilterBar";
import CanvasWhoPanel from "./CanvasWhoPanel";
import PopupMessage from "../global/PopupMessage";
import BannerMessage from "../global/BannerMessage";
import { Submit } from "../../services/ReportIssueService";
import { ReactComponent as AddSVG } from "../../assets/global/add.svg";
import ContentCluster from "../global/ContentCluster";
import WhoPanel from "./WhoPanel";
import LfmPanel from "../grouping/GroupingPanel";
import PanelSelectPopup from "../grouping/PanelSelectPopup";

const WhoSpecific = (props) => {
    // TODO: If this server is currently offline, don't bother checking for players
    const TITLE = "DDO Live Who Panel";

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
    let currentServerRef = React.useRef(currentServer);
    React.useEffect(() => {
        let serverName =
            location.substring(0, 1).toUpperCase() + location.substring(1);
        if (SERVER_NAMES.includes(serverName)) {
            // Good server
            setCurrentServer(serverName);
            currentServerRef.current = serverName;
            setOpenPanels([
                <WhoPanel
                    server={serverName}
                    key={1}
                    triggerPopup={(message) => setPopupMessage(message)}
                    permalink={() => permalink()}
                />,
            ]);
        } else {
            // Bad server
            setCurrentServer(SERVER_NAMES[0]); // Just default to the first server in the good list
        }
    }, [window.location.pathname]);

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
                    permalink={`https://www.ddoaudit.com/who/${currentServerRef.current.toLowerCase()}?secondarytype=lfm&secondaryserver=${obj.server.toLowerCase()}`}
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
                    permalink={`https://www.ddoaudit.com/who/${currentServerRef.current.toLowerCase()}?secondarytype=who&secondaryserver=${obj.server.toLowerCase()}`}
                />,
            ]);
        }
    }

    function toProperCase(str) {
        if (!str) return str;
        return `${str.substring(0, 1).toUpperCase()}${str.substring(1)}`;
    }

    React.useEffect(() => {
        let urlfilters = new URLSearchParams(window.location.search);
        let secondarytype = urlfilters.get("secondarytype");
        let secondaryserver = urlfilters.get("secondaryserver");

        if (secondarytype && secondaryserver) {
            let sspc = toProperCase(secondaryserver);
            if (
                (secondarytype == "lfm" || secondarytype == "who") &&
                SERVER_NAMES.includes(sspc)
            ) {
                addPanel({
                    type: secondarytype,
                    server: sspc,
                });
            }
        }
    }, []);

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
            precomment: reference.precomment,
            //data: reference.chartData,
        };
        // Show the report form
        setReportFormReference(referenceInfo);
        setReportFormVisibility("block");
    }
    function hideReportForm() {
        setReportFormVisibility("none");
    }
    function report(reference, custom) {
        showReportForm({
            title: "LFM Viewer",
            precomment: custom,
            chartType: null,
            displayType: null,
            trendType: null,
            showActions: null,
        });
    }

    // Popup message
    var [popupMessage, setPopupMessage] = React.useState(null);

    function getServerNamePossessive() {
        return `${currentServer}${currentServer === "Thelanis" ? "'" : "'s"}`;
    }

    return (
        currentServer && (
            <div>
                <Helmet>
                    <title>{`${TITLE} for ${currentServer}`} </title>
                    <meta
                        name="description"
                        content={`Browse ${getServerNamePossessive()} Who panel! Are your friends online? Is your guild forming up for a late-night raid? Now you know!`}
                    />
                    <meta property="og:image" content="/icons/who-512px.png" />
                    <meta property="og:site_name" content="DDO Audit" />
                    <meta
                        property="twitter:image"
                        content="/icons/who-512px.png"
                    />
                </Helmet>
                <Banner
                    small={true}
                    showTitle={true}
                    showSubtitle={true}
                    showButtons={false}
                    hideOnMobile={true}
                    title="Live Player Lookup"
                    subtitle={currentServer && currentServer}
                />
                <PopupMessage
                    page={"who/" + currentServer.toLowerCase()}
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
                    style={{ minHeight: "700px", width: "100%" }}
                >
                    <BannerMessage className="push-on-mobile" page="who" />
                    <div
                        id="top-content-padding"
                        className="top-content-padding hide-on-mobile"
                    />
                    <div className="multi-panel-container">
                        {openPanels && openPanels.length === 1 && (
                            <div
                                className="add-panel-button who"
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

export default WhoSpecific;
