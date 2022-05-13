import React from "react";
import { ReactComponent as CloseSVG } from "../../assets/global/close.svg";
import { ReactComponent as ErrorSVG } from "../../assets/global/error.svg";
import { ReactComponent as WarningSVG } from "../../assets/global/warning.svg";
import { Fetch, Post } from "../../services/DataLoader";

const CharacterSelectModal = (props) => {
    const [lookupError, setLookupError] = React.useState(false);
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
        setIsLoading(true);
        if (!name || !server) {
            setLookupError(true);
            return;
        }
        Post(
            "https://api.ddoaudit.com/players/lookup",
            { name: name, server: server },
            10000
        ).then((res) => {
            if (res.playerid) {
                props.submit(res.playerid);
            } else {
                setLookupError(true);
            }
            setIsLoading(false);
        });
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
                    <div
                        style={{
                            widht: "100%",
                            border: "1px solid red",
                            borderRadius: "4px",
                            padding: "7px 10px",
                            marginBottom: "5px",
                        }}
                    >
                        <span
                            style={{
                                fontSize: "1.1rem",
                                fontWeight: "bold",
                                display: "flex",
                                flexDirection: "row",
                                alignItems: "center",
                            }}
                        >
                            <ErrorSVG style={{ marginRight: "5px" }} />
                            Character not found
                        </span>
                        <span style={{ fontSize: "1.1rem" }}>
                            Check that the name and server are correct, and
                            ensure that the character is not marked as
                            anonymous.
                        </span>
                    </div>
                )}
                {props.characterExists && (
                    <div
                        style={{
                            widht: "100%",
                            border: "1px solid orange",
                            borderRadius: "4px",
                            padding: "7px 10px",
                            marginBottom: "5px",
                        }}
                    >
                        <span
                            style={{
                                fontSize: "1.1rem",
                                fontWeight: "bold",
                                display: "flex",
                                flexDirection: "row",
                                alignItems: "center",
                            }}
                        >
                            <WarningSVG style={{ marginRight: "5px" }} />
                            Registration
                        </span>
                        <span style={{ fontSize: "1.1rem" }}>
                            This character is already registered.
                        </span>
                    </div>
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
