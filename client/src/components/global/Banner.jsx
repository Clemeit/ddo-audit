import React from "react";
import { Submit } from "../../services/ReportIssueService";
import { ReactComponent as DarkThemeSVG } from "../../assets/global/dark_theme.svg";
import { ReactComponent as ThumbsDownSVG } from "../../assets/global/thumbs_down.svg";
import { ReactComponent as ThumbsUpSVG } from "../../assets/global/thumbs_up.svg";
import { Link } from "react-router-dom";
import $ from "jquery";

const Banner = (props) => {
    function toggleTheme() {
        let theme = localStorage.getItem("theme");
        if (theme === "light-theme") {
            theme = "dark";

            document.body.classList.replace("light-theme", "dark-theme");
            localStorage.setItem("theme", "dark-theme");
        } else {
            theme = "light";

            document.body.classList.replace("dark-theme", "light-theme");
            localStorage.setItem("theme", "light-theme");
        }
    }

    const [voteMessage, set_voteMessage] = React.useState(null);
    const [mayVote, set_mayVote] = React.useState(false);
    React.useEffect(() => {
        let ls = localStorage.getItem("last-major-vote");
        if (ls !== undefined && ls !== null) {
            let dt = new Date(ls);
            let mayvote =
                new Date(localStorage.getItem("last-major-vote")) <=
                new Date().getTime() - 1000 * 60 * 60 * 24 * 31;
            set_mayVote(mayvote);
        } else {
            set_mayVote(true);
        }
    }, []);

    function vote(response) {
        Submit("Voted from Banner", response);
        localStorage.setItem("last-major-vote", new Date());
        set_mayVote(false);
        if (response === "Like") {
            set_voteMessage("Thanks for your feedback!");
        } else {
            set_voteMessage("We welcome your suggestions!");
        }
    }

    let isNavbarSolid = false;
    function handleScroll() {
        var scrollTop = $(window).scrollTop();
        if (scrollTop > (props.small ? 200 : 450) && isNavbarSolid === true)
            return;

        var offset;
        if (props.small) {
            offset = 50;
        } else {
            offset = $(window).outerWidth() > 850 ? 160 : 30;
        }

        $("#banner-text-container").css("top", `${offset - scrollTop / 2}px`);
        if (scrollTop > (props.small ? 40 : 180)) {
            if (isNavbarSolid === false) {
                isNavbarSolid = true;
                $("#nav-bar").css({ backgroundColor: "var(--nav-bar)" });
            }
        } else {
            if (isNavbarSolid === true) {
                isNavbarSolid = false;
                $("#nav-bar").css({ backgroundColor: "" });
            }
        }
    }

    React.useEffect(() => {
        $(window).bind("scroll", handleScroll);
        $(window).bind("resize", handleScroll);

        return function cleanup() {
            $(window).unbind("scroll", handleScroll);
            $("#nav-bar").css({ backgroundColor: "" });
        };
    }, []);

    return (
        <div className={props.hideOnMobile ? "hide-on-mobile" : ""}>
            <div>
                <div
                    id="banner-image"
                    style={{ height: props.small ? "220px" : "" }}
                />
                <div
                    id="banner-text-container"
                    style={{ top: props.small ? "50px" : "" }}
                >
                    {props.showTitle && <h1 id="main-title">{props.title}</h1>}
                    {props.showSubtitle && (
                        <h2 id="main-subtitle">{props.subtitle}</h2>
                    )}
                    {props.showButtons && (
                        <div className="hide-on-mobile">
                            <div id="action-button-container">
                                <a
                                    href="https://github.com/Clemeit/ddo-audit"
                                    rel="noreferrer"
                                    target="_blank"
                                    className="primary-button"
                                >
                                    Visit our GitHub
                                </a>
                                {!props.hideSuggestions && (
                                    <Link
                                        to="/suggestions"
                                        className="secondary-button expandable"
                                        style={{
                                            padding:
                                                voteMessage ===
                                                "We welcome your suggestions!"
                                                    ? "17px 25px"
                                                    : "",
                                        }}
                                    >
                                        Make a suggestion
                                    </Link>
                                )}
                            </div>
                            {mayVote && (
                                <div
                                    id="action-button-container"
                                    style={{ flexDirection: "row" }}
                                >
                                    <span
                                        style={{
                                            fontSize: "large",
                                            color: "white",
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
                                <div id="action-button-container">
                                    <span
                                        style={{
                                            fontSize: "large",
                                        }}
                                    >
                                        {voteMessage}
                                    </span>
                                </div>
                            )}
                        </div>
                    )}
                </div>
                <div id="theme-container" onClick={() => toggleTheme()}>
                    <DarkThemeSVG id="theme-icon" />
                    <span style={{ paddingLeft: "5px" }}>Theme</span>
                </div>
            </div>
            <div
                id="content-push-top"
                style={{ height: props.small ? "220px" : "" }}
            />
        </div>
    );
};

export default Banner;
