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
import { Log } from "../../services/CommunicationService";
import RaidGroupCluster from "./RaidGroupCluster";

const Grouping = () => {
    const TITLE = "DDO Live LFM Viewer";
    let SERVER_NAMES = [
        "Argonnessen",
        "Cannith",
        "Ghallanda",
        "Khyber",
        "Orien",
        "Sarlona",
        "Thelanis",
        "Wayfinder",
        // "Hardcore",
    ];

    const [serverStatusData, setServerStatusData] = React.useState(null);
    const [notificationRuleCount, setNotificationRuleCount] = React.useState(0);
    const [allGroupData, setAllGroupData] = React.useState(null);

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

    function getMegaServerDescription() {
        if (allGroupData == null) {
            return (
                <p
                    className="content-option-description"
                    style={{ fontSize: "1.4rem" }}
                >
                    Loading...
                </p>
            );
        }
        let lfmcount = 0;
        allGroupData.forEach((s) => {
            lfmcount += s.GroupCount;
        });

        let raidcount = 0;
        allGroupData.forEach((server) => {
            server.Groups.forEach((group) => {
                if (group.Quest && group.Quest.GroupSize === "Raid")
                    raidcount++;
            });
        });

        return (
            <p
                className="content-option-description"
                style={{ fontSize: "1.4rem" }}
            >
                <span style={{ color: "var(--text-lfm-number)" }}>
                    {`${lfmcount} group${lfmcount !== 1 ? "s" : ""}`}{" "}
                </span>
                {raidcount > 0 &&
                    `| ${raidcount} raid${raidcount !== 1 ? "s" : ""}`}
            </p>
        );
    }

    function GetServerDescription(name) {
        if (allGroupData == null) {
            return (
                <p
                    className="content-option-description"
                    style={{ fontSize: "1.4rem" }}
                >
                    Loading...
                </p>
            );
        }
        let lfmcount = allGroupData.filter((server) => server.Name === name)[0]
            .GroupCount;

        let raidcount = 0;
        allGroupData.forEach((server) => {
            if (server.Name === name) {
                server.Groups.forEach((group) => {
                    if (group.Quest && group.Quest.GroupSize === "Raid")
                        raidcount++;
                });
            }
        });

        return (
            <p
                className="content-option-description"
                style={{ fontSize: "1.4rem" }}
            >
                <span style={{ color: "var(--text-lfm-number)" }}>
                    {`${lfmcount} group${lfmcount !== 1 ? "s" : ""}`}{" "}
                </span>
                {raidcount > 0 &&
                    `| ${raidcount} raid${raidcount !== 1 ? "s" : ""}`}
            </p>
        );
    }

    function refreshGroupData() {
        Fetch("https://api.ddoaudit.com/gamestatus/serverstatus", 5000)
            .then((val) => {
                setPopupMessage(null);
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

        Fetch("https://api.ddoaudit.com/groups/all", 5000)
            .then((val) => {
                setAllGroupData(val);
            })
            .catch((err) => {
                setPopupMessage({
                    title: "Couldn't get group data",
                    message:
                        "We were unable to get group data. Try refreshing the page. If the issue continues, please report it.",
                    icon: "warning",
                    fullscreen: false,
                    reportMessage:
                        (err && err.toString()) || "Group data error",
                    submessage: (err && err.toString()) || "Group data error",
                });
                setAllGroupData(null);
            });
    }

    React.useEffect(() => {
        refreshGroupData();
        const interval = setInterval(() => refreshGroupData(), 60000);

        setNotificationRuleCount(
            localStorage.getItem("notification-rules")
                ? JSON.parse(localStorage.getItem("notification-rules")).length
                : 0
        );

        return () => clearInterval(interval);
    }, []);

    function getRaidGroups() {
        if (allGroupData == null) return null;
        let raidgroups = [];
        allGroupData.forEach((server) => {
            server.Groups.forEach((group) => {
                if (group.Quest) {
                    if (group.Quest.GroupSize === "Raid") {
                        group.ServerName = server.Name;
                        raidgroups.push(group);
                    }
                }
            });
        });
        if (raidgroups.length !== 0) {
            return raidgroups.map((group, i) => (
                <Link
                    to={"/grouping/" + group.ServerName}
                    key={i}
                    className="nav-box shrinkable"
                    onClick={() => {
                        Log("Clicked raid group link", "Grouping");
                    }}
                >
                    <div className="nav-box-title">
                        <h2 className="content-option-title">
                            {group.Quest.Name}
                        </h2>
                    </div>
                    <p
                        className="content-option-description"
                        style={{ fontSize: "1.5rem" }}
                    >
                        <span className="lfm-number">{group.ServerName}</span> |{" "}
                        {group.Leader.Name} |{" "}
                        <span style={{ whiteSpace: "nowrap" }}>
                            {`${group.Members.length + 1} member${
                                group.Members.length + 1 !== 1 ? "s" : ""
                            }`}
                        </span>
                    </p>
                </Link>
            ));
        }
        return null;
    }

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
                <ContentCluster title="Current Raids">
                    <div className="content-cluster-options">
                        {allGroupData ? (
                            <RaidGroupCluster data={allGroupData} />
                        ) : (
                            <span className="content-cluster-description">
                                Loading groups...
                            </span>
                        )}
                    </div>
                </ContentCluster>
                <ContentCluster
                    title={
                        <>
                            Notifications
                            <div
                                className="soon-tag"
                                style={{ marginLeft: "1rem" }}
                            >
                                COMING SOON
                            </div>
                        </>
                    }
                    altTitle="Notifications"
                    description={
                        <div
                            className="no-interact"
                            style={{ textDecoration: "line-through" }}
                        >
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
                        </div>
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
