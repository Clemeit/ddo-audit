import React from "react";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import Banner from "../global/Banner";
import {
    Fetch,
    VerifyCharacterAndLfmOverview,
} from "../../services/DataLoader";
import { ReactComponent as OnlineSVG } from "../../assets/global/online.svg";
import { ReactComponent as OfflineSVG } from "../../assets/global/offline.svg";
import { ReactComponent as PendingSVG } from "../../assets/global/pending.svg";
import { ReactComponent as PumpkinOnlineSVG } from "../../assets/global/pumpkin_green.svg";
import { ReactComponent as PumpkinOfflineSVG } from "../../assets/global/pumpkin_red.svg";
import { ReactComponent as PumpkinPendingSVG } from "../../assets/global/pumpkin_blue.svg";
import { ReactComponent as RegisterSVG } from "../../assets/global/register.svg";
import { ReactComponent as TimerSVG } from "../../assets/global/timer.svg";
import BannerMessage from "../global/BannerMessage";
import PopupMessage from "../global/PopupMessage";
import ContentCluster from "../global/ContentCluster";
import { Log } from "../../services/CommunicationService";
import RaidGroupCluster from "./RaidGroupCluster";
import ServerHook from "../../hooks/ServerHook";
import DataClassification from "../global/DataClassification";
import { all } from "mathjs";
import { SERVER_LIST } from "constants/Servers";

const Grouping = () => {
    const TITLE = "DDO Live LFM Viewer";
    const SERVERS = ServerHook();

    const API_HOST = "https://api.hcnxsryjficudzazjxty.com";
    const API_VERSION = "v1";
    const API_URL = `${API_HOST}/${API_VERSION}`;
    const LFM_API = `${API_URL}/lfms`;
    const SERVER_INFO_API = `${API_URL}/game/server-info`;

    const [serverInfoData, setServerInfoData] = React.useState<
        ServerInfoApiModel | undefined | null
    >(null);
    const [notificationRuleCount, setNotificationRuleCount] = React.useState(0);
    const [allLfmData, setAllLfmData] = React.useState<
        LfmApiModel | undefined | null
    >(undefined);

    // Popup message
    var [popupMessage, setPopupMessage] = React.useState(null);

    const EVENT_THEME = isSpookyTime();

    function isSpookyTime() {
        let dt = new Date();
        if (dt.getMonth() === 9 && dt.getDate() >= 4) {
            return "revels";
        }
        return "";
    }

    const PENDING =
        EVENT_THEME === "revels" ? (
            <PumpkinPendingSVG width="24px" height="24px" />
        ) : (
            <PendingSVG />
        );

    const ONLINE =
        EVENT_THEME === "revels" ? (
            <PumpkinOnlineSVG width="24px" height="24px" />
        ) : (
            <OnlineSVG />
        );

    const OFFLINE =
        EVENT_THEME === "revels" ? (
            <PumpkinOfflineSVG width="24px" height="24px" />
        ) : (
            <OfflineSVG />
        );

    function GetSVG(server_name: string): JSX.Element {
        if (serverInfoData === undefined) {
            return PENDING;
        }
        if (serverInfoData === null) {
            return OFFLINE;
        }

        let server = serverInfoData.data.servers[server_name];
        if (server === undefined) {
            return OFFLINE;
        }

        if (server.is_online) {
            return ONLINE;
        } else {
            return OFFLINE;
        }
    }

    function GetServerDescription(server_name: string) {
        if (allLfmData === undefined) {
            return (
                <p
                    className="content-option-description"
                    style={{ fontSize: "1.4rem" }}
                >
                    Loading...
                </p>
            );
        }
        if (allLfmData === null) {
            return (
                <p
                    className="content-option-description"
                    style={{ fontSize: "1.4rem" }}
                >
                    <span style={{ color: "var(--text-lfm-number)" }}>
                        0 LFMs{" "}
                    </span>
                </p>
            );
        }

        let lfmCount =
            Object.keys(
                allLfmData.data[server_name as keyof LfmApiDataModel]?.lfms
            )?.length || 0;
        let raidCount =
            Object.values(
                allLfmData.data[server_name as keyof LfmApiDataModel]?.lfms
            ).filter((lfm) => lfm.quest?.group_size === "Raid")?.length || 0;

        return (
            <p
                className="content-option-description"
                style={{ fontSize: "1.4rem" }}
            >
                <span style={{ color: "var(--text-lfm-number)" }}>
                    {`${lfmCount} LFM${lfmCount !== 1 ? "s" : ""}`}{" "}
                </span>
                {raidCount > 0 &&
                    `| ${raidCount} raid${raidCount !== 1 ? "s" : ""}`}
            </p>
        );
    }

    function RefreshLfmDataAndServerInfo() {
        Fetch(SERVER_INFO_API, 5000)
            .then((response_body) => {
                setServerInfoData(response_body);
            })
            .catch((err) => {
                setPopupMessage({
                    // @ts-ignore
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
                setServerInfoData(null);
            });

        Fetch(`${LFM_API}`, 5000)
            .then((response_body) => {
                setAllLfmData(response_body);
            })
            .catch((err) => {
                setPopupMessage({
                    // @ts-ignore
                    title: "Couldn't get LFM data",
                    message:
                        "We were unable to get LFM data. Try refreshing the page. If the issue continues, please report it.",
                    icon: "warning",
                    fullscreen: false,
                    reportMessage: (err && err.toString()) || "LFM data error",
                    submessage: (err && err.toString()) || "LFM data error",
                });
                setAllLfmData(undefined);
            });
    }

    React.useEffect(() => {
        RefreshLfmDataAndServerInfo();
        const interval = setInterval(
            () => RefreshLfmDataAndServerInfo(),
            60000
        );

        // setNotificationRuleCount(
        //     localStorage.getItem("notification-rules")
        //         ? JSON.parse(localStorage.getItem("notification-rules")).length
        //         : 0
        // );

        return () => clearInterval(interval);
    }, []);

    // function getRaidLfms() {
    //     if (allLfmData == null) return null;
    //     let raidLfms = [];
    //     allLfmData.forEach((server) => {
    //         server.lfms.forEach((lfm) => {
    //             if (lfm.quest) {
    //                 if (lfm.quest.group_size === "Raid") {
    //                     lfm.server_name = server.name;
    //                     raidLfms.push(lfm);
    //                 }
    //             }
    //         });
    //     });
    //     if (raidLfms.length !== 0) {
    //         return raidLfms.map((lfm, i) => (
    //             <Link
    //                 to={"/grouping/" + lfm.server_name}
    //                 key={i}
    //                 className="nav-box shrinkable"
    //                 onClick={() => {
    //                     Log("Clicked raid LFM link", "Grouping");
    //                 }}
    //             >
    //                 <div className="nav-box-title">
    //                     <h2 className="content-option-title">
    //                         {lfm.quest.name}
    //                     </h2>
    //                 </div>
    //                 <p
    //                     className="content-option-description"
    //                     style={{ fontSize: "1.5rem" }}
    //                 >
    //                     <span className="lfm-number">{lfm.server_name}</span> |{" "}
    //                     {lfm.leader.name} |{" "}
    //                     <span style={{ whiteSpace: "nowrap" }}>
    //                         {`${lfm.members.length + 1} member${
    //                             lfm.members.length + 1 !== 1 ? "s" : ""
    //                         }`}
    //                     </span>
    //                 </p>
    //             </Link>
    //         ));
    //     }
    //     return null;
    // }

    return (
        <>
            {/* @ts-ignore */}
            <Helmet>
                <title>{TITLE}</title>
                <meta
                    name="description"
                    content="View a live LFM panel to find public LFMs - before you even log in! See which groups are currently looking for more players and what content is currently being run."
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
                hideVote={true}
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
                <DataClassification classification="observed" />
                <div className="top-content-padding-small shrink-on-mobile" />
                <ContentCluster title="Select a Server">
                    <div className="content-cluster-options">
                        {SERVER_LIST.map((server_name, i) => (
                            <Link
                                to={"/grouping/" + server_name.toLowerCase()}
                                key={i}
                                className="nav-box shrinkable server"
                            >
                                <div className="nav-box-title">
                                    {GetSVG(server_name.toLowerCase())}
                                    <h2 className="content-option-title">
                                        {server_name}
                                    </h2>
                                </div>
                                {GetServerDescription(
                                    server_name.toLowerCase()
                                )}
                            </Link>
                        ))}
                    </div>
                </ContentCluster>
                <ContentCluster title="Current Raids">
                    <div className="content-cluster-options">
                        {allLfmData ? (
                            <RaidGroupCluster data={allLfmData} />
                        ) : (
                            <span className="content-cluster-description">
                                Loading LFMs...
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
                <ContentCluster title="See Also...">
                    <div className="content-cluster-options">
                        <Link
                            to="/registration"
                            className="nav-box shrinkable"
                            style={{
                                height: "auto",
                                minHeight: "150px",
                            }}
                        >
                            <div className="nav-box-title">
                                <RegisterSVG className="nav-icon should-invert" />
                                <h2 className="content-option-title">
                                    Register Characters
                                </h2>
                            </div>
                            <p className="content-option-description">
                                Add your characters for automatic LFM filtering
                                and raid timer tracking.
                            </p>
                        </Link>
                        <Link
                            to="/timers"
                            className="nav-box shrinkable"
                            style={{
                                height: "auto",
                                minHeight: "150px",
                            }}
                        >
                            <div className="nav-box-title">
                                <TimerSVG className="nav-icon should-invert" />
                                <h2 className="content-option-title">
                                    Raid Timers
                                </h2>
                            </div>
                            <p className="content-option-description">
                                View and manage your current raid timers.
                            </p>
                        </Link>
                    </div>
                </ContentCluster>
            </div>
        </>
    );
};

export default Grouping;
