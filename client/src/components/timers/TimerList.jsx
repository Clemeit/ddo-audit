import React from "react";
import { Post } from "../../services/DataLoader";
import { ReactComponent as DeleteSVG } from "../../assets/global/delete.svg";
import { ReactComponent as RefreshSVG } from "../../assets/global/refresh.svg";

const TimerList = () => {
    const [characterIds, setCharacterIds] = React.useState();
    const [characters, setCharacters] = React.useState([]);
    const [loading, setLoading] = React.useState(true);

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

    function fetchCharacterData() {
        let returnedCharacters = [];
        let lookups = [];
        characterIds.forEach((id) => {
            lookups.push(
                Post(
                    "http://localhost:23451/players/lookup",
                    { playerid: id },
                    10000
                ).then((res) => {
                    returnedCharacters.push({ ...res, PlayerId: id });
                })
            );
        });
        if (lookups.length === 0) {
            setLoading(false);
        }
        Promise.all(lookups).then(() => {
            appendRaidActivity(returnedCharacters);
        });
    }

    function appendRaidActivity(characters) {
        let returnedCharacters = [];
        let lookups = [];
        characters.forEach((character) => {
            lookups.push(
                Post(
                    "http://localhost:23451/players/raidactivity",
                    { playerid: character.PlayerId },
                    10000
                ).then((res) => {
                    returnedCharacters.push({
                        ...character,
                        RaidActivity: res,
                    });
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
            {loading && (!characters || characters.length == 0) && (
                <span style={{ textAlign: "center", fontSize: "1.4rem" }}>
                    Loading...
                </span>
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
                            <DeleteSVG
                                className="nav-icon should-invert"
                                style={{ cursor: "pointer" }}
                                onClick={() => {}}
                            />
                            <RefreshSVG
                                className="nav-icon should-invert character-refresh-button"
                                style={{ cursor: "pointer" }}
                                onClick={() => {}}
                            />
                        </div>
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
