import React from "react";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import Banner from "../global/Banner";
import { Fetch, VerifyLfmData } from "../../services/DataLoader";
import { ReactComponent as OnlineSVG } from "../../assets/global/online.svg";
import { ReactComponent as OfflineSVG } from "../../assets/global/offline.svg";
import { ReactComponent as PendingSVG } from "../../assets/global/pending.svg";
import BannerMessage from "../global/BannerMessage";

const Grouping = () => {
    const TITLE = "Live LFM Panel";
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
        return (
            <p
                className="content-option-description"
                style={{ color: "var(--text-lfm-number)", fontSize: "1.4rem" }}
            >
                {overviewData.filter((server) => server.ServerName === name)[0]
                    .LfmCount + " groups"}
            </p>
        );
    }

    React.useEffect(() => {
        Fetch("https://www.playeraudit.com/api/serverstatus", 5000)
            .then((val) => {
                setServerStatusData(val);
            })
            .catch(() => {});
        Fetch("https://www.playeraudit.com/api/playerandlfmoverview", 5000)
            .then((val) => {
                // if (VerifyLfmData(val)) {
                // set_popupMessages([]);
                setOverviewData(val);
                // } else {
                // set_popupMessages([
                //     ...popupMessages,
                //     {
                //         title: "Something went wrong",
                //         message:
                //             "Pretty descriptive, I know. Try refreshing the page. If the issue continues, please report it.",
                //         icon: "warning",
                //         fullscreen: false,
                //         reportMessage:
                //             JSON.stringify(val) ||
                //             "Group data returned null",
                //     },
                // ]);
                // setOverviewData(null);
                // }
            })
            .catch(() => {
                // set_popupMessages([
                //     ...popupMessages,
                //     {
                //         title: "We're stuck on a loading screen",
                //         message:
                //             "This is taking longer than usual. You can refresh the page or report the issue.",
                //         icon: "warning",
                //         fullscreen: false,
                //         reportMessage:
                //             "Could not fetch Group data. Timeout",
                //     },
                // ]);
            });

        setNotificationRuleCount(
            localStorage.getItem("notification-rules")
                ? JSON.parse(localStorage.getItem("notification-rules")).length
                : 0
        );
    }, []);

    return (
        <div>
            <Banner
                small={true}
                showTitle={true}
                showSubtitle={true}
                showButtons={false}
                hideOnMobile={true}
                title="Grouping"
                subtitle="Live LFM Viewer"
            />
            <Helmet>
                <title>{TITLE}</title>
                <meta
                    name="description"
                    content="View a live LFM panel to find public groups. See which groups are currently looking for more players and what content is currently being run."
                />
            </Helmet>
            <div id="content-container">
                <BannerMessage page="grouping" />
                <div className="top-content-padding shrink-on-mobile" />
                <div className="content-cluster">
                    <h2 style={{ color: "var(--text)" }}>Select a Server</h2>
                    <hr
                        style={{
                            backgroundColor: "var(--text)",
                            opacity: 0.2,
                        }}
                    />
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
                </div>
                <div className="content-cluster">
                    <h2 style={{ color: "var(--text)" }}>Notifications</h2>
                    <hr
                        style={{
                            backgroundColor: "var(--text)",
                            opacity: 0.2,
                        }}
                    />
                    <p
                        style={{
                            fontSize: "1.5rem",
                            lineHeight: "normal",
                            color: "var(--text-faded)",
                        }}
                    >
                        You currently have{" "}
                        <span style={{ color: "var(--text-lfm-number)" }}>
                            {notificationRuleCount}
                        </span>{" "}
                        notification rule
                        {notificationRuleCount !== 1 ? "s" : ""} setup.
                        Configure notifications in the{" "}
                        <Link to="/notifications">notification settings</Link>.
                    </p>
                    <div className="content-cluster-options"></div>
                </div>
                <div className="content-cluster">
                    <h2 style={{ color: "var(--text)" }}>Contributions</h2>
                    <hr
                        style={{
                            backgroundColor: "var(--text)",
                            opacity: 0.2,
                        }}
                    />
                    <p
                        style={{
                            fontSize: "1.5rem",
                            lineHeight: "normal",
                            color: "var(--text-faded)",
                        }}
                    >
                        A special thanks to the amazing developers over at Vault
                        of Kundarak. Their contributions to this project made
                        the Live LFM Viewer possible. Visit their website at{" "}
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
                            color: "var(--text-faded)",
                        }}
                    >
                        And thank <u>you</u> for your continued support. This
                        project is made possible by your feedback and
                        suggestions!
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Grouping;
