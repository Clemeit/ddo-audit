import React from "react";
import CanvasFriendsPanel from "./CanvasFriendsPanel";
import { Post } from "../../services/DataLoader";
import { Log } from "../../services/CommunicationService";
// import SelectFriend from "./SelectFriend";

const FriendsPanel = (props) => {
    const [idList, setIdList] = React.useState(null);
    const idListRef = React.useRef(idList);
    idListRef.current = idList;
    const [friendsList, setFriendsList] = React.useState([]);
    const [filteredFriendsList, setFilteredFriendsList] = React.useState([]);
    const [multiselectFriendsList, setMultiselectFriendsList] =
        React.useState(null);
    const filteredFriendsListRef = React.useRef(filteredFriendsList);
    filteredFriendsListRef.current = filteredFriendsList;
    const [playerInputValue, setPlayerInputValue] = React.useState("");
    const playerInputValueRef = React.useRef(playerInputValue);
    playerInputValueRef.current = playerInputValue;
    const [sortMethod, setSortMethod] = React.useState("online");
    const sortMethodRef = React.useRef(sortMethod);
    const [sortDirection, setSortDirection] = React.useState("ascending");

    const [hideOfflineFriends, setHideOfflineFriends] = React.useState(false);
    const hideOfflineFriendsRef = React.useRef(hideOfflineFriends);
    hideOfflineFriendsRef.current = hideOfflineFriends;

    const [showServerNames, setShowServerNames] = React.useState(true);
    const showServerNamesRef = React.useRef(showServerNames);
    showServerNamesRef.current = showServerNames;

    const [showPlayerLocations, setShowPlayerLocations] = React.useState(false);
    const showPlayerLocationsRef = React.useRef(showPlayerLocations);
    showPlayerLocationsRef.current = showPlayerLocations;

    const PLAYER_ID_LENGTH = 44;

    // const [selectionScreenVisible, setSelectionScreenVisible] =
    //     React.useState(false);
    // const [friendSelectList, setFriendSelectList] = React.useState([]);
    const [selectedPlayers, setSelectedPlayers] = React.useState([]);
    const selectedPlayersRef = React.useRef(selectedPlayers);
    selectedPlayersRef.current = selectedPlayers;
    const [isLoading, setIsLoading] = React.useState(false);
    const MAX_LIST_SIZE = 50;

    function throwError() {
        props.onError();
    }

    React.useEffect(() => {
        // Load friends list from localstorage
        const list = localStorage.getItem("friends-list");
        try {
            const parsed = JSON.parse(list);
            if (parsed && typeof parsed === "object") {
                setIdList(parsed || []);
            } else {
                setIdList([]);
            }
        } catch (e) {
            setIdList([]);
        }

        const hideofflinefriends = localStorage.getItem("friends-hide-offline");
        setHideOfflineFriends(
            hideofflinefriends !== null ? hideofflinefriends === "true" : false
        );

        const showservers = localStorage.getItem("friends-show-servers");
        setShowServerNames(
            showservers !== null ? showservers === "true" : true
        );

        const showlocations = localStorage.getItem("friends-show-locations");
        setShowPlayerLocations(
            showlocations !== null ? showlocations === "true" : false
        );
    }, []);

    React.useEffect(() => {
        if (idList == null || !idList.length) {
            setFriendsList([]);
            return;
        }
        setIsLoading(true);

        // Filter out potentially bad ids
        let goodIds = idList.filter((id) => id.length === PLAYER_ID_LENGTH);
        if (goodIds.length !== idListRef.current.length) {
            localStorage.setItem("friends-list", JSON.stringify(goodIds));
            setIdList(goodIds);
        }

        Post(
            "https://api.ddoaudit.com/players/lookup",
            { playerids: idList },
            10000
        )
            .then((response) => {
                if (response.error) {
                    setFriendsList([]);
                } else {
                    let sortedCharacters = [];
                    if (idList !== null && idList.length > 0) {
                        idList.forEach((characterId) => {
                            sortedCharacters.push(
                                response.filter(
                                    (character) =>
                                        character.PlayerId === characterId
                                )?.[0]
                            );
                        });
                    }
                    setFriendsList(sortedCharacters);
                }
            })
            .catch(() => {
                throwError();
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, [idList]);

    React.useEffect(() => {
        if (!friendsList || !friendsList.length) {
            setFilteredFriendsList([]);
            return;
        }
        let finaldata = friendsList.filter(
            (friend) => friend != null && (friend.Online || !hideOfflineFriends)
        );

        let sortmod = sortDirection === "ascending" ? 1 : -1;
        finaldata.sort((a, b) => {
            switch (sortMethod) {
                case "inparty":
                    return (
                        (b.InParty * b.Online - a.InParty * a.Online) * sortmod
                    );
                case "name":
                    return a.Name.localeCompare(b.Name) * sortmod;
                case "class":
                    let astring = "";
                    a.Classes.forEach((c) => {
                        astring = astring + (c.Name || "");
                    });
                    let bstring = "";
                    b.Classes.forEach((c) => {
                        bstring = bstring + (c.Name || "");
                    });
                    return astring.localeCompare(bstring) * sortmod;
                case "level":
                    return (a.TotalLevel - b.TotalLevel) * sortmod;
                case "guild":
                    return a.Guild.localeCompare(b.Guild) * sortmod;
                case "online":
                default:
                    return (b.Online - a.Online) * sortmod;
            }
        });

        setFilteredFriendsList(finaldata);
    }, [
        friendsList,
        hideOfflineFriends,
        sortMethod,
        sortDirection,
        selectedPlayers,
    ]);

    function handleSort(value) {
        if (sortMethodRef.current === value) {
            setSortDirection((sortDirection) =>
                sortDirection === "ascending" ? "descending" : "ascending"
            );
        } else {
            sortMethodRef.current = value;
            setSortMethod(value);
            setSortDirection("ascending");
        }
    }

    function addName() {
        if (
            isLoading ||
            playerInputValueRef.current === "" ||
            playerInputValueRef.current.length === 0
        ) {
            return;
        }

        if (idListRef.current.length >= MAX_LIST_SIZE) {
            alert(
                `You may only have ${MAX_LIST_SIZE} players on your friends list.`
            );
            return;
        }

        let trimmedString = playerInputValueRef.current.trim();
        let validString = /^[a-zA-Z0-9\-]+$/;
        if (!validString.test(trimmedString)) {
            alert("Invalid name.");
            return;
        }

        setIsLoading(true);
        const body = {
            name: trimmedString,
        };
        Post("https://api.ddoaudit.com/players/lookup", body, 10000)
            .then((res) => {
                if (res.length > 1) {
                    let goodLengths = true;
                    res.forEach((player) => {
                        if (player.PlayerId.length !== PLAYER_ID_LENGTH) {
                            goodLengths = false;
                        }
                    });
                    if (goodLengths) {
                        setMultiselectFriendsList(res);
                        setIsLoading(false);
                    } else {
                        Log("Error: Bad ID lengths", res);
                    }
                } else if (
                    res.length === 1 &&
                    res[0].PlayerId.length === PLAYER_ID_LENGTH
                ) {
                    addCharacter(res[0]);
                    // } else if (res.guilds.length === 1) {
                    //     addGuild(res.guilds[0]);
                } else {
                    Log("Failed to find friend", trimmedString);
                    alert("Player not found or is anonymous.");
                }
            })
            .catch(() => {
                throwError();
                setIsLoading(false);
            })
            .finally(() => {
                setIsLoading(false);
            });
    }

    // function closeSelectFriend() {
    //     setSelectionScreenVisible(false);
    // }

    function addCharacter(character) {
        const list = localStorage.getItem("friends-list");
        let parsed = [];
        try {
            parsed = JSON.parse(list || "[]");
        } catch (e) {
            parsed = [];
        }
        if (parsed.length >= MAX_LIST_SIZE) {
            alert(
                `You may only have ${MAX_LIST_SIZE} players on your friends list.`
            );
        } else {
            if (
                idListRef.current !== null &&
                !idListRef.current.includes(character.PlayerId)
            ) {
                parsed.push(character.PlayerId);
                setIdList(parsed);
                localStorage.setItem("friends-list", JSON.stringify(parsed));
                Log("Added friend", character.PlayerId);
            }
            setPlayerInputValue("");
        }
        setIsLoading(false);
    }

    // function addCharactersByIds(ids) {
    //     const list = localStorage.getItem("friends-list");
    //     let parsed = [];
    //     try {
    //         parsed = JSON.parse(list);
    //         if (parsed && typeof parsed === "object") {
    //         } else {
    //             parsed = [];
    //         }
    //     } catch (e) {
    //         parsed = [];
    //     }

    //     if (parsed.length >= MAX_LIST_SIZE) {
    //         alert(
    //             `You may only have ${MAX_LIST_SIZE} players on your friends list.`
    //         );
    //         return;
    //     }

    //     if (parsed.length + ids.length > MAX_LIST_SIZE) {
    //         alert(
    //             `You may only have ${MAX_LIST_SIZE} players on your friends list. Adding the first ${
    //                 MAX_LIST_SIZE - parsed.length
    //             } players.`
    //         );
    //         ids.forEach((id) => {
    //             if (!idList.includes(id)) {
    //                 parsed.push(id);
    //             }
    //         });
    //         setIdList(parsed.slice(0, MAX_LIST_SIZE - parsed.length));
    //         localStorage.setItem("friends-list", JSON.stringify(parsed));
    //         setPlayerInputValue("");
    //     } else {
    //         ids.forEach((id) => {
    //             if (!idList.includes(id)) {
    //                 parsed.push(id);
    //             }
    //         });
    //         setIdList(parsed);
    //         localStorage.setItem("friends-list", JSON.stringify(parsed));
    //         setPlayerInputValue("");
    //     }
    // }

    // function addGuild(guild) {
    //     const body = { guild: guild.name, server: guild.server };
    //     Post("https://api.ddoaudit.com/guilds/lookup", body, 10000)
    //         .then((res) => {
    //             if (res.length) {
    //                 addCharactersByIds(res);
    //             }
    //         })
    //         .catch(() => {
    //             throwError();
    //         })
    //         .finally(() => {
    //             setIsLoading(false);
    //         });
    // }

    function removePlayer() {
        if (selectedPlayersRef.current.length === 0) {
            return;
        } else {
            let newIdList = idListRef.current.filter(
                (pid) => !selectedPlayersRef.current.includes(pid)
            );
            setIdList(newIdList);
            localStorage.setItem("friends-list", JSON.stringify(newIdList));
            setSelectedPlayers([]);
        }
    }

    return (
        <>
            {/* {selectionScreenVisible && (
                <SelectFriend
                    handleClose={() => closeSelectFriend()}
                    data={friendSelectList}
                    characterSelected={(character) => {
                        addCharacter(character);
                        closeSelectFriend();
                        setFriendSelectList([]);
                    }}
                    guildSelected={(guild) => {
                        addGuild(guild);
                        closeSelectFriend();
                        setFriendSelectList([]);
                    }}
                />
            )} */}
            <div
                className={
                    "content-container" +
                    `${props.minimal ? " hide-on-mobile" : ""}`
                }
                style={{ minHeight: "700px", width: "706px" }}
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
                    <CanvasFriendsPanel
                        maxListSize={MAX_LIST_SIZE}
                        data={filteredFriendsList}
                        multiselect={multiselectFriendsList}
                        handlePlayerSelect={(character) => {
                            if (character !== null) {
                                addCharacter(character);
                            }
                            setMultiselectFriendsList(null);
                        }}
                        handleHideOfflineFriends={() => {
                            localStorage.setItem(
                                "friends-hide-offline",
                                !hideOfflineFriendsRef.current
                            );
                            setHideOfflineFriends(
                                (hideOfflineFriends) => !hideOfflineFriends
                            );
                        }}
                        hideOfflineFriends={hideOfflineFriends}
                        handleShowServerNames={(showServerNames) => {
                            localStorage.setItem(
                                "friends-show-servers",
                                !showServerNamesRef.current
                            );
                            setShowServerNames(
                                (showServerNames) => !showServerNames
                            );
                        }}
                        showServerNames={showServerNames}
                        handleShowPlayerLocations={() => {
                            localStorage.setItem(
                                "friends-show-locations",
                                !showPlayerLocationsRef.current
                            );
                            setShowPlayerLocations(
                                (showPlayerLocations) => !showPlayerLocations
                            );
                        }}
                        showPlayerLocations={showPlayerLocations}
                        handleSort={(value) => handleSort(value)}
                        playerInput={playerInputValue}
                        handlePlayerInput={(value) => {
                            setPlayerInputValue(value);
                            playerInputValueRef.current = value;
                        }}
                        addName={() => addName()}
                        selectedPlayers={selectedPlayersRef.current.map(
                            (pid) => {
                                let i = -1;
                                filteredFriendsListRef.current.forEach(
                                    (player, playerIndex) => {
                                        if (player.PlayerId === pid) {
                                            i = playerIndex;
                                        }
                                    }
                                );
                                return i;
                            }
                        )}
                        handleSelectPlayer={(index) => {
                            if (
                                index < 0 ||
                                index >
                                    filteredFriendsListRef.current.length - 1
                            ) {
                                return;
                            }

                            let indexPid =
                                filteredFriendsListRef.current[index].PlayerId;

                            if (selectedPlayersRef.current.includes(indexPid)) {
                                setSelectedPlayers((selectedPlayers) =>
                                    selectedPlayers.filter(
                                        (i) => i !== indexPid
                                    )
                                );
                            } else {
                                setSelectedPlayers((selectedPlayers) => [
                                    ...selectedPlayers,
                                    filteredFriendsListRef.current[index]
                                        .PlayerId,
                                ]);
                            }
                        }}
                        removePlayer={() => removePlayer()}
                        isLoading={isLoading}
                    />
                </div>
            </div>
        </>
    );
};

export default FriendsPanel;
