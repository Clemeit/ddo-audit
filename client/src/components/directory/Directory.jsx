import React from "react";
import { ReactComponent as LiveSVG } from "../../assets/global/live.svg";
import { ReactComponent as ServersSVG } from "../../assets/global/servers.svg";
import { ReactComponent as GroupingSVG } from "../../assets/global/grouping.svg";
import { ReactComponent as WhoSVG } from "../../assets/global/who.svg";
import { ReactComponent as QuestsSVG } from "../../assets/global/quests.svg";
import { ReactComponent as TrendsSVG } from "../../assets/global/trends.svg";
import { ReactComponent as AboutSVG } from "../../assets/global/about.svg";
import { ReactComponent as ApiSVG } from "../../assets/global/api.svg";
import { ReactComponent as CommunitySVG } from "../../assets/global/community.svg";
import { Submit } from "../../services/ReportIssueService";
import { ReactComponent as ThumbsDownSVG } from "../../assets/global/thumbs_down.svg";
import { ReactComponent as ThumbsUpSVG } from "../../assets/global/thumbs_up.svg";
import { ReactComponent as FeedbackSVG } from "../../assets/global/feedback.svg";
import { Link, useLocation } from "react-router-dom";
import { Helmet } from "react-helmet";
import Banner from "../global/Banner";
import Footer from "./Footer";
import BannerMessage from "../global/BannerMessage";

const Directory = (props) => {
    const TITLE = "DDO Audit";

    const NAV_OPTIONS = [
        {
            title: "Population and Activity",
            tiles: [
                {
                    icon: <LiveSVG className="nav-icon-large should-invert" />,
                    title: "Quick Info",
                    description:
                        "Most populated server, default server, and server status.",
                    to: "/live",
                },
                {
                    icon: (
                        <ServersSVG className="nav-icon-large should-invert" />
                    ),
                    title: "Server Statistics",
                    description: "Server population, demographics, and trends.",
                    to: "/servers",
                },
                {
                    icon: (
                        <QuestsSVG className="nav-icon-large should-invert" />
                    ),
                    title: "Quest Activity",
                    description:
                        "Content popularity, average completion times, and XP/minute.",
                    to: "/quests",
                },
                {
                    icon: (
                        <TrendsSVG className="nav-icon-large should-invert" />
                    ),
                    title: "Population Trends",
                    description:
                        "Long-term trends, daily minimum and maximum population, and important game events.",
                    to: "/trends",
                },
            ],
        },
        {
            title: "Social Tools",
            tiles: [
                {
                    icon: (
                        <GroupingSVG className="nav-icon-large should-invert" />
                    ),
                    title: "Live LFM Viewer",
                    description: "A live LFM panel for every server.",
                    to: "/grouping",
                },
                {
                    icon: <WhoSVG className="nav-icon-large should-invert" />,
                    title: "Live Who List",
                    description: "Lookup players on this live Who list.",
                    to: "/who",
                },
            ],
        },
        {
            title: "Additional Resources",
            tiles: [
                {
                    icon: <AboutSVG className="nav-icon-large should-invert" />,
                    title: "About This Project",
                    description:
                        "Everything you wanted to know about this project, and plenty of things you didn't.",
                    to: "/about",
                },
                {
                    icon: (
                        <CommunitySVG className="nav-icon-large should-invert" />
                    ),
                    title: "Community Tools",
                    description:
                        "Tools developed by the community, for the community.",
                    to: "/community",
                },
                {
                    icon: <ApiSVG className="nav-icon-large should-invert" />,
                    title: "API",
                    description:
                        "Look behind the curtain. Get the data for your own projects.",
                    to: "/api",
                },
                {
                    icon: (
                        <FeedbackSVG className="nav-icon-large should-invert" />
                    ),
                    title: "Give Feedback",
                    description:
                        "We welcome your feedback! Let us know what you think.",
                    to: "/suggestions",
                },
            ],
        },
    ];

    const [voteMessage, set_voteMessage] = React.useState(null);
    const [hasVoted, set_hasVoted] = React.useState(true);
    React.useEffect(() => {
        set_hasVoted(localStorage.getItem("has-voted") === "true");
    }, []);

    function vote(response) {
        Submit("Home", "Voted", "[M] " + response, "");
        localStorage.setItem("has-voted", "true");
        set_hasVoted(true);
        if (response === "Like") {
            set_voteMessage("Thanks for your feedback!");
        } else {
            set_voteMessage("We welcome your suggestions!");
        }
    }

    return (
        <div>
            <Helmet>
                <title>{TITLE}</title>
                <meta
                    name="description"
                    content="A live summary of DDO's current player population and LFM status. View population trends, check server status, browse live grouping panels, and see what server is best for you!"
                />
            </Helmet>
            <Banner
                small={false}
                showTitle={true}
                showSubtitle={true}
                showButtons={true}
                title="DDO Audit"
                subtitle="Real-time Player Concurrency Data and LFM Viewer"
            />
            <div id="content-container">
                <BannerMessage page="home" />
                <div className="top-content-padding" />
                {!hasVoted && (
                    <div
                        className="show-on-mobile"
                        id="action-button-container"
                        style={{
                            flexDirection: "row",
                            marginTop: "-25px",
                            marginBottom: "15px",
                        }}
                    >
                        <span
                            style={{
                                color: "white",
                                fontSize: "large",
                            }}
                        >
                            New Website!
                        </span>
                        <ThumbsUpSVG
                            className="nav-icon"
                            style={{ cursor: "pointer" }}
                            onClick={() => vote("Like")}
                        />
                        <ThumbsDownSVG
                            className="nav-icon"
                            style={{ cursor: "pointer" }}
                            onClick={() => vote("Dislike")}
                        />
                    </div>
                )}
                {voteMessage && (
                    <div
                        id="action-button-container"
                        style={{
                            marginTop: "-25px",
                            marginBottom: "15px",
                        }}
                    >
                        <span
                            style={{
                                color: "white",
                                fontSize: "large",
                            }}
                        >
                            {voteMessage}
                        </span>
                    </div>
                )}
                {NAV_OPTIONS.map((option, i) => (
                    <div key={i} className="content-cluster">
                        <h2 style={{ color: "var(--text)" }}>{option.title}</h2>
                        <hr
                            style={{
                                backgroundColor: "var(--text)",
                                opacity: 0.2,
                            }}
                        />
                        <div className="content-cluster-options">
                            {option.tiles.map((option, i) => (
                                <Link
                                    to={option.to}
                                    key={i}
                                    className="nav-box"
                                    style={{
                                        height: "auto",
                                        minHeight: "150px",
                                    }}
                                >
                                    <div className="nav-box-title">
                                        {option.icon}
                                        <h2 className="content-option-title">
                                            {option.title}
                                        </h2>
                                    </div>
                                    <p className="content-option-description">
                                        {option.description}
                                    </p>
                                </Link>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
            <Footer />
        </div>
    );
};

export default Directory;
