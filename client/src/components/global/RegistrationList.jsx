import React from "react";
import CharacterSelectModal from "./CharacterSelectModal";
import { ReactComponent as DeleteSVG } from "../../assets/global/delete.svg";
import { ReactComponent as RefreshSVG } from "../../assets/global/refresh.svg";
import { Post } from "../../services/DataLoader";
import $ from "jquery";

const RegistrationList = (props) => {
    const CHARACTER_LIMIT = 10;

    const [characterIds, setCharacterIds] = React.useState([]);
    const [characters, setCharacters] = React.useState([]);
    const [characterSelectModalShown, setCharacterSelectModalShown] =
        React.useState(false);
    const [characterExists, setCharacterExists] = React.useState(false);
    const [loading, setLoading] = React.useState(true);

    function addCharacter(characterId) {
        if (characterIds.includes(characterId)) {
            setCharacterExists(true);
            return;
        }
        setCharacterExists(false);
        setCharacterIds((characterIds) => [...characterIds, characterId]);
        setCharacterSelectModalShown(false);
    }

    function removeCharacter(index) {
        setCharacterIds((characterIds) =>
            characterIds.filter((_, i) => i != index)
        );
    }

    React.useEffect(() => {
        let registedCharacters = JSON.parse(
            localStorage.getItem("registered-characters") || "[]"
        );
        if (registedCharacters.length) {
            setCharacterIds(registedCharacters);
        }
    }, []);

    const refreshButtonAngleRef = React.useRef(null);
    function refreshButtonHandler() {
        refreshButtonAngleRef.current += 360;
        $(`.character-refresh-button`).css({
            transform: `rotate(${refreshButtonAngleRef.current}deg)`,
        });
    }

    function refreshCharacters() {
        // lookup each character by ID and populate 'characters' list
        setLoading(true);
        localStorage.setItem(
            "registered-characters",
            JSON.stringify(characterIds)
        );

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
            let sorted = [];
            characterIds.forEach((id) => {
                sorted.push(
                    returnedCharacters.filter((c) => c.PlayerId == id)[0]
                );
            });
            setCharacters(sorted);
            // setLoading(false);
        });
    }

    React.useEffect(() => {
        if (characterIds) {
            setLoading(true);
            refreshCharacters();
        } else {
            setLoading(false);
        }
    }, [characterIds]);

    function getClassString(character) {
        let classes = [];
        character.Classes.forEach((cls) => {
            if (cls.Name != null && cls.Name != "Epic") {
                classes.push(`${cls.Name} ${cls.Level}`);
            }
        });
        return classes.join(", ");
    }

    function getStatusIndicatorColor(character) {
        if (character.Anonymous) {
            return "blue";
        } else {
            return character.Online ? "green" : "red";
        }
    }

    function atCharacterLimit() {
        return characterIds.length >= CHARACTER_LIMIT;
    }

    return (
        <div>
            {characterSelectModalShown && (
                <CharacterSelectModal
                    submit={(characterId) => addCharacter(characterId)}
                    close={() => setCharacterSelectModalShown(false)}
                    characterExists={characterExists}
                />
            )}
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "20px",
                }}
            >
                {loading && (!characters || characters.length == 0) && (
                    <span
                        style={{
                            textAlign: "center",
                            fontSize: "1.4rem",
                        }}
                    >
                        Loading...
                    </span>
                )}
                {characters &&
                    characters.length > 0 &&
                    characters.map((character, i) => (
                        <div key={i}>
                            <div
                                style={{
                                    display: "flex",
                                    flexDirection: "row",
                                    alignItems: "center",
                                    marginBottom: "15px",
                                }}
                            >
                                <div
                                    style={{
                                        backgroundColor:
                                            getStatusIndicatorColor(character),
                                        width: "13px",
                                        height: "13px",
                                        borderRadius: "100%",
                                        marginRight: "7px",
                                    }}
                                />
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
                                    onClick={() => removeCharacter(i)}
                                />
                                <RefreshSVG
                                    className="nav-icon should-invert character-refresh-button"
                                    style={{ cursor: "pointer" }}
                                    onClick={() => {
                                        refreshCharacters(i);
                                        refreshButtonHandler();
                                    }}
                                />
                            </div>
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
                                                width: "10%",
                                            }}
                                        >
                                            Server
                                        </th>
                                        <th
                                            style={{
                                                width: "10%",
                                            }}
                                        >
                                            Level
                                        </th>
                                        <th
                                            style={{
                                                width: "20%",
                                            }}
                                        >
                                            Guild
                                        </th>
                                        <th
                                            style={{
                                                width: "30%",
                                            }}
                                        >
                                            Classes
                                        </th>
                                        <th
                                            style={{
                                                width: "30%",
                                            }}
                                        >
                                            Location
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr
                                        style={{
                                            fontSize: "1.4rem",
                                        }}
                                    >
                                        <td>{character.Server}</td>
                                        <td>{character.TotalLevel}</td>
                                        <td>{character.Guild}</td>
                                        <td>{getClassString(character)}</td>
                                        <td>{character.Location.Name}</td>
                                    </tr>
                                </tbody>
                            </table>
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
            <div>
                {!atCharacterLimit() && (
                    <div
                        className="primary-button should-invert"
                        onClick={() => {
                            setCharacterSelectModalShown(true);
                            setCharacterExists(false);
                        }}
                    >
                        Add Character
                    </div>
                )}
                {atCharacterLimit() && (
                    <span
                        style={{
                            fontSize: "1.3rem",
                            color: "var(--text-faded)",
                        }}
                    >
                        Character limit reached. You may have up to{" "}
                        {CHARACTER_LIMIT} registered characters.
                    </span>
                )}
            </div>
        </div>
    );
};

export default RegistrationList;
