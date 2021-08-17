import React from "react";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import Banner from "../global/Banner";
import { Fetch, VerifyLfmData } from "../../services/DataLoader";
import { ReactComponent as OnlineSVG } from "../../assets/global/online.svg";
import { ReactComponent as OfflineSVG } from "../../assets/global/offline.svg";
import { ReactComponent as PendingSVG } from "../../assets/global/pending.svg";

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
        if (groupData === null || groupData === undefined) {
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
                {groupData.filter((server) => server.Name === name)[0]
                    .GroupCount + " groups"}
            </p>
        );
    }

    const [groupData, setGroupData] = React.useState(null);
    const [serverStatusData, setServerStatusData] = React.useState(null);

    React.useEffect(() => {
        Fetch("https://www.playeraudit.com/api/serverstatus", 5000)
            .then((val) => {
                setServerStatusData(val);
            })
            .catch(() => {});
        Fetch("https://www.playeraudit.com/api/groups", 5000)
            .then((val) => {
                if (VerifyLfmData(val)) {
                    // set_popupMessages([]);
                    setGroupData(val);
                } else {
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
                    setGroupData(null);
                }
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
                    <h2 style={{ color: "var(--text)" }}>Matching Groups</h2>
                    <hr
                        style={{
                            backgroundColor: "var(--text)",
                            opacity: 0.2,
                        }}
                    />
                    <p
                        style={{
                            textAlign: "justify",
                            fontSize: "1.5rem",
                            lineHeight: "normal",
                            color: "var(--text-faded)",
                        }}
                    >
                        Groups that match your filter settings will show up here
                    </p>
                    <div className="content-cluster-options"></div>
                </div>
            </div>
        </div>
    );
};

export default Grouping;
