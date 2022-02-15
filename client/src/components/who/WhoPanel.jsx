import React from "react";
import { Fetch, VerifyPlayerData } from "../../services/DataLoader";
import Player from "./Player";
import { ReactComponent as CloseSVG } from "../../assets/global/close.svg";
import FilterBar from "../global/FilterBar";
import CanvasWhoPanel from "./CanvasWhoPanel";
import { Submit } from "../../services/ReportIssueService";
import ContentCluster from "../global/ContentCluster";

const WhoPanel = (props) => {
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

    const serverNamesLowercase = [
        "argonnessen",
        "cannith",
        "ghallanda",
        "khyber",
        "orien",
        "sarlona",
        "thelanis",
        "wayfinder",
        "hardcore",
    ];
    const PAGE_SIZE = 10;

    // Download canvas
    var download = function () {
        // Redraw panel without names
        var link = document.createElement("a");
        link.download = `ddo-who-panel.png`;
        link.href = document.getElementById("who-canvas").toDataURL();
        link.click();
    };

    // Data
    // const [currentServer, setCurrentServer] = React.useState(null);
    const [playerData, setPlayerData] = React.useState({
        timestamp: 0,
        data: null,
    });
    const [currentPopulation, setCurrentPopulation] = React.useState(null);
    const [currentAnonymous, setCurrentAnonymous] = React.useState(null);
    const [filteredPlayerData, setFilteredPlayerData] = React.useState(null);
    const [paginatedPlayerData, setPaginatedPlayerData] = React.useState(null);
    const [playerCount, setPlayerCount] = React.useState(null);
    const [adjustedPlayerCount, setAdjustedPlayerCount] = React.useState(null);
    const [lastFetchTime, setLastFetchTime] = React.useState(null);
    const [attemptedPlayerFetch, setAttemptedPlayerFetch] =
        React.useState(null);
    const [classFilterStates, setClassFilterStates] = React.useState([
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
    ]);
    const CLASS_NAMES = [
        "fighter",
        "paladin",
        "barbarian",
        "rogue",
        "ranger",
        "cleric",
        "wizard",
        "sorcerer",
        "bard",
        "monk",
        "favored soul",
        "artificer",
        "druid",
        "warlock",
        "alchemist",
    ];
    const [includeRegion, setIncludeRegion] = React.useState(false);
    const [exactMatch, setExactMatch] = React.useState(false);

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

    // Settings
    const [alternativeLook, setAlternativeLook] = React.useState(true);
    const [activeFilters, setActiveFilter] = React.useState([]);
    const [sortingMethod, setSortingMethod] = React.useState("level");
    const sortingMethodRef = React.useRef(sortingMethod);
    const [sortingDirection, setSortingDirection] = React.useState("ascending");
    const sortingDirectionRef = React.useRef(sortingDirection);

    const [pageNumber, setPageNumber] = React.useState(0);

    const [expandedPlayers, setExpandedPlayers] = React.useState([]);
    const [pinnedPlayers, setPinnedPlayers] = React.useState([]);

    const [filterPanelVisible, setFilterPanelVisible] = React.useState(false);

    const [theme, setTheme] = React.useState(true);
    function toggleTheme() {
        let theme = localStorage.getItem("theme");
        if (theme === "light-theme") {
            setTheme("dark");

            document.body.classList.replace("light-theme", "dark-theme");
            localStorage.setItem("theme", "dark-theme");
        } else {
            setTheme("light");

            document.body.classList.replace("dark-theme", "light-theme");
            localStorage.setItem("theme", "light-theme");
        }
    }

    const [characterNameFilter, setCharacterNameFilter] = React.useState("");
    const [guildNameFilter, setGuildNameFilter] = React.useState("");
    const [locationNameFilter, setLocationNameFilter] = React.useState("");
    const [minimumLevelFilter, setMinimumLevelFilter] = React.useState("");
    const [maximumLevelFilter, setMaximumLevelFilter] = React.useState("");

    function getLink() {
        let params = "";
        if (characterNameFilter) {
            if (!params) {
                params += "?";
            } else {
                params += "&";
            }
            params += "name=" + characterNameFilter;
        }
        if (guildNameFilter) {
            if (!params) {
                params += "?";
            } else {
                params += "&";
            }
            params += "guild=" + guildNameFilter;
        }
        if (locationNameFilter) {
            if (!params) {
                params += "?";
            } else {
                params += "&";
            }
            params += "location=" + locationNameFilter;
        }
        if (minimumLevelFilter) {
            if (!params) {
                params += "?";
            } else {
                params += "&";
            }
            params += "minlevel=" + minimumLevelFilter;
        }
        if (maximumLevelFilter) {
            if (!params) {
                params += "?";
            } else {
                params += "&";
            }
            params += "maxlevel=" + maximumLevelFilter;
        }
        return `https://www.ddoaudit.com/who/${props.server.toLowerCase()}${params}`;
    }

    const characterNameTimeoutRef = React.useRef();
    React.useEffect(() => {
        clearTimeout(characterNameTimeoutRef.current);
        characterNameTimeoutRef.current = setTimeout(() => {
            if (characterNameFilter) {
                setActiveFilter([
                    ...activeFilters.filter((filter) => filter.type !== "Name"),
                    {
                        type: "Name",
                        value: characterNameFilter,
                    },
                ]);
            } else {
                setActiveFilter([
                    ...activeFilters.filter((filter) => filter.type !== "Name"),
                ]);
            }
        }, 200);
    }, [characterNameFilter]);

    const guildNameTimeoutRef = React.useRef();
    React.useEffect(() => {
        clearTimeout(guildNameTimeoutRef.current);
        guildNameTimeoutRef.current = setTimeout(() => {
            if (guildNameFilter) {
                setActiveFilter([
                    ...activeFilters.filter(
                        (filter) => filter.type !== "Guild"
                    ),
                    {
                        type: "Guild",
                        value: guildNameFilter,
                    },
                ]);
            } else {
                setActiveFilter([
                    ...activeFilters.filter(
                        (filter) => filter.type !== "Guild"
                    ),
                ]);
            }
        }, 200);
    }, [guildNameFilter]);

    const locationNameTimeoutRef = React.useRef();
    React.useEffect(() => {
        clearTimeout(locationNameTimeoutRef.current);
        locationNameTimeoutRef.current = setTimeout(() => {
            if (locationNameFilter) {
                setActiveFilter([
                    ...activeFilters.filter(
                        (filter) => filter.type !== "Location"
                    ),
                    {
                        type: "Location",
                        value: locationNameFilter,
                    },
                ]);
            } else {
                setActiveFilter([
                    ...activeFilters.filter(
                        (filter) => filter.type !== "Location"
                    ),
                ]);
            }
        }, 200);
    }, [locationNameFilter]);

    const minimumLevelTimeoutRef = React.useRef();
    React.useEffect(() => {
        clearTimeout(minimumLevelTimeoutRef.current);
        minimumLevelTimeoutRef.current = setTimeout(() => {
            if (minimumLevelFilter) {
                setActiveFilter([
                    ...activeFilters.filter(
                        (filter) => filter.type !== "Min Level"
                    ),
                    {
                        type: "Min Level",
                        value: minimumLevelFilter,
                    },
                ]);
            } else {
                setActiveFilter([
                    ...activeFilters.filter(
                        (filter) => filter.type !== "Min Level"
                    ),
                ]);
            }
        }, 200);
    }, [minimumLevelFilter]);

    const maximumLevelTimeoutRef = React.useRef();
    React.useEffect(() => {
        clearTimeout(maximumLevelTimeoutRef.current);
        maximumLevelTimeoutRef.current = setTimeout(() => {
            if (maximumLevelFilter) {
                setActiveFilter([
                    ...activeFilters.filter(
                        (filter) => filter.type !== "Max Level"
                    ),
                    {
                        type: "Max Level",
                        value: maximumLevelFilter,
                    },
                ]);
            } else {
                setActiveFilter([
                    ...activeFilters.filter(
                        (filter) => filter.type !== "Max Level"
                    ),
                ]);
            }
        }, 200);
    }, [maximumLevelFilter]);

    function handleClassFilter(index) {
        // const temp = [...classFilterStates];
        // temp[index] = !temp[index];
        setClassFilterStates((classFilterStates) =>
            classFilterStates.map((r, i) =>
                i === index ? (r === true ? false : true) : r
            )
        );
    }

    function isEveryClassChecked() {
        let result = true;
        classFilterStates.forEach((state) => {
            if (!state) result = false;
        });
        // console.log(result);
        return result;
    }

    function handleAnyClass() {
        // if (isEveryClassChecked()) {
        //     setClassFilterStates([
        //         false,
        //         false,
        //         false,
        //         false,
        //         false,
        //         false,
        //         false,
        //         false,
        //         false,
        //         false,
        //         false,
        //         false,
        //         false,
        //         false,
        //         false,
        //     ]);
        // } else {
        setClassFilterStates([
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
        ]);
        // }
    }

    function handleIncludeRegion() {
        setIncludeRegion((includeRegion) => !includeRegion);
    }

    function handleExactMatch() {
        setExactMatch((exactMatch) => !exactMatch);
    }

    function handleCanvasSort(type) {
        if (sortingMethodRef.current == type) {
            setSortingDirection((sortingDirection) =>
                sortingDirection === "ascending" ? "descending" : "ascending"
            );
        } else {
            setSortingDirection("ascending");
            setSortingMethod(type);
            sortingMethodRef.current = type;
        }
    }

    function ApplyFilters(data) {
        // Apply sorting
        if (sortingMethod === "level") {
            if (sortingDirection === "ascending") {
                data.sort((a, b) => a.TotalLevel - b.TotalLevel);
            } else {
                data.sort((a, b) => b.TotalLevel - a.TotalLevel);
            }
        } else if (sortingMethod === "guild") {
            if (sortingDirection === "ascending") {
                data.sort((a, b) => a.Guild.localeCompare(b.Guild));
            } else {
                data.sort((a, b) => b.Guild.localeCompare(a.Guild));
            }
        } else if (sortingMethod === "location") {
            if (sortingDirection === "ascending") {
                data.sort((a, b) => {
                    if (a.Location.Name == null || b.Location.Name == null)
                        return 0;
                    return a.Location.Name.localeCompare(b.Location.Name);
                });
            } else {
                data.sort((a, b) => {
                    if (a.Location.Name == null || b.Location.Name == null)
                        return 0;
                    return b.Location.Name.localeCompare(a.Location.Name);
                });
            }
        } else if (sortingMethod === "inparty") {
            if (sortingDirection === "ascending") {
                data.sort((a, b) => a.InParty - b.InParty);
            } else {
                data.sort((a, b) => b.InParty - a.InParty);
            }
        } else if (sortingMethod === "class") {
            if (sortingDirection === "ascending") {
                data.sort((a, b) => {
                    let astring = "";
                    a.Classes.forEach((c) => {
                        astring = astring + (c.Name || "");
                    });
                    let bstring = "";
                    b.Classes.forEach((c) => {
                        bstring = bstring + (c.Name || "");
                    });
                    return astring.localeCompare(bstring);
                });
            } else {
                data.sort((a, b) => {
                    let astring = "";
                    a.Classes.forEach((c) => {
                        astring = astring + (c.Name || "");
                    });
                    let bstring = "";
                    b.Classes.forEach((c) => {
                        bstring = bstring + (c.Name || "");
                    });
                    return bstring.localeCompare(astring);
                });
            }
        } else {
            if (sortingDirection === "ascending") {
                data.sort((a, b) => a.Name.localeCompare(b.Name));
            } else {
                data.sort((a, b) => b.Name.localeCompare(a.Name));
            }
        }

        // Apply filters
        data = data.filter(
            (player) => player.Name !== "Anonymous" && player.Name !== ""
        );

        // if (activeFilters !== null && activeFilters.length !== 0) {
        data = data.filter((player) => {
            let pass = true;
            activeFilters.forEach((filter) => {
                switch (filter.type) {
                    case "Name":
                        if (
                            !player.Name.toLowerCase().includes(
                                filter.value.toLowerCase()
                            )
                        )
                            pass = false;
                        break;
                    case "Guild":
                        if (
                            !player.Guild.toLowerCase().includes(
                                filter.value.toLowerCase()
                            )
                        )
                            pass = false;
                        break;
                    case "Location":
                        if (player.Location.Name == null) {
                            pass = false;
                        } else {
                            if (
                                !player.Location.Name.toLowerCase().includes(
                                    filter.value.toLowerCase()
                                )
                            )
                                pass = false;
                        }
                        break;
                    case "Group":
                        if (player.GroupId !== filter.value) pass = false;
                        break;
                    case "Min Level":
                        if (player.TotalLevel < filter.value) pass = false;
                        break;
                    case "Max Level":
                        if (player.TotalLevel > filter.value) pass = false;
                        break;
                }
            });
            let classresult = false;
            classFilterStates.forEach((cls, index) => {
                if (cls === true) {
                    let result = false;
                    player.Classes.forEach((playercls) => {
                        if (playercls.Name !== null) {
                            if (
                                playercls.Name.toLowerCase() ===
                                CLASS_NAMES[index].toLowerCase()
                            ) {
                                result = true;
                            }
                        }
                    });
                    if (result === true) classresult = true;
                }
            });
            if (classresult === false) pass = false;
            return pass;
        });
        // } else {
        //     // Pull out starred players to be inserted at the top later
        //     let starredplayers = data.filter((p) => IsStarred(p));
        //     data = data.filter((p) => !IsStarred(p));
        //     data = [...starredplayers, ...data];
        // }

        // Pull out starred players to be inserted at the top later
        let starredplayers = data.filter((p) => IsStarred(p));
        data = data.filter((p) => !IsStarred(p));
        data = [...starredplayers, ...data];

        return data;
    }

    function IsExpanded(player) {
        let val = false;
        expandedPlayers.forEach((p) => {
            if (p.Name === player.Name) val = true;
        });
        return val;
    }

    function IsStarred(player) {
        let val = false;
        pinnedPlayers.forEach((p) => {
            if (p.name === player.Name && p.server === currentServer)
                val = true;
        });
        return val;
    }

    // const location = useLocation().pathname.substring(
    //     useLocation().pathname.lastIndexOf("/") + 1
    // );

    // React.useEffect(() => {
    //     let serverName =
    //         location.substring(0, 1).toUpperCase() + location.substring(1);
    //     if (serverNames.includes(serverName)) {
    //         // Good server
    //         setCurrentServer(serverName);
    //     } else {
    //         // Bad server
    //         setCurrentServer(serverNames[0]); // Just default to the first server in the good list
    //     }
    // }, [window.location.pathname]);

    React.useEffect(() => {
        // Load local storage
        let theme = localStorage.getItem("theme");
        setTheme(theme);

        let alternativelook = localStorage.getItem("alternative-who-look");
        setAlternativeLook(
            alternativelook !== null ? alternativelook === "true" : false
        );

        // Load filters from URL
        let urlfilters = new URLSearchParams(window.location.search);
        let urlname = urlfilters.get("name");
        let urlguild = urlfilters.get("guild");
        let urllocation = urlfilters.get("location");
        let urlminlevel = urlfilters.get("minlevel");
        let urlmaxlevel = urlfilters.get("maxlevel");

        let activefilterarray = [];
        if (urlname) {
            setCharacterNameFilter(urlname);
            activefilterarray.push({
                type: "Name",
                value: urlname,
            });
        }
        if (urlguild) {
            setGuildNameFilter(urlguild);
            activefilterarray.push({
                type: "Guild",
                value: urlguild,
            });
        }
        if (urllocation) {
            setLocationNameFilter(urllocation);
            activefilterarray.push({
                type: "Location",
                value: urllocation,
            });
        }
        if (urlminlevel) {
            setMinimumLevelFilter(urlminlevel);
            activefilterarray.push({
                type: "Min Level",
                value: urlminlevel,
            });
        }
        if (urlmaxlevel) {
            setMaximumLevelFilter(urlmaxlevel);
            activefilterarray.push({
                type: "Max Level",
                value: urlmaxlevel,
            });
        }

        setActiveFilter(activefilterarray);
    }, []);

    function GetSnarkyMessage() {
        if (playerCount === 0) {
            return "Maybe they're all anonymous.";
        } else {
            return "Are you one of them?";
        }
    }

    // Apply filter after filter change
    React.useEffect(() => {
        if (playerData === null || playerData.data === null) return;
        setFilteredPlayerData(ApplyFilters(playerData.data.Players));
    }, [
        activeFilters,
        playerData,
        sortingMethod,
        sortingDirection,
        pinnedPlayers,
        classFilterStates,
    ]);

    React.useEffect(() => {
        if (filteredPlayerData === null) return;
        setPaginatedPlayerData(
            filteredPlayerData.slice(
                Math.max(0, pageNumber * PAGE_SIZE),
                Math.min(
                    pageNumber * PAGE_SIZE + PAGE_SIZE,
                    filteredPlayerData.length
                )
            )
        );
    }, [filteredPlayerData, pageNumber]);

    // Let's get some data
    let recheck; // TODO: Clearing this timeout doesn't work
    React.useEffect(() => {
        clearTimeout(recheck); // TODO: Clearing this timeout doesn't work
        setFilteredPlayerData(null);
        if (!props.server) return;

        FetchPlayerData();

        const refreshdata = setInterval(() => {
            FetchPlayerData();
        }, 120000);
        return () => {
            clearInterval(refreshdata);
            clearTimeout(recheck);
        };
    }, [props.server]);

    function FetchPlayerData(timeout = 5000) {
        Fetch("https://api.ddoaudit.com/gamestatus/serverstatus", 5000)
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
                        "https://api.ddoaudit.com/gamestatus/populationoverview",
                        timeout
                    ).then((val) => {
                        val.forEach((server) => {
                            if (server.ServerName === props.server) {
                                setCurrentPopulation(server.PlayerCount);
                            }
                        });
                    });
                    Fetch(
                        "https://api.ddoaudit.com/players/" +
                            (serverNamesLowercase.includes(
                                props.server.toLowerCase()
                            )
                                ? props.server
                                : ""),
                        timeout
                    )
                        .then((val) => {
                            setLastFetchTime(Date.now());
                            setAttemptedPlayerFetch(true);
                            if (VerifyPlayerData(val)) {
                                props.triggerPopup(null);
                                failedAttemptRef.current = 0;
                                setFailedAttemptCount(failedAttemptRef.current);
                                setPlayerData({
                                    timestamp: Date.now(),
                                    data: val,
                                });
                                setCurrentPopulation(val.Population);
                                let anon = 0;
                                val.Players.forEach((player) => {
                                    if (player.Name === "Anonymous") anon++;
                                });
                                setCurrentAnonymous(anon);
                            } else {
                                failedAttemptRef.current++;
                                setFailedAttemptCount(failedAttemptRef.current);
                                if (failedAttemptRef.current > 5) {
                                    props.triggerPopup({
                                        title: "Something went wrong",
                                        message:
                                            "Pretty descriptive, I know. Try refreshing the page. If the issue continues, please report it.",
                                        icon: "warning",
                                        fullscreen: false,
                                        reportMessage:
                                            val === null
                                                ? "Player data returned null"
                                                : "Player data verification failed",
                                    });
                                } else {
                                    recheck = setTimeout(() => {
                                        FetchPlayerData();
                                    }, 200);
                                }
                            }
                        })
                        .catch((err) => {
                            failedAttemptRef.current++;
                            setFailedAttemptCount(failedAttemptRef.current);
                            setLastFetchTime(Date.now());
                            setAttemptedPlayerFetch(true);
                            if (failedAttemptRef.current > 3) {
                                props.triggerPopup({
                                    title: "Couldn't fetch player data",
                                    message:
                                        "Try refreshing the page. If the issue continues, please report it.",
                                    submessage: err && err.toString(),
                                    icon: "warning",
                                    fullscreen: false,
                                    reportMessage:
                                        (err && err.toString()) ||
                                        "Player data generic error (timeout?)",
                                });
                            } else {
                                recheck = setTimeout(() => {
                                    FetchPlayerData(10000);
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
                            "Try refreshing the page. If the issue continues, please report it.",
                        submessage:
                            (err && err.toString()) || "Server status timeout",
                        icon: "warning",
                        fullscreen: false,
                        reportMessage:
                            (err && err.toString()) || "Server status timeout",
                    });
                } else {
                    recheck = setTimeout(() => {
                        FetchPlayerData();
                    }, 250);
                }
            });
    }

    React.useEffect(() => {
        if (playerData.data === undefined || playerData.data === null) return;
        setPlayerCount(playerData.data.Players.length);
    }, [playerData]);

    React.useEffect(() => {
        let pinnedplayers = JSON.parse(localStorage.getItem("pinned-players"));
        if (pinnedplayers) {
            setPinnedPlayers(pinnedplayers);
        } else {
            setPinnedPlayers([]);
        }
    }, []);

    React.useEffect(() => {
        localStorage.setItem("pinned-players", JSON.stringify(pinnedPlayers));
    }, [pinnedPlayers]);

    function getServerNamePossessive() {
        return `${props.server}${props.server === "Thelanis" ? "'" : "'s"}`;
    }

    return (
        <div
            className={
                "content-container" +
                `${props.minimal ? " hide-on-mobile" : ""}`
            }
            style={{ minHeight: "700px", width: "706px" }}
        >
            <FilterBar
                minimal={props.minimal}
                currentServer={props.server}
                showNotifications={false}
                showSave={true}
                maxWidth={706}
                returnTo="/who"
                handleFilterButton={() =>
                    setFilterPanelVisible(!filterPanelVisible)
                }
                handleSaveButton={() => download()}
                closePanel={() => props.closePanel()}
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
                    <ContentCluster title="Filter Players">
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "left",
                                flexDirection: "column",
                                alignItems: "start",
                                gap: "10px",
                            }}
                        >
                            <div
                                className="full-width-mobile column-on-mobile"
                                style={{
                                    display: "flex",
                                    flexDirection: "row",
                                    flexWrap: "wrap",
                                }}
                            >
                                <label
                                    htmlFor="charactername"
                                    style={{
                                        fontSize: "1.2rem",
                                        marginRight: "10px",
                                        marginBottom: "0px",
                                    }}
                                >
                                    Character name:
                                </label>
                                <input
                                    className="full-width-mobile"
                                    type="text"
                                    id="charactername"
                                    name="charactername"
                                    value={characterNameFilter}
                                    onChange={(e) =>
                                        setCharacterNameFilter(e.target.value)
                                    }
                                />
                            </div>
                            <div
                                className="full-width-mobile column-on-mobile"
                                style={{
                                    display: "flex",
                                    flexDirection: "row",
                                    flexWrap: "wrap",
                                }}
                            >
                                <label
                                    htmlFor="guildname"
                                    style={{
                                        fontSize: "1.2rem",
                                        marginRight: "10px",
                                        marginBottom: "0px",
                                    }}
                                >
                                    Guild name:
                                </label>
                                <input
                                    className="full-width-mobile"
                                    type="text"
                                    id="guildname"
                                    name="guildname"
                                    value={guildNameFilter}
                                    onChange={(e) =>
                                        setGuildNameFilter(e.target.value)
                                    }
                                />
                            </div>
                            <div
                                className="full-width-mobile column-on-mobile"
                                style={{
                                    display: "flex",
                                    flexDirection: "row",
                                    flexWrap: "wrap",
                                }}
                            >
                                <label
                                    htmlFor="locationname"
                                    style={{
                                        fontSize: "1.2rem",
                                        marginRight: "10px",
                                        marginBottom: "0px",
                                    }}
                                >
                                    Location:
                                </label>
                                <input
                                    className="full-width-mobile"
                                    type="text"
                                    id="locationname"
                                    name="locationname"
                                    value={locationNameFilter}
                                    onChange={(e) =>
                                        setLocationNameFilter(e.target.value)
                                    }
                                />
                            </div>
                            <div
                                className="full-width-mobile column-on-mobile"
                                style={{
                                    display: "flex",
                                    flexDirection: "row",
                                    flexWrap: "wrap",
                                    marginBottom: "10px",
                                }}
                            >
                                <label
                                    htmlFor="minimumlevel"
                                    style={{
                                        fontSize: "1.2rem",
                                        marginRight: "10px",
                                        marginBottom: "0px",
                                    }}
                                >
                                    Level range:
                                </label>
                                <div className="full-width-mobile">
                                    <input
                                        className="full-width-mobile"
                                        type="text"
                                        id="minimumlevel"
                                        name="minimumlevel"
                                        value={minimumLevelFilter}
                                        onChange={(e) =>
                                            setMinimumLevelFilter(
                                                e.target.value
                                            )
                                        }
                                    />
                                    <label
                                        htmlFor="maximumlevel"
                                        style={{
                                            padding: "0px 7px 0px 7px",
                                            fontSize: "1.1rem",
                                        }}
                                    >
                                        to
                                    </label>
                                    <input
                                        className="full-width-mobile"
                                        type="text"
                                        id="maximumlevel"
                                        name="maximumlevel"
                                        value={maximumLevelFilter}
                                        onChange={(e) =>
                                            setMaximumLevelFilter(
                                                e.target.value
                                            )
                                        }
                                    />
                                </div>
                            </div>
                            <div
                                style={{
                                    display: "flex",
                                    flexDirection: "row",
                                    flexWrap: "wrap",
                                    gap: "10px",
                                    marginBottom: "10px",
                                }}
                            >
                                <label
                                    htmlFor="sort-type"
                                    style={{
                                        fontSize: "1.2rem",
                                        marginBottom: "0px",
                                    }}
                                >
                                    Sort by
                                </label>

                                <div
                                    style={{
                                        display: "flex",
                                        flexDirection: "row",
                                        gap: "10px",
                                        flexWrap: "wrap",
                                    }}
                                >
                                    <select
                                        className="input-select"
                                        name="sort-type"
                                        id="sort-type"
                                        style={{
                                            maxWidth: "200px",
                                            fontSize: "1.2rem",
                                        }}
                                        onChange={(e) =>
                                            setSortingMethod(e.target.value)
                                        }
                                        value={sortingMethod}
                                    >
                                        <option value="level">Level</option>
                                        <option value="name">Name</option>
                                        <option value="guild">Guild</option>
                                        <option value="location">
                                            Location
                                        </option>
                                    </select>
                                    <select
                                        className="input-select"
                                        name="sort-direction"
                                        id="sort-direction"
                                        style={{
                                            maxWidth: "200px",
                                            fontSize: "1.2rem",
                                        }}
                                        onChange={(e) =>
                                            setSortingDirection(e.target.value)
                                        }
                                        value={sortingDirection}
                                    >
                                        <option value="ascending">
                                            Ascending
                                        </option>
                                        <option value="descending">
                                            Descending
                                        </option>
                                    </select>
                                </div>
                            </div>
                            <a
                                className="faux-link"
                                style={{
                                    fontSize: "1.2rem",
                                    display: "flex",
                                    flexDirection: "row",
                                    flexWrap: "wrap",
                                    gap: "10px",
                                }}
                                href={getLink()}
                                target="_blank"
                            >
                                Link directly to this page with these filters
                            </a>
                        </div>
                    </ContentCluster>
                    <ContentCluster title="Accessibility">
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
                                        if (!props.minimal) {
                                            localStorage.setItem(
                                                "alternative-who-look",
                                                !alternativeLook
                                            );
                                        }
                                        setAlternativeLook(!alternativeLook);
                                    }}
                                />
                                Alternative View (easier to see on mobile)
                            </label>
                        </div>
                    </ContentCluster>
                </div>
            </FilterBar>
            {serverStatus !== false || ignoreServerStatus ? (
                paginatedPlayerData && filteredPlayerData ? (
                    <div
                        style={{
                            width: "100%",
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                            alignItems: "center",
                        }}
                    >
                        {alternativeLook === false ? (
                            <div>
                                <div className="sr-only">
                                    {`The image below is a live preview of ${getServerNamePossessive()} Who panel where all online players are visible.`}
                                </div>
                                <CanvasWhoPanel
                                    minimal={props.minimal}
                                    data={filteredPlayerData}
                                    currentPopulation={currentPopulation}
                                    currentAnonymous={currentAnonymous}
                                    filters={activeFilters}
                                    classFilterStates={classFilterStates}
                                    includeRegion={includeRegion}
                                    exactMatch={exactMatch}
                                    handleClassFilter={(i) => {
                                        handleClassFilter(i);
                                    }}
                                    handleAnyClass={() => {
                                        handleAnyClass();
                                    }}
                                    handleIncludeRegion={() => {
                                        handleIncludeRegion();
                                    }}
                                    handleExactMatch={() => {
                                        handleExactMatch();
                                    }}
                                    handleOpenSettings={() =>
                                        setFilterPanelVisible(
                                            !filterPanelVisible
                                        )
                                    }
                                    handleSort={(type) => {
                                        handleCanvasSort(type);
                                    }}
                                />
                                <div className="top-content-padding hide-on-mobile" />
                            </div>
                        ) : (
                            <div
                                style={{
                                    width: "100%",
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "center",
                                    alignItems: "center",
                                }}
                            >
                                {activeFilters && activeFilters.length !== 0 && (
                                    <div
                                        style={{
                                            display: "flex",
                                            flexDirection: "row",
                                            justifyContent: "left",
                                            gap: "5px",
                                            padding: "5px 10px 5px 10px",
                                            flexWrap: "wrap",
                                            alignItems: "center",
                                            width: "100%",
                                            maxWidth: "706px",
                                        }}
                                    >
                                        <h4
                                            style={{
                                                paddingLeft: "5px",
                                                marginBottom: "0px",
                                                color: "var(--text)",
                                            }}
                                        >
                                            Active filters:
                                        </h4>
                                        {activeFilters.map((filter, i) => (
                                            <div
                                                key={i}
                                                style={{
                                                    fontSize: "1.3rem",
                                                    backgroundColor:
                                                        "var(--highlighted-1)",
                                                    padding:
                                                        "2px 10px 2px 15px",
                                                    width: "max-content",
                                                    borderRadius: "10px",
                                                    display: "flex",
                                                    alignItems: "center",
                                                    cursor: "pointer",
                                                }}
                                                onClick={() => {
                                                    if (filter.type === "Name")
                                                        setCharacterNameFilter(
                                                            ""
                                                        );
                                                    if (filter.type === "Guild")
                                                        setGuildNameFilter("");
                                                    if (
                                                        filter.type ===
                                                        "Min Level"
                                                    )
                                                        setMinimumLevelFilter(
                                                            ""
                                                        );
                                                    if (
                                                        filter.type ===
                                                        "Max Level"
                                                    )
                                                        setMaximumLevelFilter(
                                                            ""
                                                        );
                                                    setActiveFilter(
                                                        activeFilters.filter(
                                                            (_, index) =>
                                                                index !== i
                                                        )
                                                    );
                                                }}
                                            >
                                                <span
                                                    style={{
                                                        color: "var(--text-faded)",
                                                        marginRight: "5px",
                                                    }}
                                                >
                                                    {filter.type}:
                                                </span>
                                                <span
                                                    style={{
                                                        color: "var(--text)",
                                                    }}
                                                >
                                                    {filter.type === "Group"
                                                        ? filter.meta
                                                        : filter.value}
                                                </span>
                                                <CloseSVG
                                                    className="link-icon"
                                                    style={{
                                                        margin: "0px 0px 0px 10px",
                                                        backgroundColor:
                                                            "var(--gray6)",
                                                        borderRadius: "50%",
                                                        padding: "3px",
                                                    }}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                )}
                                <div
                                    className="social-container"
                                    style={{ paddingTop: "10px" }}
                                >
                                    {paginatedPlayerData &&
                                        paginatedPlayerData.map(
                                            (player, i) =>
                                                player.Name !== "Anonymous" && (
                                                    <Player
                                                        key={i}
                                                        handleStarred={() => {
                                                            if (
                                                                IsStarred(
                                                                    player
                                                                )
                                                            ) {
                                                                setPinnedPlayers(
                                                                    pinnedPlayers.filter(
                                                                        (p) =>
                                                                            p.name !==
                                                                            player.Name
                                                                    )
                                                                );
                                                            } else {
                                                                setPinnedPlayers(
                                                                    [
                                                                        ...pinnedPlayers,
                                                                        {
                                                                            name: player.Name,
                                                                            server: props.server,
                                                                        },
                                                                    ]
                                                                );
                                                            }
                                                        }}
                                                        handleClick={(e) => {
                                                            if (
                                                                IsExpanded(
                                                                    player
                                                                )
                                                            ) {
                                                                setExpandedPlayers(
                                                                    expandedPlayers.filter(
                                                                        (p) => {
                                                                            return (
                                                                                p.Name !==
                                                                                player.Name
                                                                            );
                                                                        }
                                                                    )
                                                                );
                                                            } else {
                                                                setExpandedPlayers(
                                                                    [
                                                                        ...expandedPlayers,
                                                                        player,
                                                                    ]
                                                                );
                                                            }
                                                        }}
                                                        handleAddFilter={(
                                                            type
                                                        ) => {
                                                            if (
                                                                type === "Group"
                                                            ) {
                                                                setActiveFilter(
                                                                    [
                                                                        ...activeFilters,
                                                                        {
                                                                            type: "Group",
                                                                            value: player.GroupId,
                                                                            meta: player.Name,
                                                                        },
                                                                    ]
                                                                );
                                                            } else if (
                                                                type === "Guild"
                                                            ) {
                                                                setActiveFilter(
                                                                    [
                                                                        ...activeFilters,
                                                                        {
                                                                            type: "Guild",
                                                                            value: player.Guild,
                                                                        },
                                                                    ]
                                                                );
                                                            } else if (
                                                                type ===
                                                                "Location"
                                                            ) {
                                                                setActiveFilter(
                                                                    [
                                                                        ...activeFilters,
                                                                        {
                                                                            type: "Location",
                                                                            value: player
                                                                                .Location
                                                                                .Name,
                                                                        },
                                                                    ]
                                                                );
                                                            }
                                                        }}
                                                        player={player}
                                                        index={i}
                                                        expanded={IsExpanded(
                                                            player
                                                        )}
                                                        starred={IsStarred(
                                                            player
                                                        )}
                                                    />
                                                )
                                        )}
                                    {paginatedPlayerData &&
                                        paginatedPlayerData.count === 0 && (
                                            <span
                                                style={{
                                                    fontSize: "1.6rem",
                                                    width: "100%",
                                                    textAlign: "center",
                                                }}
                                            >
                                                No groups meet your current
                                                filter settings
                                            </span>
                                        )}
                                    <div
                                        style={{
                                            display: "flex",
                                            flexDirection: "row",
                                            gap: "5px",
                                            justifyContent: "center",
                                            alignItems: "center",
                                            flexWrap: "wrap",
                                        }}
                                    >
                                        {filteredPlayerData &&
                                            [
                                                ...Array(
                                                    Math.ceil(
                                                        filteredPlayerData.length /
                                                            PAGE_SIZE
                                                    )
                                                ),
                                            ].map((o, i) => (
                                                <div
                                                    key={i}
                                                    className={
                                                        pageNumber === i
                                                            ? "paginationPage active"
                                                            : "paginationPage"
                                                    }
                                                    onClick={() => {
                                                        setPageNumber(i);
                                                    }}
                                                >
                                                    {i + 1}
                                                </div>
                                            ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
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
                        {failedAttemptCount
                            ? `Loading player data. Attempt ${
                                  failedAttemptCount + 1
                              }...`
                            : "Loading player data..."}
                    </span>
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
                                FetchPlayerData();
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
                                        "User reported issue from who/" +
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

export default WhoPanel;
