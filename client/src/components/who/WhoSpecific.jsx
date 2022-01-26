import React from "react";
import { Helmet } from "react-helmet";
import { useLocation } from "react-router-dom";
// import ReportIssueForm from "./ReportIssueForm";
// import PopupMessage from "./global/PopupMessage";
import { Fetch, VerifyPlayerData } from "../../services/DataLoader";
import Player from "./Player";
import { ReactComponent as CloseSVG } from "../../assets/global/close.svg";
import Banner from "../global/Banner";
import FilterBar from "../global/FilterBar";
import CanvasWhoPanel from "./CanvasWhoPanel";
import PopupMessage from "../global/PopupMessage";
import BannerMessage from "../global/BannerMessage";
import { Submit } from "../../services/ReportIssueService";

const WhoSpecific = (props) => {
    // TODO: If this server is currently offline, don't bother checking for players
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

    // Data
    const [currentServer, set_currentServer] = React.useState(null);
    const [playerData, set_playerData] = React.useState({
        timestamp: 0,
        data: null,
    });
    const [filteredPlayerData, set_filteredPlayerData] = React.useState(null);
    const [paginatedPlayerData, set_paginatedPlayerData] = React.useState(null);
    const [playerCount, set_playerCount] = React.useState(null);
    const [adjustedPlayerCount, set_adjustedPlayerCount] = React.useState(null);
    const [lastFetchTime, set_lastFetchTime] = React.useState(null);
    const [attemptedPlayerFetch, set_attemptedPlayerFetch] =
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
    const [sortingDirection, setSortingDirection] = React.useState("ascending");

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

    var characterNameTimeout;
    function HandleCharacterNameFilter() {
        clearTimeout(characterNameTimeout);
        characterNameTimeout = setTimeout(() => {
            let charactername = document.getElementById("charactername").value;
            if (charactername) {
                setActiveFilter([
                    ...activeFilters.filter((filter) => filter.type !== "Name"),
                    {
                        type: "Name",
                        value: document.getElementById("charactername").value,
                    },
                ]);
            } else {
                setActiveFilter([
                    ...activeFilters.filter((filter) => filter.type !== "Name"),
                ]);
            }
        }, 100);
    }

    var guildNameTimeout;
    function HandleGuildNameFilter() {
        clearTimeout(guildNameTimeout);
        guildNameTimeout = setTimeout(() => {
            let guildname = document.getElementById("guildname").value;
            if (guildname) {
                setActiveFilter([
                    ...activeFilters.filter(
                        (filter) => filter.type !== "Guild"
                    ),
                    {
                        type: "Guild",
                        value: document.getElementById("guildname").value,
                    },
                ]);
            } else {
                setActiveFilter([
                    ...activeFilters.filter(
                        (filter) => filter.type !== "Guild"
                    ),
                ]);
            }
        }, 100);
    }

    var minimumLevelTimeout;
    function HandleMinimumLevelFilter() {
        clearTimeout(minimumLevelTimeout);
        minimumLevelTimeout = setTimeout(() => {
            let minimumlevel = document.getElementById("minimumlevel").value;
            if (minimumlevel) {
                setActiveFilter([
                    ...activeFilters.filter(
                        (filter) => filter.type !== "Min Level"
                    ),
                    {
                        type: "Min Level",
                        value: document.getElementById("minimumlevel").value,
                    },
                ]);
            } else {
                setActiveFilter([
                    ...activeFilters.filter(
                        (filter) => filter.type !== "Min Level"
                    ),
                ]);
            }
        }, 100);
    }

    var maximumLevelTimeout;
    function HandleMaximumLevelFilter() {
        clearTimeout(maximumLevelTimeout);
        maximumLevelTimeout = setTimeout(() => {
            let maximumlevel = document.getElementById("maximumlevel").value;
            if (maximumlevel) {
                setActiveFilter([
                    ...activeFilters.filter(
                        (filter) => filter.type !== "Max Level"
                    ),
                    {
                        type: "Max Level",
                        value: document.getElementById("maximumlevel").value,
                    },
                ]);
            } else {
                setActiveFilter([
                    ...activeFilters.filter(
                        (filter) => filter.type !== "Max Level"
                    ),
                ]);
            }
        }, 100);
    }

    function HandleSortFilter() {
        let sortfilter = document.getElementById("sort-type").value;
        setSortingMethod(sortfilter.toLowerCase());
    }

    function HandleDirectionFilter() {
        let sortfilter = document.getElementById("sort-direction").value;
        setSortingDirection(sortfilter.toLowerCase());
    }

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
        console.log(result);
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

    function ApplyFilters(data) {
        // Apply sorting
        if (sortingMethod === "level") {
            if (sortingDirection === "ascending") {
                data.sort((a, b) => a.TotalLevel > b.TotalLevel);
            } else {
                data.sort((a, b) => a.TotalLevel < b.TotalLevel);
            }
        } else if (sortingMethod === "guild") {
            if (sortingDirection === "ascending") {
                data.sort((a, b) => a.Guild.localeCompare(b.Guild));
            } else {
                data.sort((a, b) => b.Guild.localeCompare(a.Guild));
            }
        } else if (sortingMethod === "location") {
            if (sortingDirection === "ascending") {
                data.sort((a, b) =>
                    a.Location.Name.localeCompare(b.Location.Name)
                );
            } else {
                data.sort((a, b) =>
                    b.Location.Name.localeCompare(a.Location.Name)
                );
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
                        if (
                            !player.Location.Name.toLowerCase().includes(
                                filter.value.toLowerCase()
                            )
                        )
                            pass = false;
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
    }, [window.location.pathname]);

    React.useEffect(() => {
        // Load local storage
        let theme = localStorage.getItem("theme");
        setTheme(theme);

        let alternativelook = localStorage.getItem("alternative-who-look");
        setAlternativeLook(
            alternativelook !== null ? alternativelook === "true" : false
        );
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
        set_filteredPlayerData(ApplyFilters(playerData.data.Players));
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
        set_paginatedPlayerData(
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
        set_filteredPlayerData(null);
        if (!currentServer) return;

        FetchPlayerData();

        const refreshdata = setInterval(() => {
            FetchPlayerData();
        }, 120000);
        return () => {
            clearInterval(refreshdata);
            clearTimeout(recheck);
        };
    }, [currentServer]);

    function FetchPlayerData() {
        Fetch("https://www.playeraudit.com/api/serverstatus", 5000).then(
            (val) => {
                let serverstatus = false;
                if (val.hasOwnProperty("Worlds")) {
                    val.Worlds.forEach((world) => {
                        if (
                            world.Name.toLowerCase() ===
                            currentServer.toLowerCase()
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
                        "https://www.playeraudit.com/api/playersnew?s=" +
                            (serverNamesLowercase.includes(
                                location.toLowerCase()
                            )
                                ? location
                                : ""),
                        5000
                    )
                        .then((val) => {
                            set_lastFetchTime(Date.now());
                            set_attemptedPlayerFetch(true);
                            if (VerifyPlayerData(val)) {
                                setPopupMessages([]);
                                failedAttemptRef.current = 0;
                                setFailedAttemptCount(failedAttemptRef.current);
                                set_playerData({
                                    timestamp: Date.now(),
                                    data: val,
                                });
                            } else {
                                failedAttemptRef.current++;
                                setFailedAttemptCount(failedAttemptRef.current);
                                if (failedAttemptRef.current > 5) {
                                    setPopupMessages([
                                        ...popupMessages,
                                        {
                                            title: "Something went wrong",
                                            message:
                                                "Pretty descriptive, I know. Try refreshing the page. If the issue continues, please report it.",
                                            icon: "warning",
                                            fullscreen: false,
                                            reportMessage:
                                                val === null
                                                    ? "Player data returned null"
                                                    : "[Internal] Verification failed",
                                        },
                                    ]);
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
                            set_lastFetchTime(Date.now());
                            set_attemptedPlayerFetch(true);
                            if (failedAttemptRef.current > 5) {
                                setPopupMessages([
                                    ...popupMessages,
                                    {
                                        title: "Couldn't fetch player data",
                                        message:
                                            "Try refreshing the page. If the issue continues, please report it.",
                                        submessage: err.toString(),
                                        icon: "warning",
                                        fullscreen: false,
                                        reportMessage: "[Internal] Timeout",
                                    },
                                ]);
                            } else {
                                recheck = setTimeout(() => {
                                    FetchPlayerData();
                                }, 250);
                            }
                        });
                }
            }
        );
    }

    React.useEffect(() => {
        if (playerData.data === undefined || playerData.data === null) return;
        set_playerCount(playerData.data.Players.length);
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
    var [popupMessages, setPopupMessages] = React.useState([]);

    return (
        currentServer && (
            <div>
                <Helmet>
                    <title>{TITLE}</title>
                    <meta
                        name="description"
                        content="Browse players from any server with a live Who panel! Are your friends online? Is your guild forming up for a late-night raid? Now you know!"
                    />
                </Helmet>
                <Banner
                    small={true}
                    showTitle={true}
                    showSubtitle={true}
                    showButtons={false}
                    hideOnMobile={true}
                    title="Live LFM Viewer"
                    subtitle={currentServer && currentServer}
                />
                {/* <ReportIssueForm
                    page={"who/" + currentServer.toLowerCase()}
                    showLink={false}
                    visibility={reportFormVisibility}
                    componentReference={reportFormReference}
                    hideReportForm={hideReportForm}
                /> */}
                <PopupMessage
                    page={"who/" + currentServer.toLowerCase()}
                    messages={popupMessages}
                    popMessage={() => {
                        if (popupMessages.length) {
                            let newMessages = [...popupMessages];
                            newMessages = newMessages.slice(1);
                            setPopupMessages(newMessages);
                        }
                    }}
                />
                <div
                    className="content-container"
                    style={{ minHeight: "700px" }}
                >
                    <BannerMessage className="push-on-mobile" page="who" />
                    <div className="top-content-padding hide-on-mobile" />
                    <FilterBar
                        currentServer={currentServer}
                        showNotifications={false}
                        maxWidth={706}
                        returnTo="/who"
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
                                <h2
                                    style={{
                                        fontSize: "1.5rem",
                                    }}
                                >
                                    Filter Players
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
                                            onChange={() =>
                                                HandleCharacterNameFilter()
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
                                            onChange={() =>
                                                HandleGuildNameFilter()
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
                                                onChange={() =>
                                                    HandleMinimumLevelFilter()
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
                                                onChange={() =>
                                                    HandleMaximumLevelFilter()
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
                                                onChange={() =>
                                                    HandleSortFilter()
                                                }
                                            >
                                                <option value="level">
                                                    Level
                                                </option>
                                                <option value="name">
                                                    Name
                                                </option>
                                                <option value="guild">
                                                    Guild
                                                </option>
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
                                                onChange={() =>
                                                    HandleDirectionFilter()
                                                }
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
                                </div>
                            </div>
                            <div
                                className="content-cluster"
                                style={{ marginBottom: "10px" }}
                            >
                                <h2
                                    style={{
                                        fontSize: "1.5rem",
                                        marginTop: "1.5rem",
                                    }}
                                >
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
                                                    "alternative-who-look",
                                                    !alternativeLook
                                                );
                                                setAlternativeLook(
                                                    !alternativeLook
                                                );
                                            }}
                                        />
                                        Alternative View (easier to see on
                                        mobile)
                                    </label>
                                </div>
                            </div>
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
                                        <CanvasWhoPanel
                                            data={filteredPlayerData}
                                            filters={activeFilters}
                                            classFilterStates={
                                                classFilterStates
                                            }
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
                                        {activeFilters &&
                                            activeFilters.length !== 0 && (
                                                <div
                                                    style={{
                                                        display: "flex",
                                                        flexDirection: "row",
                                                        justifyContent: "left",
                                                        gap: "5px",
                                                        padding:
                                                            "5px 10px 5px 10px",
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
                                                    {activeFilters.map(
                                                        (filter, i) => (
                                                            <div
                                                                key={i}
                                                                style={{
                                                                    fontSize:
                                                                        "1.3rem",
                                                                    backgroundColor:
                                                                        "var(--highlighted-1)",
                                                                    padding:
                                                                        "2px 10px 2px 15px",
                                                                    width: "max-content",
                                                                    borderRadius:
                                                                        "10px",
                                                                    display:
                                                                        "flex",
                                                                    alignItems:
                                                                        "center",
                                                                    cursor: "pointer",
                                                                }}
                                                                onClick={() => {
                                                                    if (
                                                                        filter.type ===
                                                                        "Name"
                                                                    )
                                                                        document.getElementById(
                                                                            "charactername"
                                                                        ).value =
                                                                            "";
                                                                    if (
                                                                        filter.type ===
                                                                        "Guild"
                                                                    )
                                                                        document.getElementById(
                                                                            "guildname"
                                                                        ).value =
                                                                            "";
                                                                    if (
                                                                        filter.type ===
                                                                        "Min Level"
                                                                    )
                                                                        document.getElementById(
                                                                            "minimumlevel"
                                                                        ).value =
                                                                            "";
                                                                    if (
                                                                        filter.type ===
                                                                        "Max Level"
                                                                    )
                                                                        document.getElementById(
                                                                            "maximumlevel"
                                                                        ).value =
                                                                            "";
                                                                    setActiveFilter(
                                                                        activeFilters.filter(
                                                                            (
                                                                                _,
                                                                                index
                                                                            ) =>
                                                                                index !==
                                                                                i
                                                                        )
                                                                    );
                                                                }}
                                                            >
                                                                <span
                                                                    style={{
                                                                        color: "var(--text-faded)",
                                                                        marginRight:
                                                                            "5px",
                                                                    }}
                                                                >
                                                                    {
                                                                        filter.type
                                                                    }
                                                                    :
                                                                </span>
                                                                <span
                                                                    style={{
                                                                        color: "var(--text)",
                                                                    }}
                                                                >
                                                                    {filter.type ===
                                                                    "Group"
                                                                        ? filter.meta
                                                                        : filter.value}
                                                                </span>
                                                                <CloseSVG
                                                                    className="link-icon"
                                                                    style={{
                                                                        margin: "0px 0px 0px 10px",
                                                                        backgroundColor:
                                                                            "var(--gray6)",
                                                                        borderRadius:
                                                                            "50%",
                                                                        padding:
                                                                            "3px",
                                                                    }}
                                                                />
                                                            </div>
                                                        )
                                                    )}
                                                </div>
                                            )}
                                        <div
                                            className="social-container"
                                            style={{ paddingTop: "10px" }}
                                        >
                                            {paginatedPlayerData &&
                                                paginatedPlayerData.map(
                                                    (player, i) =>
                                                        player.Name !==
                                                            "Anonymous" && (
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
                                                                                (
                                                                                    p
                                                                                ) =>
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
                                                                                    server: currentServer,
                                                                                },
                                                                            ]
                                                                        );
                                                                    }
                                                                }}
                                                                handleClick={(
                                                                    e
                                                                ) => {
                                                                    if (
                                                                        IsExpanded(
                                                                            player
                                                                        )
                                                                    ) {
                                                                        setExpandedPlayers(
                                                                            expandedPlayers.filter(
                                                                                (
                                                                                    p
                                                                                ) => {
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
                                                                        type ===
                                                                        "Group"
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
                                                                        type ===
                                                                        "Guild"
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
                                                paginatedPlayerData.count ===
                                                    0 && (
                                                    <span
                                                        style={{
                                                            fontSize: "1.6rem",
                                                            width: "100%",
                                                            textAlign: "center",
                                                        }}
                                                    >
                                                        No groups meet your
                                                        current filter settings
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
                                                                setPageNumber(
                                                                    i
                                                                );
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
                                id="action-button-container"
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
                                                    currentServer,
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
            </div>
        )
    );
};

export default WhoSpecific;
