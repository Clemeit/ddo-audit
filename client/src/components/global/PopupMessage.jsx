import React from "react";
import { ReactComponent as InfoSVG } from "../../assets/global/info.svg";
import { ReactComponent as WarningSVG } from "../../assets/global/warning.svg";
import { ReactComponent as ErrorSVG } from "../../assets/global/error.svg";
import { ReactComponent as CloseSVG } from "../../assets/global/close.svg";
import { Submit } from "../../services/ReportIssueService";

/*
 ** Use with preset messages:
 **     messageType="all servers offline"|"some servers offline"
 ** Or set custom messages:
 **     iconType="info"|"warning"|"error"
 **     title="string"
 **     message="string"
 */

const PopupMessage = (props) => {
    var [userClosed, set_userClosed] = React.useState(false);
    var [currentMessageType, set_currentMessageType] = React.useState("");
    var [currentTitle, set_currentTitle] = React.useState("");
    var [currentMessage, set_currentMessage] = React.useState("");
    var [currentSubmessage, set_currentSubmessage] = React.useState("");
    var [currentFullscreen, set_currentFullscreen] = React.useState(false);
    var [currentReportMessage, set_currentReportMessage] =
        React.useState(false);
    var [currentIcon, set_currentIcon] = React.useState("info");
    var [visibilityclass, set_visibilityClass] = React.useState("");
    var [reported, set_reported] = React.useState(false);
    React.useEffect(() => {
        if (props.messages.length) {
            if (!userClosed) {
                set_currentMessageType(props.messages[0].messageType);
                set_currentTitle(props.messages[0].title);
                set_currentMessage(props.messages[0].message);
                set_currentSubmessage(props.messages[0].submessage);
                set_currentFullscreen(props.messages[0].fullscreen);
                set_currentReportMessage(props.messages[0].reportMessage);
                set_currentIcon(props.messages[0].icon);
                set_visibilityClass("visible");
            }
        } else {
            set_visibilityClass("hidden");
        }
    }, [props.messages]);
    function displayIcon() {
        switch (currentMessageType) {
            case "all servers offline" |
                "some servers offline" |
                "all servers online":
                return <InfoSVG style={{ marginRight: "10px" }} />;
            default:
                switch (currentIcon) {
                    case "info":
                        return <InfoSVG style={{ marginRight: "10px" }} />;
                    case "warning":
                        return <WarningSVG style={{ marginRight: "10px" }} />;
                    case "error":
                        return <ErrorSVG style={{ marginRight: "10px" }} />;
                    default:
                        return <InfoSVG style={{ marginRight: "10px" }} />;
                }
        }
    }
    function getTitle() {
        switch (currentMessageType) {
            case "all servers offline":
                return "Servers Offline";
            case "some servers offline":
                return "Servers Offline";
            case "all servers online":
                return "Servers Online";
            default:
                return currentTitle;
        }
    }
    function getMessage() {
        switch (currentMessageType) {
            case "all servers offline":
                return "The game servers are temporarily offline.";
            case "some servers offline":
                return "Some servers are temporarily offline. Check the Servers page for more information.";
            case "all servers online":
                return "The game servers are online.";
            default:
                return currentMessage;
        }
    }
    return (
        <div>
            {props.messages.length & currentFullscreen ? (
                <div
                    className="overlay"
                    onClick={function () {
                        props.popMessage();
                        set_userClosed(true);
                    }}
                />
            ) : (
                <></>
            )}
            <div
                className={"popup-message " + visibilityclass}
                onClick={() => {
                    if (currentReportMessage === undefined) {
                        props.popMessage();
                        set_userClosed(true);
                    }
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
                    onClick={function () {
                        props.popMessage();
                        set_userClosed(true);
                    }}
                />
                <div
                    style={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        paddingBottom: "5px",
                    }}
                >
                    {displayIcon()}
                    <h2
                        style={{
                            padding: "0px",
                            margin: "0px",
                            fontSize: "1.6rem",
                        }}
                    >
                        {getTitle()}
                    </h2>
                </div>
                {/* <p style={{ marginBottom: "0px" }}>{getMessage()}</p> */}
                <p style={{ marginBottom: "0px", fontSize: "1.3rem" }}>
                    {getMessage()}
                </p>
                {currentSubmessage && (
                    <p
                        style={{
                            marginBottom: "0px",
                            fontSize: "1.3rem",
                            color: "var(--text-xfaded)",
                            overflow: "hidden",
                            whiteSpace: "nowrap",
                            textOverflow: "ellipsis",
                        }}
                    >
                        Reason: {currentSubmessage}
                    </p>
                )}
                {currentReportMessage && (
                    <div
                        id="action-button-container"
                        style={{
                            justifyContent: "right",
                        }}
                    >
                        <div
                            className="primary-button should-invert full-width-mobile"
                            onClick={() => window.location.reload()}
                        >
                            Refresh Page
                        </div>
                        <div
                            className={
                                "secondary-button should-invert full-width-mobile" +
                                (reported ? " disabled" : "")
                            }
                            onClick={() => {
                                if (reported === false) {
                                    Submit(
                                        props.page,
                                        null,
                                        currentSubmessage ||
                                            currentReportMessage,
                                        null
                                    );
                                    set_reported(true);
                                    set_userClosed(true);
                                }
                            }}
                        >
                            {reported ? "Thanks!" : "Report Issue"}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PopupMessage;
