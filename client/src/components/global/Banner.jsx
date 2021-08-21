import React from "react";
import { Submit } from "../global/ReportIssueService";
import { ReactComponent as DarkThemeSVG } from "../../assets/global/dark_theme.svg";
import { ReactComponent as ThumbsDownSVG } from "../../assets/global/thumbs_down.svg";
import { ReactComponent as ThumbsUpSVG } from "../../assets/global/thumbs_up.svg";
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
    const [hasVoted, set_hasVoted] = React.useState(true);
    React.useEffect(() => {
        set_hasVoted(localStorage.getItem("has-voted") === "true");
    }, []);

    function vote(response) {
        Submit("Home", "Voted", response, "");
        localStorage.setItem("has-voted", "true");
        set_hasVoted(true);
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
            $("#nav-bar").css({ backgroundColor: "" });
            $(window).unbind("scroll", handleScroll);
        };
    });

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
                                <div className="primary-button">
                                    Visit our GitHub
                                </div>
                                <div
                                    className="secondary-button"
                                    style={{
                                        padding:
                                            voteMessage ===
                                            "We welcome your suggestions!"
                                                ? "15px 25px"
                                                : "",
                                    }}
                                >
                                    Make a suggestion
                                </div>
                            </div>
                            {!hasVoted && (
                                <div
                                    id="action-button-container"
                                    style={{ flexDirection: "row" }}
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
                                <div id="action-button-container">
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
