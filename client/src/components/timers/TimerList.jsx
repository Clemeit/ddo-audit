import React from "react";
import { Post } from "../../services/DataLoader";
import { ReactComponent as InfoSVG } from "../../assets/global/info.svg";
import { ReactComponent as RefreshSVG } from "../../assets/global/refresh.svg";
import { ReactComponent as ErrorSVG } from "../../assets/global/error.svg";
import { ReactComponent as DeleteSVG } from "../../assets/global/delete.svg";
import PageMessage from "../global/PageMessage";
import { Link } from "react-router-dom";
import $ from "jquery";
import { Log } from "../../services/CommunicationService";
import YesNoModal from "../global/YesNoModal";

const TimerList = () => {
    const [characterIds, setCharacterIds] = React.useState(null);
    const [characters, setCharacters] = React.useState();
    const [loading, setLoading] = React.useState(true);
    const [showFailedToFetchError, setShowFailedToFetchError] =
        React.useState(false);
    const [showYesNoModal, setShowYesNoModal] = React.useState(false);
    const [selectedTimerId, setSelectedTimerId] = React.useState(-1);
    const [hiddenTimerIds, setHiddenTimerIds] = React.useState([]);

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

    React.useEffect(() => {
        if (hiddenTimerIds && characters) {
            appendRaidActivity(characters);
        }
    }, [hiddenTimerIds]);

    const refreshButtonAngleRef = React.useRef(null);
    function refreshButtonHandler() {
        refreshButtonAngleRef.current += 360;
        $(`.character-refresh-button`).css({
            transform: `rotate(${refreshButtonAngleRef.current}deg)`,
        });
    }

    function fetchCharacterData() {
        if (!characterIds || characterIds.length === 0) {
            setLoading(false);
            return;
        }
        setLoading(true);
        Post(
            "https://api.ddoaudit.com/players/lookup",
            { playerids: characterIds },
            10000
        )
            .then((response) => {
                if (response.error) {
                    setLoading(false);
                    setShowFailedToFetchError(true);
                    Log(
                        "Failed to fetch characters",
                        `${response.error || "No error"}`
                    );
                } else {
                    setCharacters(response);
                    appendRaidActivity(response);
                }
            })
            .catch(() => {
                setLoading(false);
                setShowFailedToFetchError(true);
                Log("Failed to fetch characters", "Timeout");
            });
    }

    function appendRaidActivity(characters) {
        if (characters == null) {
            setCharacters([]);
        }
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
                        Log(
                            "Failed to fetch raid timers",
                            `Timeout for ${character.Name}`
                        );
                    })
            );
        });

        if (lookups.length !== 0) {
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
                    for (
                        let i = character.RaidActivity.length - 1;
                        i >= 0;
                        i--
                    ) {
                        if (raids.includes(character.RaidActivity[i].name)) {
                            character.RaidActivity =
                                character.RaidActivity.filter(
                                    (_, index) => i != index
                                );
                        } else {
                            raids.push(character.RaidActivity[i].name);
                        }
                    }
                });

                // remove raids hidden by the user
                returnedCharacters.forEach((character) => {
                    character.RaidActivity = character.RaidActivity.filter(
                        (raid) => !hiddenTimerIds.includes(raid.id)
                    );
                });

                returnedCharacters.sort(
                    (a, b) => b.RaidActivity?.length - a.RaidActivity?.length
                );
                setCharacters(returnedCharacters);
                setLoading(false);
            });
        }
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

    function removeRaidTimer() {
        if (selectedTimerId != null) {
            const hiddenTimerIds = JSON.parse(
                localStorage.getItem("hidden-raid-timer-ids") || "[]"
            );
            hiddenTimerIds.push(selectedTimerId);
            localStorage.setItem(
                "hidden-raid-timer-ids",
                JSON.stringify(hiddenTimerIds || [])
            );
            setHiddenTimerIds(hiddenTimerIds);
        }
        setShowYesNoModal(false);
        setSelectedTimerId(null);
    }

    React.useEffect(() => {
        const hiddenTimerIds = JSON.parse(
            localStorage.getItem("hidden-raid-timer-ids") || "[]"
        );
        setHiddenTimerIds(hiddenTimerIds);
    }, []);

    return (
        <div>
            {showYesNoModal && (
                <YesNoModal
                    title="Remove this raid timer?"
                    message="This will hide the current timer."
                    yes={() => removeRaidTimer()}
                    no={() => setShowYesNoModal(false)}
                    close={() => setShowYesNoModal(false)}
                />
            )}
            {showFailedToFetchError && (
                <PageMessage
                    type="error"
                    title="Failed to fetch character data"
                    message={
                        <>
                            Please try again later. If the error persists, try
                            clearing your browser cookies or let me know of the
                            problem via the{" "}
                            <Link to="/suggestions">Suggestions page</Link>.
                        </>
                    }
                    submessage="Reason: the server took too long to respond"
                    fontSize={1.3}
                    pushBottom={true}
                />
            )}
            {!loading &&
                !showFailedToFetchError &&
                (!characterIds || characterIds.length == 0) && (
                    <PageMessage
                        type="info"
                        title="No registered characters"
                        message={
                            <>
                                You need to add a character to track raid
                                timers. Please click the button below.
                            </>
                        }
                        fontSize={1.3}
                        pushBottom={true}
                    />
                )}
            {characters &&
                characters.map((character, i) => (
                    <div key={i}>
                        {character && (
                            <>
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
                                            {character.Name}{" "}
                                            <span
                                                style={{
                                                    color: "var(--text-faded)",
                                                }}
                                            >
                                                | {character.Server}
                                            </span>
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
                                                                width: "65%",
                                                            }}
                                                        >
                                                            Timer
                                                        </th>
                                                        <th
                                                            style={{
                                                                width: "5%",
                                                            }}
                                                        ></th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {character.RaidActivity.map(
                                                        (raid, ri) => (
                                                            <tr
                                                                key={ri}
                                                                style={{
                                                                    fontSize:
                                                                        "1.3rem",
                                                                }}
                                                            >
                                                                <td className="lfm-number">
                                                                    {raid.name}
                                                                </td>
                                                                <td>
                                                                    {getTimeTillEnd(
                                                                        raid
                                                                    )}
                                                                </td>
                                                                <td>
                                                                    <DeleteSVG
                                                                        className="fading-icon"
                                                                        onClick={() => {
                                                                            setShowYesNoModal(
                                                                                true
                                                                            );
                                                                            setSelectedTimerId(
                                                                                raid.id
                                                                            );
                                                                        }}
                                                                    />
                                                                </td>
                                                            </tr>
                                                        )
                                                    )}
                                                </tbody>
                                            </table>
                                        )}
                                </div>
                            </>
                        )}
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
            {loading && characters == null && (
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
        </div>
    );
};

export default TimerList;
