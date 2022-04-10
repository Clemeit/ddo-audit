import React from "react";
import { Submit } from "../../services/CommunicationService";
import { Fetch, VerifyServerLfmData } from "../../services/DataLoader";
import ContentCluster from "../global/ContentCluster";
import CanvasLfmPanel from "./CanvasLfmPanel";
import LevelRangeSlider from "./LevelRangeSlider";
import FilterBar from "../global/FilterBar";
import Group from "./Group";

const Panel = (props) => {
    // Download canvas
    var download = function () {
        // Redraw panel without names
        var link = document.createElement("a");
        link.download = `ddo-lfm-panel.png`;
        link.href = document.getElementById("lfm-canvas").toDataURL();
        link.click();
    };

    const [theme, setTheme] = React.useState(true);
    const [reported, setReported] = React.useState(false);

    const [failedAttemptCount, setFailedAttemptCount] = React.useState(0);
    const failedAttemptRef = React.useRef(failedAttemptCount);
    failedAttemptRef.current = failedAttemptCount;

    const [serverStatus, setServerStatus] = React.useState(null);
    const serverStatusRef = React.useRef(serverStatus);
    serverStatusRef.current = serverStatus;

    const [ignoreServerStatus, setIgnoreServerStatus] = React.useState(false);
    const ignoreServerStatusRef = React.useRef(ignoreServerStatus);
    ignoreServerStatusRef.current = ignoreServerStatus;

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
    const [showCompletionPercentage, setShowCompletionPercentage] =
        React.useState(false);
    const [showMemberCount, setShowMemberCount] = React.useState(true);
    const [showQuestGuesses, setShowQuestGuesses] = React.useState(true);
    const sortAscendingRef = React.useRef(sortAscending);
    sortAscendingRef.current = sortAscending;

    async function getGroupTableCount() {
        return Fetch("https://api.ddoaudit.com/grouptablecount", 5000)
            .then((val) => {
                if (val.Count != null) {
                    return val.Count;
                } else {
                    return -1;
                }
            })
            .catch((err) => {
                return -1;
            });
    }

    function getServerNamePossessive() {
        return `${props.server}${props.server === "Thelanis" ? "'" : "'s"}`;
    }

    let groups = [];
    let direction = 1;
    let recheck;
    function RefreshLfms() {
        if (props.server === null) return;
        Fetch(
            "https://api.ddoaudit.com/gamestatus/serverstatus",
            5000 + failedAttemptRef.current * 500
        )
            .then((val) => {
                let serverstatus = false;
                if (val.hasOwnProperty("Worlds")) {
                    val.Worlds.forEach((world) => {
                        if (
                            world.Name.toLowerCase() ===
                            props.server.toLowerCase()
                        ) {
                            if (world.Status === 1) {
                                serverstatus = true;
                                setServerStatus(true);
                            } else {
                                serverstatus = false;
                                setServerStatus(false);
                            }
                        }
                    });
                } else {
                    serverstatus = false;
                    setServerStatus(false);
                }
                if (serverstatus === true || ignoreServerStatusRef.current) {
                    Fetch(
                        `https://api.ddoaudit.com/groups/${props.server.toLowerCase()}`,
                        5000 + failedAttemptRef.current * 500
                    )
                        .then((val) => {
                            if (VerifyServerLfmData(val)) {
                                props.triggerPopup(null);
                                failedAttemptRef.current = 0;
                                setFailedAttemptCount(failedAttemptRef.current);
                                setUnfilteredServerData(val);
                            } else {
                                failedAttemptRef.current++;
                                setFailedAttemptCount(failedAttemptRef.current);
                                if (failedAttemptRef.current > 5) {
                                    props.triggerPopup({
                                        title: "Something went wrong",
                                        message:
                                            "Pretty descriptive, I know. First try refreshing the page. If the issue continues, please report it.",
                                        icon: "warning",
                                        fullscreen: false,
                                        reportMessage: `GL127 Bad group data: ${
                                            val ? JSON.stringify(val) : "null"
                                        }`,
                                    });
                                } else {
                                    recheck = setTimeout(() => {
                                        RefreshLfms();
                                    }, 200);
                                }
                            }
                        })
                        .catch((err) => {
                            failedAttemptRef.current++;
                            setFailedAttemptCount(failedAttemptRef.current);
                            if (failedAttemptRef.current > 5) {
                                getGroupTableCount().then((result) => {
                                    let title = "";
                                    let message = "";
                                    switch (result) {
                                        case -1:
                                            // Couldn't connect or errored
                                            title = "Couldn't fetch group data";
                                            message =
                                                "First try refreshing the page. If the issue continues, please report it.";
                                            break;
                                        case 0:
                                            // No groups in table. Server offline?
                                            title = "No group data found";
                                            message =
                                                "The server appears to be online, but we've lost connection. Please try again later.";
                                            break;
                                        default:
                                            title = "Something went wrong";
                                            message =
                                                "Pretty descriptive, I know. First try refreshing the page. If the issue continues, please report it.";
                                            break;
                                    }
                                    props.triggerPopup({
                                        title: title,
                                        message: message,
                                        submessage: err && err.toString(),
                                        icon: "warning",
                                        fullscreen: false,
                                        reportMessage: `GL171 Group data generic error (timeout?): ${
                                            err && err.toString()
                                        }`,
                                    });
                                });
                            } else {
                                recheck = setTimeout(() => {
                                    RefreshLfms();
                                }, 250);
                            }
                        });
                }
            })
            .catch((err) => {
                failedAttemptRef.current++;
                setFailedAttemptCount(failedAttemptRef.current);
                if (failedAttemptRef.current > 5) {
                    props.triggerPopup({
                        title: "Couldn't fetch server data",
                        message:
                            "First try refreshing the page. If the issue continues, please report it.",
                        submessage:
                            (err && err.toString()) || "Server status timeout",
                        icon: "warning",
                        fullscreen: false,
                        reportMessage: `GL196 Server status generic errr (timeout?): ${
                            err && err.toString()
                        }`,
                    });
                } else {
                    recheck = setTimeout(() => {
                        RefreshLfms();
                    }, 250);
                }
            });
    }

    let refreshLfmsTimeout;
    React.useEffect(() => {
        clearInterval(refreshLfmsTimeout);
        RefreshLfms();
        refreshLfmsTimeout = setInterval(RefreshLfms, 15000);

        return function cleanup() {
            clearInterval(refreshLfmsTimeout);
        };
    }, [props.server]);

    React.useEffect(() => {
        if (unfilteredServerData === null) return;
        let groups = unfilteredServerData.Groups;
        let filteredgroups = [];
        groups.forEach((group) => {
            let levelpass =
                (group.MinimumLevel >= minimumLevel &&
                    group.MinimumLevel <= maximumLevel) ||
                (group.MaximumLevel >= minimumLevel &&
                    group.MaximumLevel <= maximumLevel) ||
                (group.MinimumLevel <= minimumLevel &&
                    group.MaximumLevel >= maximumLevel);
            group.Eligible = levelpass;
            if (levelpass || showNotEligible) {
                filteredgroups.push(group);
            }
        });
        setFilteredServerData({
            ...unfilteredServerData,
            Groups: filteredgroups.sort((a, b) =>
                sortAscending
                    ? a.MinimumLevel - b.MinimumLevel
                    : b.MinimumLevel - a.MinimumLevel
            ),
        });
    }, [
        unfilteredServerData,
        minimumLevel,
        maximumLevel,
        sortAscending,
        showNotEligible,
    ]);

    function handleCanvasSort() {
        sortAscendingRef.current = !sortAscendingRef.current;
        if (!props.minimal) {
            localStorage.setItem("sort-order", sortAscendingRef.current);
        }
        setSortAscending((sortAscending) => !sortAscending);
    }

    function IsExpanded(group) {
        let val = false;
        expandedGroups.forEach((g) => {
            if (g.Leader.Name === group.Leader.Name) val = true;
        });
        return val;
    }
    var [expandedGroups, set_expandedGroups] = React.useState([]);

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

        let showcompletionpercentage = localStorage.getItem(
            "completion-percentage"
        );
        setShowCompletionPercentage(
            showcompletionpercentage !== null
                ? showcompletionpercentage === "true"
                : false
        );

        let showmembercount = localStorage.getItem("member-count");
        setShowMemberCount(
            showmembercount !== null ? showmembercount === "true" : true
        );

        let showquestguesses = localStorage.getItem("quest-guess");
        setShowQuestGuesses(
            showquestguesses !== null ? showquestguesses === "true" : true
        );
    }, []);

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

    return (
        <div
            className={
                "content-container" +
                `${props.minimal ? " hide-on-mobile" : ""}`
            }
            style={{ minHeight: "700px", width: "848px" }}
        >
            <FilterBar
                minimal={props.minimal}
                currentServer={props.server}
                showNotifications={false}
                showSave={true}
                maxWidth={848}
                returnTo="/grouping"
                handleFilterButton={() =>
                    setFilterPanelVisible(!filterPanelVisible)
                }
                handleSaveButton={() => download()}
                closePanel={() => props.closePanel()}
                permalink={props.permalink}
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
                    <ContentCluster title="Filter Groups" smallBottomMargin>
                        <div style={{ padding: "15px" }}>
                            <LevelRangeSlider
                                handleChange={(e) => {
                                    if (e.length) {
                                        if (!props.minimal) {
                                            localStorage.setItem(
                                                "minimum-level",
                                                e[0]
                                            );
                                            localStorage.setItem(
                                                "maximum-level",
                                                e[1]
                                            );
                                        }
                                        setMinimumLevel(e[0]);
                                        setMaximumLevel(e[1]);
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
                                        if (!props.minimal) {
                                            localStorage.setItem(
                                                "show-not-eligible",
                                                !showNotEligible
                                            );
                                        }
                                        setShowNotEligible(!showNotEligible);
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
                                        if (!props.minimal) {
                                            localStorage.setItem(
                                                "sort-order",
                                                !sortAscending
                                            );
                                        }
                                        setSortAscending(!sortAscending);
                                    }}
                                />
                                Sort groups ascending
                            </label>
                        </div>
                    </ContentCluster>
                    <ContentCluster title="Accessibility" smallBottomMargin>
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
                                    name="classiclook"
                                    type="checkbox"
                                    checked={alternativeLook}
                                    onChange={() => {
                                        if (!props.minimal) {
                                            localStorage.setItem(
                                                "alternative-lfm-look",
                                                !alternativeLook
                                            );
                                        }
                                        setAlternativeLook(!alternativeLook);
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
                                        if (!props.minimal) {
                                            localStorage.setItem(
                                                "high-visibility",
                                                !highVisibility
                                            );
                                        }
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
                                        if (!props.minimal) {
                                            localStorage.setItem(
                                                "font-modifier",
                                                fontModifier === 0 ? 5 : 0
                                            );
                                        }
                                        setFontModifier(
                                            fontModifier === 0 ? 5 : 0
                                        );
                                    }}
                                />
                                Large Font
                            </label>
                        </div>
                    </ContentCluster>
                    <ContentCluster title="Add-ons" smallBottomMargin>
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
                                    name="completionpercentage"
                                    type="checkbox"
                                    checked={showCompletionPercentage}
                                    onChange={() => {
                                        if (!props.minimal) {
                                            localStorage.setItem(
                                                "completion-percentage",
                                                !showCompletionPercentage
                                            );
                                        }
                                        setShowCompletionPercentage(
                                            !showCompletionPercentage
                                        );
                                    }}
                                />
                                Show Completion Progress Bar
                            </label>
                            <label className="filter-panel-group-option">
                                <input
                                    className="input-radio"
                                    name="membercount"
                                    type="checkbox"
                                    checked={showMemberCount}
                                    onChange={() => {
                                        if (!props.minimal) {
                                            localStorage.setItem(
                                                "member-count",
                                                !showMemberCount
                                            );
                                        }
                                        setShowMemberCount(!showMemberCount);
                                    }}
                                />
                                Show Member Count
                            </label>
                            <label className="filter-panel-group-option">
                                <input
                                    className="input-radio"
                                    name="questguess"
                                    type="checkbox"
                                    checked={showQuestGuesses}
                                    onChange={() => {
                                        if (!props.minimal) {
                                            localStorage.setItem(
                                                "quest-guess",
                                                !showQuestGuesses
                                            );
                                        }
                                        setShowQuestGuesses(!showQuestGuesses);
                                    }}
                                />
                                Show Quest Guesses
                            </label>
                        </div>
                    </ContentCluster>
                </div>
            </FilterBar>
            <div className="sr-only">
                {`The image below is a live preview of ${getServerNamePossessive()} LFM panel where all groups are visible.`}
            </div>
            {serverStatus !== false || ignoreServerStatus ? (
                alternativeLook === false ? (
                    <CanvasLfmPanel
                        expandedInfo={false}
                        data={filteredServerData}
                        showNotEligible={showNotEligible}
                        adjustedGroupCount={adjustedGroupCount}
                        fontModifier={fontModifier}
                        highVisibility={highVisibility}
                        handleSort={() => handleCanvasSort()}
                        showCompletionPercentage={showCompletionPercentage}
                        showMemberCount={showMemberCount}
                        showQuestGuesses={showQuestGuesses}
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
                )
            ) : (
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        marginTop: "20px",
                        width: "100%",
                        maxWidth: "848px",
                    }}
                >
                    <span
                        style={{
                            fontSize: "1.6rem",
                            width: "100%",
                            textAlign: "center",
                            color: "var(--text)",
                        }}
                    >
                        <p
                            style={{
                                marginBottom: "0px",
                            }}
                        >
                            This server might be offline.
                            <br />
                            If you believe this to be an error,
                        </p>
                    </span>
                    <div
                        className="action-button-container"
                        style={{
                            width: "100%",
                            padding: "0px 20px",
                        }}
                    >
                        <div
                            className="primary-button should-invert full-width-mobile"
                            onClick={() => {
                                setIgnoreServerStatus(true);
                                RefreshLfms();
                            }}
                        >
                            Load data anyways
                        </div>
                        <div
                            className={
                                "secondary-button should-invert full-width-mobile" +
                                (reported ? " disabled" : "")
                            }
                            onClick={() => {
                                if (reported === false) {
                                    Submit(
                                        "User reported issue from grouping/" +
                                            props.server,
                                        "[Internal] Reported 'server offline' message"
                                    );
                                    setReported(true);
                                }
                            }}
                        >
                            {reported ? "Thanks!" : "Report Issue"}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Panel;
