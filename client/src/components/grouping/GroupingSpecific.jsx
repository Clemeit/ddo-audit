import React from "react";
import { useLocation } from "react-router-dom";
import { Helmet } from "react-helmet";
import CanvasLfmPanel from "./CanvasLfmPanel";
import Banner from "../global/Banner";
import { Fetch, VerifyLfmData } from "../../services/DataLoader";
import LevelRangeSlider from "./LevelRangeSlider";
import FilterBar from "../global/FilterBar";
import Group from "./Group";

const GroupingSpecific = (props) => {
    const TITLE = "Live LFM Viewer";

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

    const [unfilteredServerData, setUnfilteredServerData] =
        React.useState(null);
    const [filteredServerData, setFilteredServerData] = React.useState(null);
    const [showNotEligible, setShowNotEligible] = React.useState(true);
    const [adjustedGroupCount, setAdjustedGroupCount] = React.useState(4);
    const [fontModifier, setFontModifier] = React.useState();
    const [highVisibility, setHighVisibility] = React.useState();
    const [alternativeLook, setAlternativeLook] = React.useState();
    const [minimumLevel, setMinimumLevel] = React.useState(1);
    const [maximumLevel, setMaximumLevel] = React.useState(30);
    const [sortAscending, setSortAscending] = React.useState();

    // Filter bar
    const [filterPanelVisible, setFilterPanelVisible] = React.useState(false);

    function toggleTheme() {
        let theme = localStorage.getItem("theme");
        if (theme === "light-theme") {
            theme = "dark";
            setTheme("dark");

            document.body.classList.replace("light-theme", "dark-theme");
            localStorage.setItem("theme", "dark-theme");
        } else {
            theme = "light";
            setTheme("light");

            document.body.classList.replace("dark-theme", "light-theme");
            localStorage.setItem("theme", "light-theme");
        }
    }

    const [theme, setTheme] = React.useState(true);

    const location = useLocation().pathname.substring(
        useLocation().pathname.lastIndexOf("/") + 1
    );
    var [currentServer, setCurrentServer] = React.useState(null);
    React.useEffect(() => {
        let serverName =
            location.substring(0, 1).toUpperCase() + location.substring(1);
        if (SERVER_NAMES.includes(serverName)) {
            // Good server
            setCurrentServer(serverName);
        } else {
            // Bad server
            setCurrentServer(SERVER_NAMES[0]); // Just default to the first server in the good list
        }
    }, [props.location]);

    React.useEffect(() => {
        // Load local storage
        let theme = localStorage.getItem("theme");
        setTheme(theme);

        let minlevel = localStorage.getItem("minimum-level");
        setMinimumLevel(minlevel || 1);

        let maxlevel = localStorage.getItem("maximum-level");
        setMaximumLevel(maxlevel || 30);

        let shownoteligible = localStorage.getItem("show-not-eligible");
        setShowNotEligible(
            shownoteligible !== null ? shownoteligible === "true" : true
        );

        let sortascending = localStorage.getItem("sort-order");
        setSortAscending(
            sortascending !== null ? sortascending === "true" : true
        );

        let alternativelook = localStorage.getItem("alternative-lfm-look");
        setAlternativeLook(
            alternativelook !== null ? alternativelook === "true" : false
        );

        let highvisibility = localStorage.getItem("high-visibility");
        setHighVisibility(
            highvisibility !== null ? highvisibility === "true" : false
        );

        let fontmodifier = localStorage.getItem("font-modifier");
        setFontModifier(fontmodifier !== null ? +fontmodifier : 0);
    }, []);

    let refreshLfmsTimeout;
    React.useEffect(() => {
        clearInterval(refreshLfmsTimeout);
        RefreshLfms();
        refreshLfmsTimeout = setInterval(RefreshLfms, 15000);

        return function cleanup() {
            clearInterval(refreshLfmsTimeout);
        };
    }, [currentServer]);

    let groups = [];
    let direction = 1;
    function RefreshLfms() {
        if (currentServer === null) return;
        Fetch("https://www.playeraudit.com/api/groups", 5000).then((val) => {
            if (VerifyLfmData(val)) {
                setUnfilteredServerData(
                    val.filter((server) => server.Name === currentServer)[0]
                );
            } else {
            }
        });
    }

    React.useEffect(() => {
        if (unfilteredServerData === null) return;
        let groups = unfilteredServerData.Groups;
        let filteredgroups = [];
        groups.forEach((group) => {
            let levelpass =
                (group.MinimumLevel >= minimumLevel &&
                    group.MinimumLevel <= maximumLevel) ||
                (group.MaximumLevel >= minimumLevel &&
                    group.MaximumLevel <= maximumLevel);
            group.Eligible = levelpass;
            if (levelpass || showNotEligible) {
                filteredgroups.push(group);
            }
        });
        setFilteredServerData({
            ...unfilteredServerData,
            Groups: filteredgroups.sort((a, b) =>
                sortAscending
                    ? a.MinimumLevel > b.MinimumLevel
                    : a.MinimumLevel < b.MinimumLevel
            ),
        });
    }, [
        unfilteredServerData,
        minimumLevel,
        maximumLevel,
        sortAscending,
        showNotEligible,
    ]);

    function IsExpanded(group) {
        let val = false;
        expandedGroups.forEach((g) => {
            if (g.Leader.Name === group.Leader.Name) val = true;
        });
        return val;
    }
    var [expandedGroups, set_expandedGroups] = React.useState([]);

    return (
        <div>
            <Banner
                small={true}
                showTitle={true}
                showSubtitle={true}
                showButtons={false}
                hideOnMobile={true}
                title="Live LFM Viewer"
                subtitle={currentServer && currentServer}
            />
            <Helmet>
                <title>{TITLE}</title>
                <meta
                    name="description"
                    content="Browse LFMs from any server with a live LFM panel! Check the LFM panel before you login, or setup notifications and never miss raid night again!"
                />
            </Helmet>
            <div id="content-container">
                <div className="top-content-padding hide-on-mobile" />
                <FilterBar
                    currentServer={currentServer}
                    showNotifications={true}
                    maxWidth={848}
                    returnTo="/grouping"
                    handleFilterButton={() =>
                        setFilterPanelVisible(!filterPanelVisible)
                    }
                >
                    <div
                        className="filter-panel-overlay"
                        style={{
                            display: filterPanelVisible ? "block" : "none",
                        }}
                        onClick={() => setFilterPanelVisible(false)}
                    />
                    <div
                        className="filter-panel"
                        style={{
                            display: filterPanelVisible ? "block" : "none",
                            padding: "10px",
                        }}
                    >
                        <div
                            className="content-cluster"
                            style={{ marginBottom: "10px" }}
                        >
                            <h2 style={{ fontSize: "1.5rem" }}>
                                Filter Groups
                            </h2>
                            <hr
                                style={{
                                    backgroundColor: "var(--text)",
                                    opacity: 0.2,
                                }}
                            />
                            <div style={{ padding: "15px" }}>
                                <LevelRangeSlider
                                    handleChange={(e) => {
                                        if (e.length) {
                                            setMinimumLevel(e[0]);
                                            setMaximumLevel(e[1]);
                                            localStorage.setItem(
                                                "minimum-level",
                                                e[0]
                                            );
                                            localStorage.setItem(
                                                "maximum-level",
                                                e[1]
                                            );
                                        }
                                    }}
                                    minimumLevel={minimumLevel}
                                    maximumLevel={maximumLevel}
                                />
                            </div>
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "left",
                                    flexDirection: "column",
                                    alignItems: "start",
                                }}
                            >
                                <label className="filter-panel-group-option">
                                    <input
                                        className="input-radio"
                                        name="noteligible"
                                        type="checkbox"
                                        checked={showNotEligible}
                                        onChange={() => {
                                            localStorage.setItem(
                                                "show-not-eligible",
                                                !showNotEligible
                                            );
                                            setShowNotEligible(
                                                !showNotEligible
                                            );
                                        }}
                                    />
                                    Show groups I am not eligible for
                                </label>
                                <label className="filter-panel-group-option">
                                    <input
                                        className="input-radio"
                                        name="setsortorder"
                                        type="checkbox"
                                        checked={sortAscending}
                                        onChange={() => {
                                            localStorage.setItem(
                                                "sort-order",
                                                !sortAscending
                                            );
                                            setSortAscending(!sortAscending);
                                        }}
                                    />
                                    Sort groups ascending
                                </label>
                            </div>
                        </div>
                        <div
                            className="content-cluster"
                            style={{ marginBottom: "10px" }}
                        >
                            <h2 style={{ fontSize: "1.5rem" }}>
                                Accessibility
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
                                    flexDirection: "column",
                                    alignItems: "start",
                                }}
                            >
                                <label className="filter-panel-group-option show-on-mobile">
                                    <input
                                        className="input-radio"
                                        name="darktheme"
                                        type="checkbox"
                                        checked={theme === "dark-theme"}
                                        onChange={() => {
                                            toggleTheme();
                                        }}
                                    />
                                    Dark theme
                                </label>
                                <label className="filter-panel-group-option">
                                    <input
                                        className="input-radio"
                                        name="classislook"
                                        type="checkbox"
                                        checked={alternativeLook}
                                        onChange={() => {
                                            localStorage.setItem(
                                                "alternative-lfm-look",
                                                !alternativeLook
                                            );
                                            setAlternativeLook(
                                                !alternativeLook
                                            );
                                        }}
                                    />
                                    Alternative View (easier to see on mobile)
                                </label>
                                <label className="filter-panel-group-option">
                                    <input
                                        className="input-radio"
                                        name="highvis"
                                        type="checkbox"
                                        checked={highVisibility}
                                        onChange={() => {
                                            localStorage.setItem(
                                                "high-visibility",
                                                !highVisibility
                                            );
                                            setHighVisibility(!highVisibility);
                                        }}
                                    />
                                    High Contrast
                                </label>
                                <label className="filter-panel-group-option">
                                    <input
                                        className="input-radio"
                                        name="largefont"
                                        type="checkbox"
                                        checked={fontModifier === 5}
                                        onChange={() => {
                                            localStorage.setItem(
                                                "font-modifier",
                                                fontModifier === 0 ? 5 : 0
                                            );
                                            setFontModifier(
                                                fontModifier === 0 ? 5 : 0
                                            );
                                        }}
                                    />
                                    Large Font
                                </label>
                            </div>
                        </div>
                    </div>
                </FilterBar>
                {alternativeLook === false ? (
                    <CanvasLfmPanel
                        data={filteredServerData}
                        showNotEligible={showNotEligible}
                        adjustedGroupCount={adjustedGroupCount}
                        fontModifier={fontModifier}
                        highVisibility={highVisibility}
                    />
                ) : (
                    <div className="social-container">
                        {filteredServerData &&
                        filteredServerData.Groups.length ? (
                            filteredServerData.Groups.map(
                                (group, i) =>
                                    group.Eligible && (
                                        <Group
                                            key={i}
                                            handleClick={() => {
                                                if (IsExpanded(group)) {
                                                    set_expandedGroups(
                                                        expandedGroups.filter(
                                                            (g) => {
                                                                return (
                                                                    g.Leader
                                                                        .Name !==
                                                                    group.Leader
                                                                        .Name
                                                                );
                                                            }
                                                        )
                                                    );
                                                } else {
                                                    set_expandedGroups([
                                                        ...expandedGroups,
                                                        group,
                                                    ]);
                                                }
                                            }}
                                            group={group}
                                            expanded={IsExpanded(group)}
                                        />
                                    )
                            )
                        ) : (
                            <span
                                style={{
                                    fontSize: "1.6rem",
                                    width: "100%",
                                    textAlign: "center",
                                    color: "var(--text)",
                                    marginTop: "20px",
                                }}
                            >
                                {filteredServerData &&
                                filteredServerData.Groups.length === 0
                                    ? "No groups meet your current filter settings"
                                    : "Loading data..."}
                            </span>
                        )}
                    </div>
                )}
                <div className="top-content-padding hide-on-mobile" />
            </div>
        </div>
    );
};

export default GroupingSpecific;
