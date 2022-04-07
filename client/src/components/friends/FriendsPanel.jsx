import React from "react";
import CanvasFriendsPanel from "./CanvasFriendsPanel";
import { Post } from "../../services/DataLoader";
import SelectFriend from "./SelectFriend";
import LoadingOverlay from "../quests/LoadingOverlay";

const FriendsPanel = (props) => {
    const [idList, setIdList] = React.useState([]);
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
    const [selectionScreenVisible, setSelectionScreenVisible] =
        React.useState(false);
    const [friendSelectList, setFriendSelectList] = React.useState([]);
    const [selectedPlayerIndex, setSelectedPlayerIndex] = React.useState(-1);
    const selectedPlayerIndexRef = React.useRef(selectedPlayerIndex);
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
        let body = { ids: idList };
        Post("https://api.ddoaudit.com/friends", body, 5000)
            .then((res) => {
                setFriendsList(res);
            })
            .catch(() => {
                setFriendsList([]);
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, [idList]);

    React.useEffect(() => {
        if (!friendsList || !friendsList.length) return;
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
        selectedPlayerIndex,
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
        setIsLoading(true);
        const body = { name: playerInputValueRef.current };
        Post("https://api.ddoaudit.com/friends/add", body, 10000)
            .then((res) => {
                if (res.characters.length + res.guilds.length > 1) {
                    setFriendSelectList(res);
                    setSelectionScreenVisible(true);
                    setIsLoading(false);
                } else if (res.characters.length === 1) {
                    addCharacter(res.characters[0]);
                } else if (res.guilds.length === 1) {
                    addGuild(res.guilds[0]);
                } else {
                    alert("Player or guild not found.");
                }
            })
            .catch(() => {
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
            parsed = JSON.parse(list);
            if (parsed && typeof parsed === "object") {
            } else {
                parsed = [];
            }
        } catch (e) {
            parsed = [];
        }
        if (parsed.length + 1 > MAX_LIST_SIZE) {
            alert("You may only have 50 players on your friends list.");
        } else {
            if (!idList.includes(character.playerid)) {
                parsed.push(character.playerid);
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
            ids.slice(0, MAX_LIST_SIZE - parsed.length).forEach((id) => {
                if (!idList.includes(id)) {
                    parsed.push(id);
                }
            });
            setIdList(parsed);
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
        Post("https://api.ddoaudit.com/friends/add/guild", body, 10000)
            .then((res) => {
                if (res.length) {
                    let ids = [];
                    res.forEach((p) => ids.push(p.playerid));
                    addCharactersByIds(ids);
                }
            })
            .catch(() => {})
            .finally(() => {
                setIsLoading(false);
            });
    }

    function removePlayer() {
        if (
            selectedPlayerIndexRef.current === -1 ||
            selectedPlayerIndexRef.current >=
                filteredFriendsListRef.current.length
        ) {
            return;
        }
        let pidtoremove =
            filteredFriendsListRef.current[selectedPlayerIndexRef.current].Id;
        console.log(pidtoremove, idListRef.current);
        const newidlist = idListRef.current.filter((id) => id !== pidtoremove);
        setIdList(newidlist);
        localStorage.setItem("friends-list", JSON.stringify(newidlist));
    }

    return (
        <div>
            {isLoading && <LoadingOverlay message="Loading, please wait." />}
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
                        hideServerNames={hideServerNames}
                        handleSort={(value) => handleSort(value)}
                        playerInput={playerInputValue}
                        handlePlayerInput={(value) => {
                            setPlayerInputValue(value);
                            playerInputValueRef.current = value;
                        }}
                        addName={() => addName()}
                        selectedPlayerIndex={selectedPlayerIndex}
                        handleSelectPlayer={(index) => {
                            setSelectedPlayerIndex(index);
                            selectedPlayerIndexRef.current = index;
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
