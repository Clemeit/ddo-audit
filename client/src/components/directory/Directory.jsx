import React from "react";
import { ReactComponent as DarkThemeSVG } from "../../assets/global/dark_theme.svg";
import { ReactComponent as HomeSVG } from "../../assets/global/home.svg";
import { ReactComponent as ServersSVG } from "../../assets/global/servers.svg";
import { ReactComponent as GroupingSVG } from "../../assets/global/grouping.svg";
import { ReactComponent as WhoSVG } from "../../assets/global/who.svg";
import { ReactComponent as TrendsSVG } from "../../assets/global/trends.svg";
import { ReactComponent as AboutSVG } from "../../assets/global/about.svg";
import { ReactComponent as MenuSVG } from "../../assets/global/menu.svg";
import { ReactComponent as ApiSVG } from "../../assets/global/api.svg";
import "./default.css";
import $ from "jquery";
import { Helmet } from "react-helmet";
import { fixDependencies } from "mathjs";

const Directory = (props) => {
    const TITLE = "DDO Audit";

    const NAV_OPTIONS = [
        {
            title: "Population Statistics",
            tiles: [
                {
                    icon: (
                        <HomeSVG
                            className="nav-icon should-invert"
                            style={{ width: "30px", height: "30px" }}
                        />
                    ),
                    title: "Live Population",
                    description: "View live and historical game population.",
                },
                {
                    icon: (
                        <ServersSVG
                            className="nav-icon should-invert"
                            style={{ width: "30px", height: "30px" }}
                        />
                    ),
                    title: "Server Statistics",
                    description: "Server population, demographics, and trends.",
                },
                {
                    icon: (
                        <TrendsSVG
                            className="nav-icon should-invert"
                            style={{ width: "30px", height: "30px" }}
                        />
                    ),
                    title: "Population Trends",
                    description:
                        "Long-term trends, daily minimum and maximum population, and important game events.",
                },
            ],
        },
        {
            title: "Social Tools",
            tiles: [
                {
                    icon: (
                        <GroupingSVG
                            className="nav-icon should-invert"
                            style={{ width: "30px", height: "30px" }}
                        />
                    ),
                    title: "Live LFM Viewer",
                    description: "A live LFM panel for every server.",
                },
                {
                    icon: (
                        <WhoSVG
                            className="nav-icon should-invert"
                            style={{ width: "30px", height: "30px" }}
                        />
                    ),
                    title: "Live Who List",
                    description: "Lookup players on this live Who list.",
                },
            ],
        },
        {
            title: "Additional Resources",
            tiles: [
                {
                    icon: (
                        <AboutSVG
                            className="nav-icon should-invert"
                            style={{ width: "30px", height: "30px" }}
                        />
                    ),
                    title: "About This Project",
                    description:
                        "Everything you wanted to know about this project, and plenty of things you didn't.",
                },
                {
                    icon: (
                        <ApiSVG
                            className="nav-icon should-invert"
                            style={{ width: "30px", height: "30px" }}
                        />
                    ),
                    title: "API",
                    description:
                        "Ditch the pretty website. Get the data for your own projects.",
                },
            ],
        },
    ];

    let isNavbarSolid = false;
    $(window).scroll(() => {
        var scrollTop = $(window).scrollTop();
        $("#banner-text").css("top", `${160 - scrollTop / 2.75}px`);
        if (scrollTop > 200) {
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
    });

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
        <div>
            <Helmet>
                <title>{TITLE}</title>
                <meta
                    name="description"
                    content="A live summary of DDO's current player population and LFM status. View population trends, check server status, browse live grouping panels, and see what server is best for you!"
                />
            </Helmet>
            <div>
                <div className="directory-top-space" />
                <div
                    id="banner-text"
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        flexDirection: "column",
                        position: "fixed",
                        width: "100%",
                        top: "160px",
                        zIndex: 3,
                    }}
                >
                    <h1
                        id="main-title"
                        style={{
                            fontWeight: "bold",
                            fontSize: "xxx-large",
                            color: "white",
                        }}
                    >
                        DDO Audit
                    </h1>
                    <h2
                        id="main-subtitle"
                        style={{
                            fontWeight: "bold",
                            fontSize: "xx-large",
                            color: "white",
                        }}
                    >
                        Real-time Player Concurrency Data and LFM Viewer
                    </h2>
                    <div
                        id="action-button-container"
                        style={{
                            display: "flex",
                            flexDirection: "row",
                            gap: "10px",
                            marginTop: "20px",
                        }}
                    >
                        <div className="main-button">Visit our GitHub</div>
                        <div
                            className="main-button"
                            style={{
                                border: "1px solid white",
                                backgroundColor: "var(--gray8)",
                                color: "white",
                            }}
                        >
                            Make a suggestion
                        </div>
                    </div>
                </div>
                <div
                    className="theme-container"
                    style={{
                        position: "fixed",
                        color: "white",
                        top: "10px",
                        right: "15px",
                        position: "absolute",
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        cursor: "pointer",
                        zIndex: 10,
                    }}
                    onClick={() => toggleTheme()}
                >
                    <DarkThemeSVG className="theme-icon" />
                    <span style={{ paddingLeft: "5px" }}>Theme</span>
                </div>
            </div>
            <div
                style={{ height: "500px", visibility: "hidden", zIndex: 1 }}
            ></div>
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    flexDirection: "column",
                    height: "auto",
                    backgroundColor: "var(--card)",
                    zIndex: 3,
                    position: "relative",
                    paddingTop: "50px",
                    transition:
                        "background-color 250ms ease-in-out, color 350ms ease-in-out",
                }}
            >
                <div>
                    {NAV_OPTIONS.map((option, i) => (
                        <div key={i} style={{ margin: "0px 0px 50px 0px" }}>
                            <h2 style={{ color: "var(--text)" }}>
                                {option.title}
                            </h2>
                            <hr
                                style={{
                                    backgroundColor: "var(--text)",
                                    opacity: 0.2,
                                }}
                            />
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "left",
                                    alignItems: "center",
                                    width: "100%",
                                    flexWrap: "wrap",
                                    gap: "10px",
                                }}
                            >
                                {option.tiles.map((option, i) => (
                                    <div key={i} className="nav-box">
                                        <div className="nav-box-title">
                                            {option.icon}
                                            <h2
                                                style={{
                                                    color: "var(--text)",
                                                    margin: "0px",
                                                }}
                                            >
                                                {option.title}
                                            </h2>
                                        </div>
                                        <p
                                            style={{
                                                color: "var(--text-faded)",
                                                fontSize: "larger",
                                                margin: "0px",
                                            }}
                                        >
                                            {option.description}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Directory;
