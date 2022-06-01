import React from "react";
import CanvasFriendsPanel from "./CanvasFriendsPanel";
import { Post } from "../../services/DataLoader";
import SelectFriend from "./SelectFriend";

const FriendsPanel = (props) => {
    const [idList, setIdList] = React.useState(null);
    const idListRef = React.useRef(idList);
    idListRef.current = idList;
    const [friendsList, setFriendsList] = React.useState([]);
    const [filteredFriendsList, setFilteredFriendsList] = React.useState([]);
    const filteredFriendsListRef = React.useRef(filteredFriendsList);
    filteredFriendsListRef.current = filteredFriendsList;
    const [playerInputValue, setPlayerInputValue] = React.useState("");
    const playerInputValueRef = React.useRef(playerInputValue);
    playerInputValueRef.current = playerInputValue;
    const [sortMethod, setSortMethod] = React.useState("online");
    const sortMethodRef = React.useRef(sortMethod);
    const [sortDirection, setSortDirection] = React.useState("ascending");
    const [hideOfflineFriends, setHideOfflineFriends] = React.useState(false);
    const [hideServerNames, setHideServerNames] = React.useState(false);
    const [hidePlayerLocations, setHidePlayerLocations] = React.useState(false);
    const [selectionScreenVisible, setSelectionScreenVisible] =
        React.useState(false);
    const [friendSelectList, setFriendSelectList] = React.useState([]);
    const [selectedPlayers, setSelectedPlayers] = React.useState([]);
    const selectedPlayersRef = React.useRef(selectedPlayers);
    selectedPlayersRef.current = selectedPlayers;
    const [isLoading, setIsLoading] = React.useState(false);
    const MAX_LIST_SIZE = 50;

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
    }, []);

    React.useEffect(() => {
        if (idList == null || !idList.length) {
            setFriendsList([]);
            return;
        }
        setIsLoading(true);

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
            .catch(() => {})
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
            (friend) => friend.Online || !hideOfflineFriends
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
        if (isLoading || selectionScreenVisible) return;
        setIsLoading(true);
        const body = {
            name: playerInputValueRef.current,
            guild: playerInputValueRef.current,
        };
        Post("https://api.ddoaudit.com/players/lookup", body, 10000)
            .then((res) => {
                if (res.players.length + res.guilds.length > 1) {
                    setFriendSelectList(res);
                    setSelectionScreenVisible(true);
                    setIsLoading(false);
                } else if (res.players.length === 1) {
                    addCharacter(res.players[0]);
                } else if (res.guilds.length === 1) {
                    addGuild(res.guilds[0]);
                } else {
                    alert("Player or guild not found.");
                }
            })
            .catch(() => {
                setIsLoading(false);
            })
            .finally(() => {
                setIsLoading(false);
            });
    }

    function closeSelectFriend() {
        setSelectionScreenVisible(false);
    }

    function addCharacter(character) {
        const list = localStorage.getItem("friends-list");
        let parsed = [];
        try {
            parsed = JSON.parse(list || "[]");
        } catch (e) {
            parsed = [];
        }
        if (parsed.length >= MAX_LIST_SIZE) {
            alert("You may only have 50 players on your friends list.");
        } else {
            if (!idList.includes(character.PlayerId)) {
                parsed.push(character.PlayerId);
                setIdList(parsed);
                localStorage.setItem("friends-list", JSON.stringify(parsed));
            }
            setPlayerInputValue("");
        }
        setIsLoading(false);
    }

    function addCharactersByIds(ids) {
        const list = localStorage.getItem("friends-list");
        let parsed = [];
        try {
            parsed = JSON.parse(list);
            if (parsed && typeof parsed === "object") {
            } else {
                parsed = [];
            }
        } catch (e) {
            parsed = [];
        }

        if (parsed.length >= MAX_LIST_SIZE) {
            alert(
                `You may only have ${MAX_LIST_SIZE} players on your friends list.`
            );
            return;
        }

        if (parsed.length + ids.length > MAX_LIST_SIZE) {
            alert(
                `You may only have ${MAX_LIST_SIZE} players on your friends list. Adding the first ${
                    MAX_LIST_SIZE - parsed.length
                } players.`
            );
            ids.forEach((id) => {
                if (!idList.includes(id)) {
                    parsed.push(id);
                }
            });
            setIdList(parsed.slice(0, MAX_LIST_SIZE - parsed.length));
            localStorage.setItem("friends-list", JSON.stringify(parsed));
            setPlayerInputValue("");
        } else {
            ids.forEach((id) => {
                if (!idList.includes(id)) {
                    parsed.push(id);
                }
            });
            setIdList(parsed);
            localStorage.setItem("friends-list", JSON.stringify(parsed));
            setPlayerInputValue("");
        }
    }

    function addGuild(guild) {
        const body = { guild: guild.name, server: guild.server };
        Post("https://api.ddoaudit.com/guilds/lookup", body, 10000)
            .then((res) => {
                if (res.length) {
                    addCharactersByIds(res);
                }
            })
            .catch(() => {})
            .finally(() => {
                setIsLoading(false);
            });
    }

    function removePlayer() {
        if (selectedPlayersRef.current.length === 0) {
            return;
        } else {
            let newIdList = idListRef.current.filter(
                (pid) => !selectedPlayersRef.current.includes(pid)
            );
            setIdList(newIdList);
            localStorage.setItem("friends-list", JSON.stringify(newIdList));
        }
    }

    return (
        <div>
            {selectionScreenVisible && (
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
            )}
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
                        data={filteredFriendsList}
                        handleHideOfflineFriends={() =>
                            setHideOfflineFriends(
                                (hideOfflineFriends) => !hideOfflineFriends
                            )
                        }
                        hideOfflineFriends={hideOfflineFriends}
                        handleHideServerNames={() =>
                            setHideServerNames(
                                (hideServerNames) => !hideServerNames
                            )
                        }
                        hidePlayerLocations={hidePlayerLocations}
                        handleHidePlayerLocations={() => {
                            setHidePlayerLocations(
                                (playerLocations) => !playerLocations
                            );
                        }}
                        hideLocation={false}
                        hideServerNames={hideServerNames}
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
                            // setSelectedPlayers(index);
                            // selectedPlayersRef.current = index;
                        }}
                        removePlayer={() => removePlayer()}
                        isLoading={isLoading}
                    />
                </div>
            </div>
        </div>
    );
};

export default FriendsPanel;
