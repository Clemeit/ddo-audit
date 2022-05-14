import React from "react";
import { ReactComponent as CloseSVG } from "../../assets/global/close.svg";
import { ReactComponent as ErrorSVG } from "../../assets/global/error.svg";
import { ReactComponent as WarningSVG } from "../../assets/global/warning.svg";
import { Log } from "../../services/CommunicationService";
import { Fetch, Post } from "../../services/DataLoader";
import PageMessage from "./PageMessage";

const CharacterSelectModal = (props) => {
    const [lookupError, setLookupError] = React.useState(false);
    const [errorTitle, setErrorTitle] = React.useState("");
    const [errorMessage, setErrorMessage] = React.useState("");
    const [isLoading, setIsLoading] = React.useState(false);

    const SERVER_NAMES = [
        "Argonnessen",
        "Cannith",
        "Ghallanda",
        "Khyber",
        "Orien",
        "Sarlona",
        "Thelanis",
        "Wayfinder",
        // "Hardcore",
    ];

    const [name, setName] = React.useState("");
    const [server, setServer] = React.useState("Argonnessen");

    function getCharacterHash() {
        if (isLoading) return;
        if (!name || !server) {
            setErrorTitle("Invalid input");
            setErrorMessage("Please enter a name and server.");
            setLookupError(true);
            return;
        }
        let validString = /^[a-zA-Z0-9\-]+$/;
        if (!validString.test(name) || name.length === 0 || name.length > 20) {
            setErrorTitle("Invalid input");
            setErrorMessage("Please enter a valid name and server.");
            setLookupError(true);
            return;
        }
        setIsLoading(true);
        Post(
            "https://api.ddoaudit.com/players/lookup",
            { name: name.trim(), server: server },
            10000
        )
            .then((res) => {
                if (res.playerid) {
                    Log("Registered character", `${name.trim()}, ${server}`);
                    props.submit(res.playerid);
                } else {
                    Log(
                        "Character registration failed",
                        `Not found: ${name.trim()}, ${server}`
                    );
                    setErrorTitle("Character not found");
                    setErrorMessage(
                        "Check that the name and server are correct, and ensure that the character is not marked as anonymous."
                    );
                    setLookupError(true);
                }
            })
            .catch(() => {
                Log("Character registration failed", "Timeout");
                setErrorTitle("Failed to fetch character data");
                setErrorMessage(
                    "The server took too long to respond. Please try again later."
                );
                setLookupError(true);
            })
            .finally(() => setIsLoading(false));
    }

    React.useEffect(() => {
        document.getElementById("name-input").focus();
    }, []);

    return (
        <div className="absolute-center">
            <div className="overlay" onClick={() => props.close()} />
            <div className="popup-message fullscreen">
                <CloseSVG
                    className="link-icon should-invert"
                    style={{
                        position: "absolute",
                        top: "5px",
                        right: "5px",
                        cursor: "pointer",
                    }}
                    onClick={() => props.close()}
                />
                <h2>Add Character</h2>
                {lookupError && (
                    <PageMessage
                        type="error"
                        title={errorTitle}
                        message={errorMessage}
                        fontSize={1.1}
                    />
                )}
                {props.characterExists && !lookupError && (
                    <PageMessage
                        type="warning"
                        title="Duplicate entry"
                        message="This character is already registered."
                        fontSize={1.1}
                    />
                )}
                <label
                    style={{
                        fontSize: "1.2rem",
                        color: "var(--text-faded)",
                        display: "flex",
                        flexDirection: "column",
                    }}
                >
                    Name
                    <input
                        id="name-input"
                        disabled={isLoading}
                        value={name}
                        onChange={(e) => {
                            setName(e.target.value);
                            setLookupError(false);
                        }}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                document
                                    .getElementById("server-select-field")
                                    .focus();
                            }
                        }}
                    />
                </label>
                <label
                    style={{
                        fontSize: "1.2rem",
                        color: "var(--text-faded)",
                        display: "flex",
                        flexDirection: "column",
                    }}
                >
                    Server
                    <select
                        id="server-select-field"
                        disabled={isLoading}
                        style={{ fontSize: "1.3rem", padding: "5px 1px" }}
                        value={server}
                        onChange={(e) => {
                            setServer(e.target.value);
                            setLookupError(false);
                        }}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                getCharacterHash();
                            }
                        }}
                    >
                        {SERVER_NAMES.map((server) => (
                            <option value={server}>{server}</option>
                        ))}
                    </select>
                </label>
                <div
                    className={`primary-button should-invert${
                        isLoading ? " disabled" : ""
                    }`}
                    style={{
                        marginLeft: "auto",
                        minWidth: "100px",
                        textAlign: "center",
                        marginTop: "10px",
                    }}
                    onClick={() => getCharacterHash()}
                >
                    {isLoading ? "Searching..." : "Add"}
                </div>
            </div>
        </div>
    );
};

export default CharacterSelectModal;
