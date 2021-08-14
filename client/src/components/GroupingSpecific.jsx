import React from "react";
import { Helmet } from "react-helmet";
import { useLocation } from "react-router-dom";
import Card from "../components/Card";
import ReportIssueForm from "./ReportIssueForm";
import PopupMessage from "./global/PopupMessage";
import MiniGroup from "./MiniGroup";
import CanvasLfmPanel from "./CanvasLfmPanel";
import LfmFilter from "./LfmFilterBar";
import LevelRangeSlider from "./LevelRangeSlider";
import { Fetch, VerifyLfmData } from "./DataLoader";
import Group from "./Group";

const TITLE = "DDO Live LFM Viewer";

const serverNames = [
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

const GroupingSpecific = (props) => {
    // Data
    var [currentServer, set_currentServer] = React.useState(null);
    var [groupDataMaster, set_groupDataMaster] = React.useState(null);
    var [groupDataServer, set_groupDataServer] = React.useState({
        timestamp: 0,
        data: null,
    });
    var [groupCount, set_groupCount] = React.useState(null);
    var [adjustedGroupCount, set_adjustedGroupCount] = React.useState(4);
    var [serverStatusData, set_serverStatusData] = React.useState(null);
    var [isServerOnline, set_isServerOnline] = React.useState(null);
    var [eligibleCount, set_eligibleCount] = React.useState(null);
    // var [failedFetchAttempts, set_failedFetchAttempts] = React.useState(0);

    var [attemptedServerStatusFetch, set_attemptedServerStatusFetch] =
        React.useState(false);
    var [attemptedGroupDataFetch, set_attemptedGroupDataFetch] =
        React.useState(false);

    var [lastFetchTime, set_lastFetchTime] = React.useState(null);

    // Settings
    var [fontModifier, set_fontModifier] = React.useState(0);
    var [highVisibility, set_highVisibility] = React.useState(false);
    var [filterPanelVisible, set_filterPanelVisible] = React.useState(false);
    var [alternativeLook, set_alternativeLook] = React.useState(false);
    var [theme, set_theme] = React.useState(true);

    var [expandedGroups, set_expandedGroups] = React.useState([]);

    // LFM filters
    var [minimumLevel, set_minimumLevel] = React.useState(1);
    var [maximumLevel, set_maximumLevel] = React.useState(30);
    var [showNotEligible, set_showNotEligible] = React.useState(true);
    var [sortAscending, set_sortAscending] = React.useState(false);
    var [difficulty, set_difficulty] = React.useState([
        true,
        true,
        true,
        true,
        true,
    ]);

    function IsExpanded(group) {
        let val = false;
        expandedGroups.forEach((g) => {
            if (g.Leader.Name === group.Leader.Name) val = true;
        });
        return val;
    }

    function ToggleTheme() {
        let theme = localStorage.getItem("theme");
        if (theme === "light-theme") {
            theme = "dark";

            document.body.classList.replace("light-theme", "dark-theme");
            localStorage.setItem("theme", "dark-theme");
            set_theme("dark-theme");
        } else {
            theme = "light";

            document.body.classList.replace("dark-theme", "light-theme");
            localStorage.setItem("theme", "light-theme");
            set_theme("light-theme");
        }
    }

    React.useEffect(() => {
        // Load local storage
        let theme = localStorage.getItem("theme");
        set_theme(theme);

        let minlevel = localStorage.getItem("minimum-level");
        set_minimumLevel(minlevel || 1);

        let maxlevel = localStorage.getItem("maximum-level");
        set_maximumLevel(maxlevel || 30);

        let shownoteligible = localStorage.getItem("show-not-eligible");
        set_showNotEligible(
            shownoteligible !== null ? shownoteligible === "true" : true
        );

        let sortascending = localStorage.getItem("sort-order");
        set_sortAscending(
            sortascending !== null ? sortascending === "true" : true
        );

        let alternativelook = localStorage.getItem("alternative-look");
        set_alternativeLook(
            alternativelook !== null ? alternativelook === "true" : false
        );

        let highvisibility = localStorage.getItem("high-visibility");
        set_highVisibility(
            highvisibility !== null ? highvisibility === "true" : false
        );

        let fontmodifier = localStorage.getItem("font-modifier");
        set_fontModifier(fontmodifier !== null ? +fontmodifier : 0);

        // async function fetchArbitraryData(url, type) {
        //     let response = await fetch(url);
        //     if (type === "json") response = await response.json();
        //     else if (type === "text") response = await response.text();
        //     return response;
        // }

        // async function run(timeout) {
        //     let ret = new Promise(async (resolve, reject) => {
        //         setTimeout(() => {
        //             if (!ret.isResolved) {
        //                 reject();
        //             }
        //         }, timeout);

        //         await fetchArbitraryData(
        //             "https://www.playeraudit.com/api/groups",
        //             "json"
        //         )
        //             .then((val) => {
        //                 set_lastFetchTime(Date.now());
        //                 set_attemptedGroupDataFetch(true);
        //                 // Data verification
        //                 if (val === null) return;
        //                 if (val.length !== 9) return;
        //                 let missingfields = false;
        //                 val.forEach((server) => {
        //                     if (server.Name === undefined) missingfields = true;
        //                     if (server.LastUpdateTime === undefined)
        //                         missingfields = true;
        //                     if (server.Groups === undefined)
        //                         missingfields = true;
        //                     if (server.GroupCount === undefined)
        //                         missingfields = true;
        //                 });
        //                 if (missingfields) return;

        //                 resolve(val);
        //             })
        //             .catch((val) => {
        //                 set_lastFetchTime(Date.now());
        //                 set_attemptedGroupDataFetch(true);
        //                 // console.error("Failed to fetch group data");
        //             });
        //     });
        //     return ret;
        // }
        var failedAttemptCount = 5;

        function FetchLfmData() {
            Fetch("https://www.playeraudit.com/api/groups", 5000)
                .then((val) => {
                    set_lastFetchTime(Date.now());
                    set_attemptedGroupDataFetch(true);
                    if (VerifyLfmData(val)) {
                        set_popupMessages([]);
                        failedAttemptCount = 0;
                        set_groupDataMaster(val);
                    } else {
                        failedAttemptCount++;
                        if (failedAttemptCount > 5) {
                            set_popupMessages([
                                ...popupMessages,
                                {
                                    title: "Something went wrong",
                                    message:
                                        "Pretty descriptive, I know. Try refreshing the page. If the issue continues, please report it.",
                                    icon: "warning",
                                    fullscreen: false,
                                    reportMessage:
                                        JSON.stringify(val) ||
                                        "Group data returned null",
                                },
                            ]);
                        }
                    }
                })
                .catch(() => {
                    failedAttemptCount++;
                    set_lastFetchTime(Date.now());
                    set_attemptedGroupDataFetch(true);
                    if (failedAttemptCount > 5) {
                        set_popupMessages([
                            ...popupMessages,
                            {
                                title: "We're stuck on a loading screen",
                                message:
                                    "This is taking longer than usual. You can refresh the page or report the issue.",
                                icon: "warning",
                                fullscreen: false,
                                reportMessage:
                                    "Could not fetch Group data. Timeout",
                            },
                        ]);
                    }
                });
        }
        FetchLfmData();

        const refreshdata = setInterval(() => {
            FetchLfmData();
        }, 8000);
        return () => clearInterval(refreshdata);

        // run(5000)
        //     .then((val) => {
        //         set_groupDataMaster(val);
        //     })
        //     .catch(function () {
        //         set_popupMessages([
        //             ...popupMessages,
        //             {
        //                 title: "We're stuck on a loading screen",
        //                 message:
        //                     "This is taking longer than usual. You can refresh the page or report the issue.",
        //                 icon: "warning",
        //                 fullscreen: false,
        //                 reportMessage: "This is the report message",
        //             },
        //         ]);
        //     });

        // var failedAttemptCount = 0;
        // const interval = setInterval(() => {
        //     set_failedFetchAttempts(failedFetchAttempts + 1);
        //     run(10000)
        //         .then((val) => {
        //             set_groupDataMaster(val);
        //             set_popupMessages([]);
        //             failedAttemptCount = 0;
        //         })
        //         .catch(function () {
        //             failedAttemptCount++;
        //             if (failedAttemptCount === 8) {
        //                 set_popupMessages([
        //                     {
        //                         title: "We're stuck on a loading screen",
        //                         message:
        //                             "This is taking longer than usual. You can refresh the page or report the issue.",
        //                         icon: "warning",
        //                         fullscreen: false,
        //                         reportMessage: "This is the report message",
        //                     },
        //                 ]);
        //             }
        //         });
        // }, 8000);
        // return () => clearInterval(interval);
    }, []);

    React.useEffect(() => {
        if (currentServer === null) return;
        async function fetchArbitraryData(url, type) {
            let response = await fetch(url);
            if (type === "json") response = await response.json();
            else if (type === "text") response = await response.text();
            return response;
        }

        fetchArbitraryData(
            "https://www.playeraudit.com/api/serverstatus",
            "json"
        )
            .then((val) => {
                set_attemptedServerStatusFetch(true);
                if (val === null || val.Worlds === undefined) {
                    set_serverStatusData(null);
                    return;
                }
                val.Worlds.forEach((server) => {
                    if (server === null) return;
                    if (
                        server.Name !== undefined &&
                        server.Status !== undefined
                    ) {
                        if (server.Name === currentServer) {
                            set_isServerOnline = server.Status;
                        }
                    }
                });
                set_serverStatusData(val);
            })
            .catch(() => {
                set_attemptedServerStatusFetch(true);
                set_serverStatusData(null);
            });
    }, [currentServer]);

    React.useEffect(() => {
        if (!attemptedServerStatusFetch || !attemptedGroupDataFetch) return;

        // At this point we've fetched (or at least attempted to) server
        //  status and group data.

        if (groupDataMaster !== null) {
            if (groupDataMaster.length === 9) {
                return;
            }
        }

        let specialComment =
            "Ooops, we've broken something! I'm probably working on a fix. Unless I'm asleep. Then I'm almost certainly not.";
        if (serverStatusData !== null) {
            if (serverStatusData.Worlds !== undefined) {
                if (serverStatusData.Worlds.length > 0) {
                    let serverData = serverStatusData.Worlds.filter((world) => {
                        return world.Name === currentServer;
                    });
                    if (serverData.length === 1) {
                        if (serverData[0].Status) {
                            specialComment =
                                "This server is online, but we've lost connection. We'll be back in a bit.";
                        } else {
                            specialComment =
                                "This server appears to be offline. Check back in a bit.";
                        }
                    }
                }
            }
        }

        set_groupDataServer({
            timestamp: Date.now(),
            data: {
                ServerName: currentServer,
                Groups: [
                    {
                        Leader: {
                            Name: "DDO Audit",
                            Gender: "Male",
                            Race: "Human",
                            Location: {
                                Name: "Somewhere in the aether",
                                IsPublicSpace: 0,
                                HexId: 0,
                            },
                        },
                        Members: [],
                        Eligible: true,
                        Comment: specialComment,
                        Quest: {
                            Name: "Feed the Hamsters",
                        },
                        Difficulty: "Reaper 11",
                    },
                ],
            },
        });
    }, [
        groupDataMaster,
        serverStatusData,
        attemptedServerStatusFetch,
        attemptedGroupDataFetch,
        lastFetchTime,
    ]);

    React.useEffect(() => {
        if (groupDataMaster) {
            let total = 0;
            groupDataMaster.forEach((server) => {
                if (server !== null) {
                    if (
                        server.Name.toLowerCase() ===
                        currentServer.toLowerCase()
                    ) {
                        total += server.GroupCount;
                    }
                }
            });
            set_groupCount(total);

            // Get this server's data from the master data
            var serverdata = groupDataMaster.filter((server) => {
                if (server === null) return false;
                return (
                    server.Name.toLowerCase() === currentServer.toLowerCase()
                );
            });
            if (serverdata !== null && serverdata.length > 0) {
                serverdata = serverdata[0];
            }

            // Tag eiligibility status
            serverdata.Groups.forEach((group) => {
                let levelpass =
                    minimumLevel <= group.MaximumLevel &&
                    group.MinimumLevel <= maximumLevel;

                group.Eligible = levelpass;
            });

            // Sort based on the user's sortOrder
            serverdata.Groups.sort(function (a, b) {
                return (
                    (a.MaximumLevel === b.MaximumLevel
                        ? a.Leader.Name > b.Leader.Name
                        : a.MaximumLevel > b.MaximumLevel) ^
                    (sortAscending === true ? 1 : -1)
                );
            });

            let eligiblegroupcount = 0;
            if (showNotEligible && alternativeLook === false) {
                eligiblegroupcount = serverdata.Groups.length;
            } else {
                serverdata.Groups.forEach((group) => {
                    if (group.Eligible) eligiblegroupcount++;
                });
            }
            set_eligibleCount(eligiblegroupcount);
            let adjustedCount = Math.max(4, eligiblegroupcount);
            set_adjustedGroupCount(adjustedCount);

            set_lastFetchTime(Date.now());
            console.log("Data update");
            set_groupDataServer({ timestamp: Date.now(), data: serverdata });
        } else {
            set_groupCount(0);
        }
    }, [
        groupDataMaster,
        currentServer,
        minimumLevel,
        maximumLevel,
        showNotEligible,
        sortAscending,
        difficulty,
    ]);

    const location = useLocation().pathname.substring(
        useLocation().pathname.lastIndexOf("/") + 1
    );

    React.useEffect(() => {
        let serverName =
            location.substring(0, 1).toUpperCase() + location.substring(1);
        if (serverNames.includes(serverName)) {
            // Good server
            set_currentServer(serverName);
        } else {
            // Bad server
            set_currentServer(serverNames[0]); // Just default to the first server in the good list
        }
    }, [props.location]);

    function GetSnarkyMessage() {
        if (groupCount === 0) {
            return "You're going to have to post your own.";
        } else if (groupCount <= 2) {
            return "You don't have many options.";
        } else {
            return "If you're not in one, you're missing out!";
        }
    }

    // Report Form
    var [reportFormVisibility, setReportFormVisibility] =
        React.useState("none");
    var [reportFormReference, setReportFormReference] = React.useState(null);
    function showReportForm(reference) {
        // Grab relevant info from the tile element that's being reported
        let referenceInfo = {
            title: reference.title,
            type: reference.chartType,
            displayType: reference.displayType,
            trendType: reference.trendType,
            showActions: reference.showActions,
            precomment: reference.precomment,
            //data: reference.chartData,
        };
        // Show the report form
        setReportFormReference(referenceInfo);
        setReportFormVisibility("block");
    }
    function hideReportForm() {
        setReportFormVisibility("none");
    }
    function report(reference, custom) {
        showReportForm({
            title: "LFM Viewer",
            precomment: custom,
            chartType: null,
            displayType: null,
            trendType: null,
            showActions: null,
        });
    }

    // Popup message
    var [popupMessages, set_popupMessages] = React.useState([]);

    return (
        currentServer && (
            <div>
                <Helmet>
                    <title>{TITLE}</title>
                    <meta
                        name="description"
                        content="Browse LFMs from any server with a live LFM panel! Check the LFM panel before you login, or setup notifications and never miss raid night again!"
                    />
                </Helmet>
                <ReportIssueForm
                    page={"grouping/" + currentServer.toLowerCase()}
                    showLink={false}
                    visibility={reportFormVisibility}
                    componentReference={reportFormReference}
                    hideReportForm={hideReportForm}
                />
                <PopupMessage
                    page={"grouping/" + currentServer.toLowerCase()}
                    messages={popupMessages}
                    popMessage={() => {
                        if (popupMessages.length) {
                            let newMessages = [...popupMessages];
                            newMessages = newMessages.slice(1);
                            set_popupMessages(newMessages);
                        }
                    }}
                />
                <Card
                    pageName={"grouping/" + currentServer.toLowerCase()}
                    showLink={false}
                    title={"Currently on " + currentServer}
                    className="grouping"
                    hideTitleOnMobile={true}
                    subtitle={
                        groupDataMaster ? (
                            <div className="grouping-subtitle">
                                There {groupCount === 1 ? "is" : "are"}{" "}
                                currently{" "}
                                <span className="lfm-number">{groupCount}</span>{" "}
                                group{groupCount === 1 ? "" : "s"} posted.{" "}
                                {GetSnarkyMessage()}
                            </div>
                        ) : (
                            <div>Loading group data...</div>
                        )
                    }
                    reportReference={showReportForm}
                >
                    <div
                        style={{
                            width: "100%",
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                            alignItems: "center",
                        }}
                    >
                        <LfmFilter
                            currentServer={currentServer}
                            handleFilterButton={() =>
                                set_filterPanelVisible(!filterPanelVisible)
                            }
                        >
                            <div
                                className="filter-panel-overlay"
                                style={{
                                    display: filterPanelVisible
                                        ? "block"
                                        : "none",
                                }}
                                onClick={() => set_filterPanelVisible(false)}
                            />
                            <div
                                className="filter-panel"
                                style={{
                                    display: filterPanelVisible
                                        ? "block"
                                        : "none",
                                    padding: "10px",
                                }}
                            >
                                <div
                                    className="filter-panel-group"
                                    style={{ marginBottom: "10px" }}
                                >
                                    <h4>Filter Groups</h4>
                                    <div style={{ padding: "15px" }}>
                                        <LevelRangeSlider
                                            handleChange={(e) => {
                                                if (e.length) {
                                                    set_minimumLevel(e[0]);
                                                    set_maximumLevel(e[1]);
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
                                                    set_showNotEligible(
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
                                                checked={!sortAscending}
                                                onChange={() => {
                                                    localStorage.setItem(
                                                        "sort-order",
                                                        !sortAscending
                                                    );
                                                    set_sortAscending(
                                                        !sortAscending
                                                    );
                                                }}
                                            />
                                            Sort groups ascending
                                        </label>
                                    </div>
                                </div>
                                <div className="filter-panel-group">
                                    <h4>Accessibility</h4>
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
                                                    ToggleTheme();
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
                                                        "alternative-look",
                                                        !alternativeLook
                                                    );
                                                    set_alternativeLook(
                                                        !alternativeLook
                                                    );
                                                }}
                                            />
                                            Alternative View (easier to see on
                                            mobile)
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
                                                    set_highVisibility(
                                                        !highVisibility
                                                    );
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
                                                        fontModifier === 0
                                                            ? 5
                                                            : 0
                                                    );
                                                    set_fontModifier(
                                                        fontModifier === 0
                                                            ? 5
                                                            : 0
                                                    );
                                                }}
                                            />
                                            Large Font
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </LfmFilter>
                        {alternativeLook === false ? (
                            <CanvasLfmPanel
                                data={groupDataServer}
                                showNotEligible={showNotEligible}
                                adjustedGroupCount={adjustedGroupCount}
                                fontModifier={fontModifier}
                                highVisibility={highVisibility}
                                // showNotEligible={showNotEligible}
                                // sortOrder={sortOrder}
                                // minimumLevel={minimumLevel}
                                // maximumLevel={maximumLevel}
                            ></CanvasLfmPanel>
                        ) : (
                            <div className="social-container">
                                {groupDataServer.data &&
                                    groupDataServer.data.Groups.map(
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
                                                                            g
                                                                                .Leader
                                                                                .Name !==
                                                                            group
                                                                                .Leader
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
                                    )}
                                {eligibleCount === 0 && (
                                    <span
                                        style={{
                                            fontSize: "1.6rem",
                                            width: "100%",
                                            textAlign: "center",
                                        }}
                                    >
                                        No groups meet your current filter
                                        settings
                                    </span>
                                )}
                            </div>
                        )}
                    </div>
                </Card>
            </div>
        )
    );
};

export default GroupingSpecific;
