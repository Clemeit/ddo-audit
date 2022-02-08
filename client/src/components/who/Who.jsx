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

const Who = (props) => {
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
        // "Hardcore",
    ];

    var [overviewData, setOverviewData] = React.useState(null);
    var [serverStatusData, setServerStatusData] = React.useState(null);

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
        return (
            <p
                className="content-option-description"
                style={{ color: "var(--text-lfm-number)", fontSize: "1.4rem" }}
            >
                {overviewData.filter((server) => server.ServerName === name)[0]
                    .PlayerCount + " players"}
            </p>
        );
    }

    React.useEffect(() => {
        function FetchPlayerData() {
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

            Fetch(
                "https://api.ddoaudit.com/gamestatus/populationoverview",
                5000
            )
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
                        title: "Couldn't get population data",
                        message:
                            "We were unable to get population data. You can refresh the page or report the issue.",
                        icon: "warning",
                        fullscreen: false,
                        reportMessage:
                            (err && err.toString()) ||
                            "Could not fetch Group data",
                        submessage:
                            (err && err.toString()) ||
                            "Could not fetch Group data",
                    });
                });
        }
        FetchPlayerData();

        const refreshdata = setInterval(() => {
            FetchPlayerData();
        }, 60000);
        return () => clearInterval(refreshdata);
    }, []);

    return (
        <div>
            <Helmet>
                <title>{TITLE}</title>
                <meta
                    name="description"
                    content="Browse players from any server with a live Who panel. Are your friends online? Is your guild forming up for a late-night raid? Now you know!"
                />
                <meta property="og:image" content="/icons/who-512px.png" />
                <meta property="og:site_name" content="DDO Audit" />
                <meta property="twitter:image" content="/icons/who-512px.png" />
            </Helmet>
            <Banner
                small={true}
                showTitle={true}
                showSubtitle={true}
                showButtons={false}
                hideOnMobile={true}
                title="Who"
                subtitle="Live Player Lookup"
            />
            <PopupMessage
                page="who"
                message={popupMessage}
                popMessage={() => {
                    setPopupMessage(null);
                }}
            />
            <div className="content-container">
                <BannerMessage page="who" />
                <div className="top-content-padding shrink-on-mobile" />
                <ContentCluster title="Select a Server">
                    <div className="content-cluster-options">
                        {SERVER_NAMES.map((name, i) => (
                            <Link
                                to={"/who/" + name.toLowerCase()}
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
            </div>
        </div>
    );
};

export default Who;
