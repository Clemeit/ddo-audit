import React from "react";
import ContentCluster from "../global/ContentCluster";
import { ReactComponent as CloseSVG } from "../../assets/global/close.svg";

const SelectFriend = (props) => {
    function close() {
        props.handleClose();
    }

    return (
        <div className="absolute-center">
            <div className="overlay" onClick={() => close()} />
            <div
                className="popup-message fullscreen"
                style={{
                    minWidth: "unset",
                    width: "unset",
                    padding: "20px 0px",
                    maxHeight: "90%",
                    overflowY: "auto",
                }}
            >
                <CloseSVG
                    className="link-icon"
                    style={{
                        position: "absolute",
                        top: "5px",
                        right: "5px",
                        cursor: "pointer",
                    }}
                    onClick={() => close()}
                />
                <ContentCluster
                    title={
                        <div
                            style={{
                                display: "flex",
                                flexDirection: "row",
                                alignItems: "center",
                            }}
                        >
                            Select a character or guild
                        </div>
                    }
                    noLink={true}
                    altTitle="Select"
                    description=""
                    noMargin={true}
                >
                    <span style={{ marginBottom: "0px", fontSize: "1.3rem" }}>
                        {props.data.characters.map((character, i) => (
                            <div
                                key={i}
                                className="nav-box small"
                                onClick={() => {
                                    props.characterSelected(character);
                                    close();
                                }}
                            >
                                <h2
                                    className="nav-box-title"
                                    style={{ fontSize: "1.4rem" }}
                                >
                                    {character.name}
                                </h2>
                                <span>
                                    <span className="lfm-number">
                                        {character.server}{" "}
                                    </span>
                                    | Level {character.totallevel}{" "}
                                    {character.guild && `| ${character.guild}`}
                                </span>
                            </div>
                        ))}
                        {props.data.guilds.map((guild, i) => (
                            <div
                                key={i}
                                className="nav-box small"
                                onClick={() => {
                                    props.guildSelected(guild);
                                    close();
                                }}
                            >
                                <h2
                                    className="nav-box-title"
                                    style={{ fontSize: "1.4rem" }}
                                >
                                    {guild.name}
                                </h2>
                                <span>
                                    <span className="lfm-number">
                                        {guild.server}{" "}
                                    </span>
                                    | {guild.membercount} members
                                </span>
                            </div>
                        ))}
                    </span>
                </ContentCluster>
            </div>
        </div>
    );
};

export default SelectFriend;
