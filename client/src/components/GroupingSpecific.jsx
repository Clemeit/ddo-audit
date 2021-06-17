import React from "react";
import { Helmet } from "react-helmet";
import { useLocation } from "react-router-dom";
import Card from "../components/Card";
import ReportIssueForm from "./ReportIssueForm";
import PopupMessage from "./PopupMessage";
import MiniGroup from "./MiniGroup";
import CanvasLfmPanel from "./CanvasLfmPanel";
import LfmFilter from "./LfmFilterBar";
import LevelRangeSlider from "./LevelRangeSlider";

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
    var [groupDataServer, set_groupDataServer] = React.useState(null);
    var [groupCount, set_groupCount] = React.useState(null);
    var [adjustedGroupCount, set_adjustedGroupCount] = React.useState(4);
    var [serverStatusData, set_serverStatusData] = React.useState(null);
    var [isServerOnline, set_isServerOnline] = React.useState(null);
    var [failedFetchAttempts, set_failedFetchAttempts] = React.useState(0);

    var [attemptedServerStatusFetch, set_attemptedServerStatusFetch] =
        React.useState(false);
    var [attemptedGroupDataFetch, set_attemptedGroupDataFetch] =
        React.useState(false);

    var [lastFetchTime, set_lastFetchTime] = React.useState(null);

    // Settings
    var [fontModifier, set_fontModifier] = React.useState(0);
    var [highVisibility, set_highVisibility] = React.useState(false);
    var [filterPanelVisible, set_filterPanelVisible] = React.useState(false);

    // LFM filters
    var [minimumLevel, set_minimumLevel] = React.useState(1);
    var [maximumLevel, set_maximumLevel] = React.useState(30);
    var [showNotEligible, set_showNotEligible] = React.useState(true);
    var [sortOrder, set_sortOrder] = React.useState(0);
    var [difficulty, set_difficulty] = React.useState([
        true,
        true,
        true,
        true,
        true,
    ]);

    React.useEffect(() => {
        async function fetchArbitraryData(url, type) {
            let response = await fetch(url);
            if (type === "json") response = await response.json();
            else if (type === "text") response = await response.text();
            return response;
        }

        async function run(timeout) {
            let ret = new Promise(async (resolve, reject) => {
                setTimeout(() => {
                    if (!ret.isResolved) {
                        reject();
                    }
                }, timeout);

                await fetchArbitraryData(
                    "https://www.playeraudit.com/api/groups",
                    "json"
                )
                    .then((val) => {
                        set_lastFetchTime(Date.now());
                        set_attemptedGroupDataFetch(true);
                        // Data verification
                        if (val === null) return;
                        if (val.length !== 9) return;
                        let missingfields = false;
                        val.forEach((server) => {
                            if (server.Name === undefined) missingfields = true;
                            if (server.LastUpdateTime === undefined)
                                missingfields = true;
                            if (server.Groups === undefined)
                                missingfields = true;
                            if (server.GroupCount === undefined)
                                missingfields = true;
                        });
                        if (missingfields) return;

                        resolve(val);
                    })
                    .catch((val) => {
                        set_lastFetchTime(Date.now());
                        set_attemptedGroupDataFetch(true);
                        // console.error("Failed to fetch group data");
                    });
            });
            return ret;
        }
        run(5000)
            .then((val) => {
                set_groupDataMaster(val);
            })
            .catch(function () {
                set_popupMessages([
                    ...popupMessages,
                    {
                        title: "We're stuck on a loading screen",
                        message:
                            "This is taking longer than usual. You can refresh the page or report the issue.",
                        icon: "warning",
                        fullscreen: false,
                        reportMessage: "This is the report message",
                    },
                ]);
            });

        var failedAttemptCount = 0;
        const interval = setInterval(() => {
            set_failedFetchAttempts(failedFetchAttempts + 1);
            run(10000)
                .then((val) => {
                    set_groupDataMaster(val);
                    set_popupMessages([]);
                    failedAttemptCount = 0;
                })
                .catch(function () {
                    failedAttemptCount++;
                    if (failedAttemptCount === 8) {
                        set_popupMessages([
                            {
                                title: "We're stuck on a loading screen",
                                message:
                                    "This is taking longer than usual. You can refresh the page or report the issue.",
                                icon: "warning",
                                fullscreen: false,
                                reportMessage: "This is the report message",
                            },
                        ]);
                    }
                });
        }, 8000);
        return () => clearInterval(interval);
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
                console.log(currentServer);
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
            ServerName: currentServer,
            Groups: [
                {
                    Leader: {
                        Name: "DDO Audit",
                        Gender: "Male",
                        Race: "Human",
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
                        : a.MaximumLevel > b.MaximumLevel) ^ sortOrder
                );
            });

            let eligiblegroupcount = 0;
            if (showNotEligible) {
                eligiblegroupcount = serverdata.Groups.length;
            } else {
                serverdata.Groups.forEach((group) => {
                    if (group.Eligible) eligiblegroupcount++;
                });
            }
            let adjustedCount = Math.max(4, eligiblegroupcount);
            set_adjustedGroupCount(adjustedCount);

            set_lastFetchTime(Date.now());
            set_groupDataServer(serverdata);
        } else {
            set_groupCount(0);
        }
    }, [
        groupDataMaster,
        currentServer,
        minimumLevel,
        maximumLevel,
        showNotEligible,
        sortOrder,
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
                        <CanvasLfmPanel
                            internalUpdate={lastFetchTime}
                            data={groupDataServer}
                            showNotEligible={showNotEligible}
                            adjustedGroupCount={adjustedGroupCount}
                            fontModifier={fontModifier}
                            highVisibility={highVisibility}
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
                                    onClick={() =>
                                        set_filterPanelVisible(false)
                                    }
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
                                                    }
                                                }}
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
                                                    onChange={() =>
                                                        set_showNotEligible(
                                                            !showNotEligible
                                                        )
                                                    }
                                                />
                                                Show groups I am not eligible
                                                for
                                            </label>
                                            <label className="filter-panel-group-option">
                                                <input
                                                    className="input-radio"
                                                    name="setsortorder"
                                                    type="checkbox"
                                                    checked={!sortOrder}
                                                    onChange={() =>
                                                        set_sortOrder(
                                                            !sortOrder
                                                        )
                                                    }
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
                                            <label className="filter-panel-group-option">
                                                <input
                                                    className="input-radio"
                                                    name="highvis"
                                                    type="checkbox"
                                                    checked={highVisibility}
                                                    onChange={() =>
                                                        set_highVisibility(
                                                            !highVisibility
                                                        )
                                                    }
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
                        </CanvasLfmPanel>
                    </div>
                </Card>
            </div>
        )
    );
};

export default GroupingSpecific;
