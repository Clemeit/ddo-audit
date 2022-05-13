import React from "react";
import { Post } from "../../services/DataLoader";
import { ReactComponent as DeleteSVG } from "../../assets/global/delete.svg";
import { ReactComponent as RefreshSVG } from "../../assets/global/refresh.svg";
import { ReactComponent as ErrorSVG } from "../../assets/global/error.svg";
import { Link } from "react-router-dom";
import $ from "jquery";

const TimerList = () => {
    const [characterIds, setCharacterIds] = React.useState();
    const [characters, setCharacters] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    const [showFailedToFetchError, setShowFailedToFetchError] =
        React.useState(false);

    React.useEffect(() => {
        let characterIds = JSON.parse(
            localStorage.getItem("registered-characters") || "[]"
        );
        setCharacterIds(characterIds || []);
    }, []);

    React.useEffect(() => {
        if (characterIds) {
            fetchCharacterData();
        }
    }, [characterIds]);

    const refreshButtonAngleRef = React.useRef(null);
    function refreshButtonHandler() {
        refreshButtonAngleRef.current += 360;
        $(`.character-refresh-button`).css({
            transform: `rotate(${refreshButtonAngleRef.current}deg)`,
        });
    }

    function fetchCharacterData() {
        if (characterIds?.length === 0) {
            setLoading(false);
            return;
        }
        Post(
            "https://api.ddoaudit.com/players/lookup",
            { playerids: characterIds },
            10000
        )
            .then((response) => {
                if (response.error) {
                    setLoading(false);
                    setShowFailedToFetchError(true);
                } else {
                    setCharacters(response);
                    appendRaidActivity(response);
                }
            })
            .catch(() => {
                setLoading(false);
                setShowFailedToFetchError(true);
            });
    }

    function appendRaidActivity(characters) {
        let returnedCharacters = [];
        let lookups = [];
        characters.forEach((character) => {
            lookups.push(
                Post(
                    "https://api.ddoaudit.com/players/raidactivity",
                    { playerid: character.PlayerId },
                    10000
                )
                    .then((res) => {
                        returnedCharacters.push({
                            ...character,
                            RaidActivity: res,
                        });
                    })
                    .catch(() => {
                        setLoading(false);
                        setShowFailedToFetchError(true);
                        returnedCharacters.push(characters);
                    })
            );
        });

        if (lookups.length === 0) {
            setLoading(false);
        }
        Promise.all(lookups).then(() => {
            // remove raids that are off timer (negative)
            returnedCharacters.forEach((character) => {
                character.RaidActivity = character.RaidActivity.filter(
                    (raid) => raid.remaining > 0
                );
            });

            // remove the first instance of duplicate raids
            returnedCharacters.forEach((character) => {
                character.RaidActivity.sort(
                    (a, b) => a.remaining - b.remaining
                );
                let raids = [];
                for (let i = character.RaidActivity.length - 1; i >= 0; i--) {
                    if (raids.includes(character.RaidActivity[i].name)) {
                        character.RaidActivity = character.RaidActivity.filter(
                            (_, index) => i != index
                        );
                    } else {
                        raids.push(character.RaidActivity[i].name);
                    }
                }
            });

            returnedCharacters.sort(
                (a, b) => b.RaidActivity?.length - a.RaidActivity?.length
            );
            setCharacters(returnedCharacters);
        });
    }

    function getTimeTillEnd(raid) {
        // prettier-ignore
        let remainingMinutes = raid.remaining;
        const timeInDays = Math.floor(remainingMinutes / (60 * 60 * 24));
        remainingMinutes = remainingMinutes % (60 * 60 * 24);
        const timeInHours = Math.floor(remainingMinutes / (60 * 60));
        remainingMinutes = remainingMinutes % (60 * 60);
        const timeInMinutes = Math.floor(remainingMinutes / 60);
        let returnStringArray = [];
        if (timeInDays != 0) {
            returnStringArray.push(
                `${timeInDays} day${timeInDays != 1 ? "s" : ""}`
            );
        }
        if (timeInHours != 0) {
            returnStringArray.push(
                `${timeInHours} hour${timeInHours != 1 ? "s" : ""}`
            );
        }
        if (timeInMinutes != 0) {
            returnStringArray.push(
                `${timeInMinutes} minute${timeInMinutes != 1 ? "s" : ""}`
            );
        }

        return returnStringArray.join(", ");
    }

    return (
        <div>
            {showFailedToFetchError && (
                <div>
                    <div
                        style={{
                            width: "100%",
                            border: "1px solid red",
                            borderRadius: "4px",
                            padding: "7px 10px",
                            marginBottom: "5px",
                        }}
                    >
                        <span
                            style={{
                                fontSize: "1.3rem",
                                fontWeight: "bold",
                                display: "flex",
                                flexDirection: "row",
                                alignItems: "center",
                            }}
                        >
                            <ErrorSVG style={{ marginRight: "5px" }} />
                            Failed to fetch character data
                        </span>
                        <span style={{ fontSize: "1.3rem" }}>
                            Please try again later. If the error persists, try
                            clearing your browser cookies or let me know of the
                            problem via the{" "}
                            <Link to="/suggestions">Suggestions page</Link>.
                        </span>
                        <br />
                        <span
                            style={{
                                fontSize: "1.1rem",
                                color: "var(--text-faded)",
                            }}
                        >
                            Reason: the server took too long to respond
                        </span>
                    </div>
                    <div style={{ height: "15px" }} />
                </div>
            )}
            {loading && (!characters || characters.length == 0) && (
                <div
                    style={{
                        minHeight: "150px",
                        width: "100%",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    <span style={{ textAlign: "center", fontSize: "1.5rem" }}>
                        Loading...
                    </span>
                </div>
            )}
            {characters.map((character, i) => (
                <div key={i}>
                    <div style={{ padding: "10px 0px" }}>
                        <div
                            style={{
                                display: "flex",
                                flexDirection: "row",
                                alignItems: "center",
                                marginBottom: "10px",
                            }}
                        >
                            <h4
                                style={{
                                    marginBottom: "0px",
                                    marginRight: "10px",
                                }}
                            >
                                {character.Name}
                            </h4>
                            <RefreshSVG
                                className="nav-icon should-invert character-refresh-button"
                                style={{ cursor: "pointer" }}
                                onClick={() => {
                                    refreshButtonHandler();
                                    fetchCharacterData();
                                }}
                            />
                        </div>
                        {!character.RaidActivity && (
                            <span
                                style={{
                                    fontSize: "1.3rem",
                                    color: "var(--text-faded)",
                                }}
                            >
                                {showFailedToFetchError
                                    ? "Failed to load"
                                    : "Loading..."}
                            </span>
                        )}
                        {character.RaidActivity &&
                            character.RaidActivity.length == 0 && (
                                <span
                                    style={{
                                        fontSize: "1.3rem",
                                        color: "var(--text-faded)",
                                    }}
                                >
                                    No raid timers on record
                                </span>
                            )}
                        {character.RaidActivity &&
                            character.RaidActivity.length > 0 && (
                                <table
                                    className="character-table"
                                    style={{
                                        width: "100%",
                                    }}
                                >
                                    <thead>
                                        <tr
                                            style={{
                                                color: "var(--text-faded)",
                                                fontWeight: "bold",
                                                fontSize: "1.2rem",
                                                lineHeight: "15px",
                                            }}
                                        >
                                            <th
                                                style={{
                                                    width: "30%",
                                                }}
                                            >
                                                Raid
                                            </th>
                                            <th
                                                style={{
                                                    width: "70%",
                                                }}
                                            >
                                                Timer
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {character.RaidActivity.map(
                                            (raid, ri) => (
                                                <tr
                                                    key={ri}
                                                    style={{
                                                        fontSize: "1.3rem",
                                                    }}
                                                >
                                                    <td className="lfm-number">
                                                        {raid.name}
                                                    </td>
                                                    <td>
                                                        {getTimeTillEnd(raid)}
                                                    </td>
                                                </tr>
                                            )
                                        )}
                                    </tbody>
                                </table>
                            )}
                    </div>
                    <hr
                        style={{
                            backgroundColor: "var(--text)",
                            opacity: 0.2,
                            margin: "5px 3px",
                        }}
                    />
                    {i == characters.length - 1 && (
                        <div style={{ height: "20px" }} />
                    )}
                </div>
            ))}
        </div>
    );
};

export default TimerList;