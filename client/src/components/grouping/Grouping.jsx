import React from "react";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import Banner from "../global/Banner";
import { Fetch, VerifyPlayerAndLfmOverview } from "../../services/DataLoader";
import { ReactComponent as OnlineSVG } from "../../assets/global/online.svg";
import { ReactComponent as OfflineSVG } from "../../assets/global/offline.svg";
import { ReactComponent as PendingSVG } from "../../assets/global/pending.svg";
import BannerMessage from "../global/BannerMessage";
import PopupMessage from "../global/PopupMessage";
import ContentCluster from "../global/ContentCluster";

const Grouping = () => {
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

    const [overviewData, setOverviewData] = React.useState(null);
    const [serverStatusData, setServerStatusData] = React.useState(null);
    const [notificationRuleCount, setNotificationRuleCount] = React.useState(0);

    // Popup message
    var [popupMessage, setPopupMessage] = React.useState(null);

    function GetSVG(world) {
        if (world === undefined || world === null) return <PendingSVG />;
        if (!world.hasOwnProperty("Status")) return <PendingSVG />;
        switch (world.Status) {
            case 0:
                return <OfflineSVG />;
            case 1:
                return <OnlineSVG />;
            default:
                return <PendingSVG />;
        }
    }

    function GetServerDescription(name) {
        if (overviewData === null || overviewData === undefined) {
            return (
                <p
                    className="content-option-description"
                    style={{ fontSize: "1.4rem" }}
                >
                    Loading...
                </p>
            );
        }
        let lfmcount = overviewData.filter(
            (server) => server.ServerName === name
        )[0];
        return (
            <p
                className="content-option-description"
                style={{ color: "var(--text-lfm-number)", fontSize: "1.4rem" }}
            >
                {`${lfmcount} group${lfmcount !== 1 ? "s" : ""}`}
            </p>
        );
    }

    React.useEffect(() => {
        Fetch("https://api.ddoaudit.com/gamestatus/serverstatus", 5000)
            .then((val) => {
                setServerStatusData(val);
            })
            .catch((err) => {
                setPopupMessage({
                    title: "Couldn't get server status",
                    message:
                        "We failed to look up server staus. Try refreshing the page. If the issue continues, please report it.",
                    icon: "warning",
                    fullscreen: false,
                    reportMessage:
                        (err && err.toString()) || "Server status error",
                    submessage:
                        (err && err.toString()) || "Server status error",
                });
                setServerStatusData(null);
            });

        Fetch("https://api.ddoaudit.com/gamestatus/populationoverview", 5000)
            .then((val) => {
                if (VerifyPlayerAndLfmOverview(val)) {
                    setOverviewData(val);
                } else {
                    setPopupMessage({
                        title: "Something went wrong",
                        message:
                            "Pretty descriptive, I know. Try refreshing the page. If the issue continues, please report it.",
                        icon: "warning",
                        fullscreen: false,
                        reportMessage:
                            JSON.stringify(val) || "Group data corrupted",
                    });
                    setOverviewData(null);
                }
            })
            .catch((err) => {
                setPopupMessage({
                    title: "Couldn't get group data",
                    message:
                        "We were unable to get group data. You can refresh the page or report the issue.",
                    icon: "warning",
                    fullscreen: false,
                    reportMessage:
                        (err && err.toString()) || "Could not fetch Group data",
                    submessage:
                        (err && err.toString()) || "Could not fetch Group data",
                });
            });

        setNotificationRuleCount(
            localStorage.getItem("notification-rules")
                ? JSON.parse(localStorage.getItem("notification-rules")).length
                : 0
        );
    }, []);

    return (
        <div>
            <Helmet>
                <title>{TITLE}</title>
                <meta
                    name="description"
                    content="View a live LFM panel to find public groups - before you even log in! See which groups are currently looking for more players and what content is currently being run."
                />
                <meta property="og:image" content="/icons/grouping-512px.png" />
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
                title="Grouping"
                subtitle="Live LFM Viewer"
            />
            <PopupMessage
                page="grouping"
                messages={popupMessage}
                popMessage={() => {
                    setPopupMessage(null);
                }}
            />
            <div className="content-container">
                <BannerMessage page="grouping" />
                <div className="top-content-padding shrink-on-mobile" />
                <ContentCluster title="Select a Server">
                    <div className="content-cluster-options">
                        {SERVER_NAMES.map((name, i) => (
                            <Link
                                to={"/grouping/" + name.toLowerCase()}
                                key={i}
                                className="nav-box shrinkable"
                            >
                                <div className="nav-box-title">
                                    {serverStatusData
                                        ? GetSVG(
                                              serverStatusData.Worlds.filter(
                                                  (server) =>
                                                      server.Name === name
                                              )[0]
                                          )
                                        : GetSVG()}
                                    <h2 className="content-option-title">
                                        {name}
                                    </h2>
                                </div>
                                {GetServerDescription(name)}
                            </Link>
                        ))}
                    </div>
                </ContentCluster>
                <ContentCluster
                    title="Notifications"
                    description={
                        <>
                            You currently have{" "}
                            <span style={{ color: "var(--text-lfm-number)" }}>
                                {notificationRuleCount}
                            </span>{" "}
                            notification rule
                            {notificationRuleCount !== 1 ? "s" : ""} setup.
                            Configure notifications in the{" "}
                            <Link to="/notifications">
                                notification settings
                            </Link>
                            .
                        </>
                    }
                    noFade={true}
                />
                <ContentCluster
                    title="Contributions"
                    description={
                        <>
                            <p>
                                A special thanks to the amazing developers over
                                at Vault of Kundarak. Their contributions to
                                this project made the Live LFM Viewer possible.
                                Visit their website at{" "}
                                <a
                                    href="https://vaultofkundarak.com/"
                                    rel="noreferrer"
                                    target="_blank"
                                >
                                    vaultofkundarak.com
                                </a>{" "}
                                or drop by their{" "}
                                <a
                                    href="https://discord.com/invite/bfMZnbz"
                                    rel="noreferrer"
                                    target="_blank"
                                >
                                    Discord server
                                </a>{" "}
                                for news and updates on their projects!
                            </p>
                            <p
                                style={{
                                    fontSize: "1.5rem",
                                    lineHeight: "normal",
                                }}
                            >
                                And thank <i>you</i> for your continued support.
                                This project is made possible by your feedback
                                and suggestions!
                            </p>
                        </>
                    }
                    noFade={true}
                />
            </div>
        </div>
    );
};

export default Grouping;
