import React from "react";
import background from "../assets/global/banner.jpg";
import { ReactComponent as DarkThemeSVG } from "../assets/global/dark_theme.svg";

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

    return (
        <div style={{ position: "relative" }}>
            <div
                className="banner"
                style={{
                    backgroundImage: `url(${background})`,
                }}
            >
                <center>
                    <h1 style={{ fontWeight: "bold", fontSize: "xx-large" }}>
                        DDO Audit
                    </h1>
                    <h2 style={{ fontWeight: "bold", fontSize: "x-large" }}>
                        Real-time Player Concurrency Data and LFM Viewer
                    </h2>
                </center>
            </div>
            <div
                className="theme-container"
                style={{
                    color: "white",
                    bottom: "10px",
                    right: "10px",
                    position: "absolute",
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    cursor: "pointer",
                }}
                onClick={() => toggleTheme()}
            >
                <DarkThemeSVG className="theme-icon" />
                <span style={{ paddingLeft: "5px" }}>Theme</span>
            </div>
        </div>
    );
};

export default Banner;
