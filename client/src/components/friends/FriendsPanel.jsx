import React from "react";
import CanvasFriendsPanel from "./CanvasFriendsPanel";
import { Post } from "../../services/DataLoader";
import SelectFriend from "./SelectFriend";

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
    const [selectionScreenVisible, setSelectionScreenVisible] =
        React.useState(false);
    const [friendSelectList, setFriendSelectList] = React.useState([]);
    const [selectedPlayerIndex, setSelectedPlayerIndex] = React.useState(-1);
    const selectedPlayerIndexRef = React.useRef(selectedPlayerIndex);

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
        if (idList == null || !idList.length) return;
        console.log(idList);
        let body = { ids: idList };
        Post("http://localhost:23451/friends", body, 5000).then((res) => {
            setFriendsList(res);
        });
    }, [idList]);

    React.useEffect(() => {
        if (!friendsList) return;
        let finaldata = friendsList.filter(
            (friend) => friend.Online || !hideOfflineFriends
        );

        let sortmod = sortDirection === "ascending" ? 1 : -1;
        finaldata.sort((a, b) => {
            switch (sortMethod) {
                case "inparty":
                    return (b.InParty - a.InParty) * sortmod;
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
        const body = { name: playerInputValueRef.current };
        console.log(body);
        Post("http://localhost:23451/friends/add", body, 10000).then((res) => {
            if (res.length > 1) {
                setFriendSelectList(res);
                setSelectionScreenVisible(true);
            } else if (res.length === 1) {
                addCharacterById(res[0].playerid);
            } else {
                alert("Player not found.");
            }
        });
    }

    function closeSelectFriend() {
        setSelectionScreenVisible(false);
    }

    function addCharacterById(id) {
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
        parsed.push(id);
        setIdList(parsed);
        localStorage.setItem("friends-list", JSON.stringify(parsed));
        setPlayerInputValue("");
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
        const newidlist = idListRef.current.filter((id) => id !== pidtoremove);
        setIdList(newidlist);
        localStorage.setItem("friends-list", JSON.stringify(newidlist));
    }

    return (
        <div>
            {selectionScreenVisible && (
                <SelectFriend
                    handleClose={() => closeSelectFriend()}
                    characters={friendSelectList}
                    characterSelected={(id) => {
                        addCharacterById(id);
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
                    />
                </div>
            </div>
        </div>
    );
};

export default FriendsPanel;
