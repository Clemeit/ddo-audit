import React from "react";
import { ReactComponent as LiveSVG } from "../../assets/global/live.svg";
import { ReactComponent as ServersSVG } from "../../assets/global/servers.svg";
import { ReactComponent as GroupingSVG } from "../../assets/global/grouping.svg";
import { ReactComponent as WhoSVG } from "../../assets/global/who.svg";
import { ReactComponent as FriendsSVG } from "../../assets/global/friends.svg";
import { ReactComponent as QuestsSVG } from "../../assets/global/quests.svg";
import { ReactComponent as TrendsSVG } from "../../assets/global/trends.svg";
import { ReactComponent as AboutSVG } from "../../assets/global/about.svg";
import { ReactComponent as ApiSVG } from "../../assets/global/api.svg";
import { ReactComponent as CommunitySVG } from "../../assets/global/community.svg";
import { Submit } from "../../services/CommunicationService";
import { ReactComponent as ThumbsDownSVG } from "../../assets/global/thumbs_down.svg";
import { ReactComponent as ThumbsUpSVG } from "../../assets/global/thumbs_up.svg";
import { ReactComponent as FeedbackSVG } from "../../assets/global/feedback.svg";
import { ReactComponent as RegisterSVG } from "../../assets/global/register.svg";
import { ReactComponent as TimerSVG } from "../../assets/global/timer.svg";
import { Link, useLocation } from "react-router-dom";
import { Helmet } from "react-helmet";
import Banner from "../global/Banner";
import Footer from "./Footer";
import BannerMessage from "../global/BannerMessage";
import ContentCluster from "../global/ContentCluster";

const Directory = (props) => {
    const TITLE = "DDO Audit | Population Tracking and LFM Viewer";

    const NAV_OPTIONS = [
        {
            title: "Population and Activity",
            tiles: [
                {
                    icon: <LiveSVG className="nav-icon-large should-invert" />,
                    title: "Quick Info",
                    description:
                        "Server status, most populated server, and default server.",
                    to: "/live",
                },
                {
                    icon: (
                        <ServersSVG className="nav-icon-large should-invert" />
                    ),
                    title: "Server Statistics",
                    description:
                        "Server population, character demographics, and activity trends.",
                    to: "/servers",
                },
                {
                    icon: (
                        <QuestsSVG className="nav-icon-large should-invert" />
                    ),
                    title: "Quest Activity",
                    description:
                        "Content popularity, average duration, and XP/minute.",
                    to: "/quests",
                },
                // {
                //     icon: (
                //         <QuestsSVG className="nav-icon-large should-invert" />
                //     ),
                //     title: "Guild Activity",
                //     description: "Guild size and activity.",
                //     to: "/guilds",
                //     soon: true,
                // },
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
                    description:
                        "Easily find groups with a live LFM panel for every server.",
                    to: "/grouping",
                },
                {
                    icon: <WhoSVG className="nav-icon-large should-invert" />,
                    title: "Live Who List",
                    description:
                        "Explore a list of online players with a live Who panel.",
                    to: "/who",
                },
                // {
                //     icon: (
                //         <FriendsSVG className="nav-icon-large should-invert" />
                //     ),
                //     title: "Friends List",
                //     description:
                //         "Build your own friends list to quickly see who's online.",
                //     to: "/friends",
                //     new: true,
                // },
                {
                    icon: (
                        <RegisterSVG className="nav-icon-large should-invert" />
                    ),
                    title: "Register Characters",
                    description:
                        "Add your characters for automatic LFM filtering and raid timer tracking.",
                    to: "/registration",
                    new: true,
                },
                {
                    icon: <TimerSVG className="nav-icon-large should-invert" />,
                    title: "Raid Timers",
                    description: "View and manage your current raid timers.",
                    to: "/timers",
                    new: true,
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
                    unavailable: true,
                },
                {
                    icon: <ApiSVG className="nav-icon-large should-invert" />,
                    title: "API",
                    description:
                        "Look behind the curtain. Get the data for your own projects.",
                    to: "/api",
                    beta: true,
                },
                {
                    icon: (
                        <FeedbackSVG className="nav-icon-large should-invert" />
                    ),
                    title: "Give Feedback",
                    description:
                        "I welcome your feedback! Let me know what you think.",
                    to: "/suggestions",
                },
            ],
        },
    ];

    const [voteMessage, set_voteMessage] = React.useState(null);
    const [mayVote, set_mayVote] = React.useState(false);
    // React.useEffect(() => {
    //     let ls = localStorage.getItem("last-major-vote");
    //     if (ls != null) {
    //         // let dt = new Date(ls);
    //         // let mayvote =
    //         //     new Date(localStorage.getItem("last-major-vote")) <=
    //         //     new Date().getTime() - 1000 * 60 * 60 * 24 * 31;
    //         set_mayVote(false);
    //     } else {
    //         set_mayVote(true);
    //     }
    // }, []);

    function vote(response) {
        Submit("Voted from Directory", response);
        localStorage.setItem("last-major-vote", new Date());
        set_mayVote(false);
        if (response === "Like") {
            set_voteMessage("Thanks for your feedback!");
        } else {
            set_voteMessage(
                <span>
                    I welcome your <Link to="/suggestions">suggestions</Link>!
                </span>
            );
        }
    }

    return (
        <div>
            <Helmet>
                <title>{TITLE}</title>
                <meta
                    property="og:image"
                    content="/icons/logo-512px.png"
                    data-react-helmet="true"
                />
                <meta
                    property="twitter:image"
                    content="/icons/logo-512px.png"
                    data-react-helmet="true"
                />
                <meta
                    name="description"
                    content="A live summary of DDO's current player population and LFM status. View population trends, check server status, browse live grouping panels, check to see if your friends are online, and decide what server is best for you!"
                />
            </Helmet>
            <Banner
                small={false}
                showTitle={true}
                showSubtitle={true}
                showButtons={true}
                hideVote={true}
                title="DDO Audit"
                subtitle="Real-time Player Concurrency Data and LFM Viewer"
            />
            <div className="content-container">
                <BannerMessage page="home" />
                <div className="top-content-padding" />
                {mayVote && (
                    <div
                        className="action-button-container show-on-mobile"
                        style={{
                            flexDirection: "row",
                            marginTop: "-25px",
                            marginBottom: "15px",
                        }}
                    >
                        <span
                            style={{
                                fontSize: "large",
                            }}
                        >
                            New Website!
                        </span>
                        <ThumbsUpSVG
                            className="nav-icon should-invert"
                            style={{ cursor: "pointer" }}
                            onClick={() => vote("Like")}
                        />
                        <ThumbsDownSVG
                            className="nav-icon should-invert"
                            style={{ cursor: "pointer" }}
                            onClick={() => vote("Dislike")}
                        />
                    </div>
                )}
                {voteMessage && (
                    <div
                        className="action-button-container"
                        style={{
                            marginTop: "-25px",
                            marginBottom: "15px",
                        }}
                    >
                        <span
                            style={{
                                fontSize: "1.7rem",
                            }}
                        >
                            {voteMessage}
                        </span>
                    </div>
                )}
                {NAV_OPTIONS.map((option, i) => (
                    <ContentCluster key={i} title={option.title}>
                        <div className="content-cluster-options">
                            {option.tiles
                                .filter((option) => !option.unavailable)
                                .map((option, i) => (
                                    <Link
                                        to={option.to}
                                        key={i}
                                        className={
                                            "nav-box shrinkable" +
                                            (option.soon == true
                                                ? " no-interact"
                                                : "")
                                        }
                                        style={{
                                            height: "auto",
                                            minHeight: "150px",
                                        }}
                                    >
                                        <div className="nav-box-title">
                                            {option.icon}
                                            <h2 className="content-option-title">
                                                {option.title}
                                                {option.new != null && (
                                                    <div className="new-tag">
                                                        NEW
                                                    </div>
                                                )}
                                                {option.beta != null && (
                                                    <div className="beta-tag">
                                                        BETA
                                                    </div>
                                                )}
                                                {option.soon != null && (
                                                    <div className="soon-tag">
                                                        COMING SOON
                                                    </div>
                                                )}
                                            </h2>
                                        </div>
                                        <p className="content-option-description">
                                            {option.description}
                                        </p>
                                    </Link>
                                ))}
                        </div>
                    </ContentCluster>
                ))}
            </div>
            <Footer />
        </div>
    );
};

export default Directory;
