import React from "react";
import { ReactComponent as DarkThemeSVG } from "../../assets/global/dark_theme.svg";
import "./default.css";
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

    let isNavbarSolid = false;
    function handleScroll() {
        var scrollTop = $(window).scrollTop();
        if (scrollTop > (props.small ? 200 : 450)) return;

        var offset;
        if (props.small) {
            offset = 50;
        } else {
            offset = $(document).width() > 850 ? 160 : 30;
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

        return function cleanup() {
            $(window).unbind("scroll", handleScroll);
        };
    });

    return (
        <div>
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
                        <div id="action-button-container">
                            <div id="primary-button">Visit our GitHub</div>
                            <div id="secondary-button">Make a suggestion</div>
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
