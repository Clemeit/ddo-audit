import React from "react";
import CanvasFriendsPanel from "./CanvasFriendsPanel";
import { Post } from "../../services/DataLoader";

const FriendsPanel = (props) => {
    const [idList, setIdList] = React.useState([]);
    const [friendsList, setFriendsList] = React.useState([]);
    const [filteredFriendsList, setFilteredFriendsList] = React.useState([]);
    const [playerInputValue, setPlayerInputValue] = React.useState("");
    const [sortMethod, setSortMethod] = React.useState("online");
    const sortMethodRef = React.useRef(sortMethod);
    const [sortDirection, setSortDirection] = React.useState("ascending");
    const sortDirectionRef = React.useRef(sortDirection);
    const [hideOfflineFriends, setHideOfflineFriends] = React.useState(false);

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
    }, [friendsList, hideOfflineFriends, sortMethod, sortDirection]);

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

    return (
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
                    handlePlayerInput={(value) => setPlayerInputValue(value)}
                />
            </div>
        </div>
    );
};

export default FriendsPanel;
