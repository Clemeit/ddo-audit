import React from "react";
import { Submit } from "../../services/CommunicationService";
import { ReactComponent as DarkThemeSVG } from "../../assets/global/dark_theme.svg";
import { ReactComponent as TimeSVG } from "../../assets/global/time.svg";
import { ReactComponent as ThumbsDownSVG } from "../../assets/global/thumbs_down.svg";
import { ReactComponent as ThumbsUpSVG } from "../../assets/global/thumbs_up.svg";
import { Link } from "react-router-dom";
import $ from "jquery";
import { Log } from "../../services/CommunicationService";

const Banner = (props) => {
    function getTimeZone() {
        let timezone = localStorage.getItem("timezone");
        if (timezone === "est") {
            return "EST";
        } else {
            return "Local";
        }
    }

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

    function toggleTimeZone() {
        let timezone = localStorage.getItem("timezone");
        if (timezone === "local") {
            timezone = "est";

            localStorage.setItem("timezone", "est");
        } else {
            timezone = "local";

            localStorage.setItem("timezone", "local");
        }
        window.location.reload();
    }

    const [voteMessage, set_voteMessage] = React.useState(null);
    const [mayVote, set_mayVote] = React.useState(false);
    React.useEffect(() => {
        let showVoteButton;
        let ls = localStorage.getItem("last-major-vote");
        if (ls !== undefined && ls !== null) {
            let dt = new Date(ls);
            let mayvote =
                new Date(localStorage.getItem("last-major-vote")) <=
                new Date().getTime() - 1000 * 60 * 60 * 24 * 31;
            showVoteButton = setTimeout(() => {
                set_mayVote(mayvote);
            }, 1000);
            // set_mayVote(mayvote);
        } else {
            showVoteButton = setTimeout(() => {
                set_mayVote(true);
            }, 1000);
        }

        return () => {
            clearTimeout(showVoteButton);
        };
    }, []);

    function vote(response) {
        Submit("Voted from Banner", response);
        localStorage.setItem("last-major-vote", new Date());
        set_mayVote(false);
        if (response === "Like") {
            set_voteMessage("Thanks for your feedback!");
        } else {
            set_voteMessage("I welcome your suggestions!");
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
            offset =
                $(window).outerWidth() > 900
                    ? props.showButtons
                        ? 140
                        : 220
                    : 30;
        }

        $("#banner-text-container").css(
            "transform",
            `translateY(${scrollTop / 2}px)`
        );

        $("#banner-image").css("top", `${-scrollTop / 6}px`);

        if (scrollTop > (props.small ? 40 : 180)) {
            if (isNavbarSolid === false) {
                isNavbarSolid = true;
                $("#nav-bar").css({ backgroundColor: "var(--nav-bar)" });
                $("#nav-bar").css({ boxShadow: "0px 0px 5px black" });
            }
        } else {
            if (isNavbarSolid === true) {
                isNavbarSolid = false;
                $("#nav-bar").css({ backgroundColor: "" });
                $("#nav-bar").css({ boxShadow: "" });
            }
        }
    }

    React.useEffect(() => {
        $(window).bind("scroll", handleScroll);
        $(window).bind("resize", handleScroll);

        return function cleanup() {
            $(window).unbind("scroll", handleScroll);
            $("#nav-bar").css({ backgroundColor: "" });
            $("#nav-bar").css({ boxShadow: "" });
        };
    }, []);

    return (
        <div
            id="main-banner"
            className={props.hideOnMobile ? "hide-on-mobile" : ""}
        >
            <div
                className="banner"
                style={{ height: props.small ? "220px" : "500px" }}
            >
                <div
                    id="banner-image"
                    style={{
                        height: props.small ? "220px" : "",
                    }}
                />
                <div
                    id="banner-text-container"
                    // style={{
                    //     top: props.small
                    //         ? "50px"
                    //         : props.showButtons
                    //         ? ""
                    //         : "220px",
                    // }}
                >
                    {props.showTitle && <h1 id="main-title">{props.title}</h1>}
                    {props.showSubtitle && (
                        <h2 id="main-subtitle">{props.subtitle}</h2>
                    )}
                    {props.showButtons && (
                        <div
                            className="hide-on-mobile"
                            style={{ position: "relative" }}
                        >
                            <div className="action-button-container">
                                {!props.hideSuggestions && (
                                    <Link
                                        to="/suggestions"
                                        className="primary-button"
                                        style={{
                                            padding:
                                                voteMessage ===
                                                "I welcome your suggestions!"
                                                    ? "17px 25px"
                                                    : "",
                                        }}
                                    >
                                        Make a suggestion
                                    </Link>
                                )}
                                <a
                                    href="https://github.com/Clemeit/ddo-audit"
                                    rel="noreferrer"
                                    target="_blank"
                                    className="secondary-button expandable"
                                    onClick={() => {
                                        Log("Clicked GitHub link", "Banner");
                                    }}
                                >
                                    Visit my GitHub
                                </a>
                            </div>
                            {!props.hideVote && (
                                <div
                                    className="action-button-container vote-buttons"
                                    style={{
                                        opacity: mayVote ? 1 : 0,
                                    }}
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
                                <div className="action-button-container vote-buttons">
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
                <div className="options-container">
                    <div
                        className="theme-container"
                        onClick={() => toggleTheme()}
                    >
                        <DarkThemeSVG className="theme-icon" />
                        <span
                            className="hide-on-mobile"
                            style={{ paddingLeft: "5px" }}
                        >
                            Theme
                        </span>
                    </div>
                    {/* <div
                        className="theme-container"
                        onClick={() => toggleTimeZone()}
                    >
                        <TimeSVG />
                        <span
                            className="hide-on-mobile"
                            style={{ paddingLeft: "5px" }}
                        >
                            {getTimeZone()}
                        </span>
                    </div> */}
                </div>
            </div>
            {/* <div
                id="content-push-top"
                style={{ height: props.small ? "220px" : "" }}
            /> */}
        </div>
    );
};

export default Banner;
