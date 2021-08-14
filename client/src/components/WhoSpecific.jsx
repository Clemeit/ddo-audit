import React from "react";
import { Helmet } from "react-helmet";
import { useLocation } from "react-router-dom";
import Card from "../components/Card";
import ReportIssueForm from "./ReportIssueForm";
import PopupMessage from "./global/PopupMessage";
import { Fetch, VerifyPlayerData } from "./DataLoader";
import Player from "./Player";
import { ReactComponent as CloseSVG } from "../assets/global/close.svg";

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

const WhoSpecific = (props) => {
    // Data
    var [currentServer, set_currentServer] = React.useState(null);
    var [playerData, set_playerData] = React.useState({
        timestamp: 0,
        data: null,
    });
    var [filteredPlayerData, set_filteredPlayerData] = React.useState(null);
    var [playerCount, set_playerCount] = React.useState(null);
    var [adjustedPlayerCount, set_adjustedPlayerCount] = React.useState(null);
    var [lastFetchTime, set_lastFetchTime] = React.useState(null);
    var [attemptedPlayerFetch, set_attemptedPlayerFetch] = React.useState(null);

    // Settings
    var [alternativeLook, set_alternativeLook] = React.useState(true);
    var [activeFilters, set_activeFilters] = React.useState([]);
    var [sortingMethod, set_sortingMethod] = React.useState("level");
    var [sortingDirection, set_sortingDirection] = React.useState("ascending");

    var [expandedPlayers, set_expandedPlayers] = React.useState([]);
    var [starredPlayers, set_starredPlayers] = React.useState([]);

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
        starredPlayers.forEach((p) => {
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
        if (filteredPlayerData)
            set_filteredPlayerData([
                {
                    Name: "Clemeit",
                    TotalLevel: 30,
                    Guild: "Best Guild Ever",
                    Gender: "Male",
                    Race: "Human",
                    Location: {
                        Name: "The Marketplace",
                    },
                    Classes: [
                        { Name: "Favored Soul", Level: 20 },
                        { Name: "Epic", Level: 30 },
                    ],
                    InParty: 1,
                    GroupId: 123,
                },
                ...filteredPlayerData,
            ]);
    }, [
        activeFilters,
        playerData,
        sortingMethod,
        sortingDirection,
        starredPlayers,
    ]);

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
                                        "Player data returned null",
                                },
                            ]);
                        }
                    }
                })
                .catch(() => {
                    failedAttemptCount++;
                    set_lastFetchTime(Date.now());
                    set_attemptedPlayerFetch(true);
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
                                    "Could not fetch Player data. Timeout",
                            },
                        ]);
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
        let starredplayers = localStorage.getItem("starred-players");
        if (starredplayers !== null) {
            set_starredPlayers(starredplayers);
        } else {
            set_starredPlayers([]);
        }
    }, []);

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
                <ReportIssueForm
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
                />
                <Card
                    pageName={"who/" + currentServer.toLowerCase()}
                    showLink={false}
                    title={"Currently on " + currentServer}
                    className="grouping"
                    hideTitleOnMobile={true}
                    subtitle={
                        playerData.data ? (
                            <div className="grouping-subtitle">
                                There {playerCount === 1 ? "is" : "are"}{" "}
                                currently{" "}
                                <span className="population-number">
                                    {playerCount}
                                </span>{" "}
                                player{playerCount === 1 ? "" : "s"} online.{" "}
                                {GetSnarkyMessage()}
                            </div>
                        ) : (
                            <div>Loading player data...</div>
                        )
                    }
                    reportReference={showReportForm}
                >
                    {filteredPlayerData ? (
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
                                    <form
                                        style={{
                                            display: "flex",
                                            flexDirection: "column",
                                            justifyContent: "center",
                                            alignItems: "center",
                                            width: "100%",
                                            maxWidth: "848px",
                                            gap: "25px",
                                            flexWrap: "wrap",
                                            paddingBottom: "10px",
                                        }}
                                    >
                                        <div
                                            className="group-filter-bar"
                                            style={{
                                                borderStyle: "solid",
                                                borderColor:
                                                    "var(--filter-bar)",
                                                borderWidth: "3px",
                                                width: "100%",
                                                maxWidth: "848px",
                                                padding: "0px",
                                            }}
                                        >
                                            <h4
                                                style={{
                                                    backgroundColor:
                                                        "var(--filter-bar)",
                                                    padding: "0px 0px 3px 5px",
                                                    marginBottom: "0px",
                                                }}
                                            >
                                                Filter Players
                                            </h4>
                                            <div className="player-filter-input-container">
                                                <div className="player-filter-input">
                                                    <label
                                                        htmlFor="charactername"
                                                        style={{
                                                            fontSize: "1.2rem",
                                                        }}
                                                    >
                                                        Character name
                                                    </label>
                                                    <input
                                                        type="text"
                                                        id="charactername"
                                                        name="charactername"
                                                        onChange={() =>
                                                            HandleCharacterNameFilter()
                                                        }
                                                    />
                                                </div>
                                                <div className="player-filter-input">
                                                    <label
                                                        htmlFor="guildname"
                                                        style={{
                                                            fontSize: "1.2rem",
                                                        }}
                                                    >
                                                        Guild name
                                                    </label>
                                                    <input
                                                        type="text"
                                                        id="guildname"
                                                        name="guildname"
                                                        onChange={() =>
                                                            HandleGuildNameFilter()
                                                        }
                                                    />
                                                </div>
                                                <div className="player-filter-input">
                                                    <label
                                                        htmlFor="minimumlevel"
                                                        style={{
                                                            fontSize: "1.2rem",
                                                        }}
                                                    >
                                                        Level range
                                                    </label>
                                                    <div>
                                                        <input
                                                            type="text"
                                                            id="minimumlevel"
                                                            name="minimumlevel"
                                                            style={{
                                                                maxWidth:
                                                                    "100px",
                                                            }}
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
                                                            type="text"
                                                            id="maximumlevel"
                                                            name="maximumlevel"
                                                            style={{
                                                                maxWidth:
                                                                    "100px",
                                                            }}
                                                            onChange={() =>
                                                                HandleMaximumLevelFilter()
                                                            }
                                                        />
                                                    </div>
                                                </div>
                                                <div className="player-filter-input">
                                                    <label
                                                        htmlFor="sort-type"
                                                        style={{
                                                            fontSize: "1.2rem",
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
                                    </form>
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
                                                                    "var(--mini-group)",
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
                                        {filteredPlayerData &&
                                            filteredPlayerData.map(
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
                                                                    set_starredPlayers(
                                                                        starredPlayers.filter(
                                                                            (
                                                                                p
                                                                            ) =>
                                                                                p.name !==
                                                                                player.Name
                                                                        )
                                                                    );
                                                                } else {
                                                                    set_starredPlayers(
                                                                        [
                                                                            ...starredPlayers,
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
                                        {filteredPlayerData &&
                                            filteredPlayerData.count === 0 && (
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
                            }}
                        >
                            Loading player data...
                        </span>
                    )}
                </Card>
            </div>
        )
    );
};

export default WhoSpecific;
