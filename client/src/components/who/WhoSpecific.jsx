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

const WhoSpecific = (props) => {
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

    // Settings
    const [alternativeLook, set_alternativeLook] = React.useState(true);
    const [activeFilters, set_activeFilters] = React.useState([]);
    const [sortingMethod, set_sortingMethod] = React.useState("level");
    const [sortingDirection, set_sortingDirection] =
        React.useState("ascending");

    const [pageNumber, set_pageNumber] = React.useState(0);

    const [expandedPlayers, set_expandedPlayers] = React.useState([]);
    const [pinnedPlayers, setPinnedPlayers] = React.useState([]);

    const [filterPanelVisible, setFilterPanelVisible] = React.useState(false);

    var characterNameTimeout;
    function HandleCharacterNameFilter() {
        clearTimeout(characterNameTimeout);
        characterNameTimeout = setTimeout(() => {
            let charactername = document.getElementById("charactername").value;
            if (charactername) {
                set_activeFilters([
                    ...activeFilters.filter((filter) => filter.type !== "Name"),
                    {
                        type: "Name",
                        value: document.getElementById("charactername").value,
                    },
                ]);
            } else {
                set_activeFilters([
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
                set_activeFilters([
                    ...activeFilters.filter(
                        (filter) => filter.type !== "Guild"
                    ),
                    {
                        type: "Guild",
                        value: document.getElementById("guildname").value,
                    },
                ]);
            } else {
                set_activeFilters([
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
                set_activeFilters([
                    ...activeFilters.filter(
                        (filter) => filter.type !== "Min Level"
                    ),
                    {
                        type: "Min Level",
                        value: document.getElementById("minimumlevel").value,
                    },
                ]);
            } else {
                set_activeFilters([
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
                set_activeFilters([
                    ...activeFilters.filter(
                        (filter) => filter.type !== "Max Level"
                    ),
                    {
                        type: "Max Level",
                        value: document.getElementById("maximumlevel").value,
                    },
                ]);
            } else {
                set_activeFilters([
                    ...activeFilters.filter(
                        (filter) => filter.type !== "Max Level"
                    ),
                ]);
            }
        }, 100);
    }

    function HandleSortFilter() {
        let sortfilter = document.getElementById("sort-type").value;
        set_sortingMethod(sortfilter.toLowerCase());
    }

    function HandleDirectionFilter() {
        let sortfilter = document.getElementById("sort-direction").value;
        set_sortingDirection(sortfilter.toLowerCase());
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

        // Pull out starred players to be inserted at the top later
        let starredplayers = data.filter((p) => IsStarred(p));
        data = data.filter((p) => !IsStarred(p));

        // Apply filters
        if (activeFilters !== null && activeFilters.length !== 0) {
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
                return pass;
            });
        }

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
    }, [props.location]);

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
    React.useEffect(() => {
        var failedAttemptCount = 5;
        function FetchPlayerData() {
            Fetch(
                "https://www.playeraudit.com/api/playersnew?s=" +
                    (serverNamesLowercase.includes(location.toLowerCase())
                        ? location
                        : ""),
                5000
            )
                .then((val) => {
                    set_lastFetchTime(Date.now());
                    set_attemptedPlayerFetch(true);
                    if (VerifyPlayerData(val)) {
                        set_popupMessages([]);
                        failedAttemptCount = 0;
                        set_playerData({ timestamp: Date.now(), data: val });
                    } else {
                        failedAttemptCount++;
                        if (failedAttemptCount > 5) {
                            // set_popupMessages([
                            //     ...popupMessages,
                            //     {
                            //         title: "Something went wrong",
                            //         message:
                            //             "Pretty descriptive, I know. Try refreshing the page. If the issue continues, please report it.",
                            //         icon: "warning",
                            //         fullscreen: false,
                            //         reportMessage:
                            //             JSON.stringify(val) ||
                            //             "Player data returned null",
                            //     },
                            // ]);
                        }
                    }
                })
                .catch(() => {
                    failedAttemptCount++;
                    set_lastFetchTime(Date.now());
                    set_attemptedPlayerFetch(true);
                    if (failedAttemptCount > 5) {
                        // set_popupMessages([
                        //     ...popupMessages,
                        //     {
                        //         title: "We're stuck on a loading screen",
                        //         message:
                        //             "This is taking longer than usual. You can refresh the page or report the issue.",
                        //         icon: "warning",
                        //         fullscreen: false,
                        //         reportMessage:
                        //             "Could not fetch Player data. Timeout",
                        //     },
                        // ]);
                    }
                });
        }
        FetchPlayerData();

        const refreshdata = setInterval(() => {
            FetchPlayerData();
        }, 60000);
        return () => clearInterval(refreshdata);
    }, [currentServer]);

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
    var [popupMessages, set_popupMessages] = React.useState([]);

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
                />
                <PopupMessage
                    page={"who/" + currentServer.toLowerCase()}
                    messages={popupMessages}
                    popMessage={() => {
                        if (popupMessages.length) {
                            let newMessages = [...popupMessages];
                            newMessages = newMessages.slice(1);
                            set_popupMessages(newMessages);
                        }
                    }}
                /> */}
                <div id="content-container">
                    <div className="top-content-padding hide-on-mobile" />
                    {paginatedPlayerData ? (
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
                                // <CanvasLfmPanel
                                //     data={groupDataServer}
                                //     showNotEligible={showNotEligible}
                                //     adjustedGroupCount={adjustedGroupCount}
                                //     fontModifier={fontModifier}
                                //     highVisibility={highVisibility}
                                //     // showNotEligible={showNotEligible}
                                //     // sortOrder={sortOrder}
                                //     // minimumLevel={minimumLevel}
                                //     // maximumLevel={maximumLevel}
                                // ></CanvasLfmPanel>
                                <div></div>
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
                                    <FilterBar
                                        currentServer={currentServer}
                                        showNotifications={false}
                                        returnTo="/who"
                                        handleFilterButton={() =>
                                            setFilterPanelVisible(
                                                !filterPanelVisible
                                            )
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
                                                setFilterPanelVisible(false)
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
                                                        backgroundColor:
                                                            "var(--text)",
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
                                                            flexDirection:
                                                                "row",
                                                            flexWrap: "wrap",
                                                        }}
                                                    >
                                                        <label
                                                            htmlFor="charactername"
                                                            style={{
                                                                fontSize:
                                                                    "1.2rem",
                                                                marginRight:
                                                                    "10px",
                                                                marginBottom:
                                                                    "0px",
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
                                                            flexDirection:
                                                                "row",
                                                            flexWrap: "wrap",
                                                        }}
                                                    >
                                                        <label
                                                            htmlFor="guildname"
                                                            style={{
                                                                fontSize:
                                                                    "1.2rem",
                                                                marginRight:
                                                                    "10px",
                                                                marginBottom:
                                                                    "0px",
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
                                                            flexDirection:
                                                                "row",
                                                            flexWrap: "wrap",
                                                            marginBottom:
                                                                "10px",
                                                        }}
                                                    >
                                                        <label
                                                            htmlFor="minimumlevel"
                                                            style={{
                                                                fontSize:
                                                                    "1.2rem",
                                                                marginRight:
                                                                    "10px",
                                                                marginBottom:
                                                                    "0px",
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
                                                                    padding:
                                                                        "0px 7px 0px 7px",
                                                                    fontSize:
                                                                        "1.1rem",
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
                                                            flexDirection:
                                                                "row",
                                                            flexWrap: "wrap",
                                                            gap: "10px",
                                                        }}
                                                    >
                                                        <label
                                                            htmlFor="sort-type"
                                                            style={{
                                                                fontSize:
                                                                    "1.2rem",
                                                                marginBottom:
                                                                    "0px",
                                                            }}
                                                        >
                                                            Sort by
                                                        </label>

                                                        <div
                                                            style={{
                                                                display: "flex",
                                                                flexDirection:
                                                                    "row",
                                                                gap: "10px",
                                                                flexWrap:
                                                                    "wrap",
                                                            }}
                                                        >
                                                            <select
                                                                className="input-select"
                                                                name="sort-type"
                                                                id="sort-type"
                                                                style={{
                                                                    maxWidth:
                                                                        "200px",
                                                                    fontSize:
                                                                        "1.2rem",
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
                                                                    maxWidth:
                                                                        "200px",
                                                                    fontSize:
                                                                        "1.2rem",
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
                                        </div>
                                    </FilterBar>
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
                                                    maxWidth: "848px",
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
                                                                display: "flex",
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
                                                                set_activeFilters(
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
                                                                {filter.type}:
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
                                                                    set_expandedPlayers(
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
                                                                    set_expandedPlayers(
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
                                                                    set_activeFilters(
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
                                                                    set_activeFilters(
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
                                                                    set_activeFilters(
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
                                                            set_pageNumber(i);
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
                            }}
                        >
                            Loading player data...
                        </span>
                    )}
                </div>
            </div>
        )
    );
};

export default WhoSpecific;
