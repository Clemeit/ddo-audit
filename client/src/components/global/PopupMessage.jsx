import React from "react";
import { ReactComponent as InfoSVG } from "../../assets/global/info.svg";
import { ReactComponent as WarningSVG } from "../../assets/global/warning.svg";
import { ReactComponent as ErrorSVG } from "../../assets/global/error.svg";
import { ReactComponent as CloseSVG } from "../../assets/global/close.svg";
import $ from "jquery";
import { Submit } from "../../services/CommunicationService";

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
  var [visible, setVisible] = React.useState("");
  var [reported, set_reported] = React.useState(false);

  React.useEffect(() => {
    if (props.message) {
      setVisible(true);
    } else {
      setVisible(false);
    }
  }, [props.message]);

  React.useEffect(() => {
    $(document).on("keydown.handleEscape", function (e) {
      if (e.key === "Escape") {
        props.popMessage();
        set_userClosed(true);
      }
    });

    return () => $(document).unbind("keydown.handleEscape");
  }, []);

  function displayIcon() {
    if (!props.message) return;
    switch (props.message.messageType) {
      case "all servers offline" |
        "some servers offline" |
        "all servers online":
        return <InfoSVG style={{ marginRight: "10px" }} />;
      default:
        switch (props.message.icon) {
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
    if (!props.message) return;
    switch (props.message.messageType) {
      case "all servers offline":
        return "Servers Offline";
      case "some servers offline":
        return "Servers Offline";
      case "all servers online":
        return "Servers Online";
      default:
        return props.message.title;
    }
  }
  function getMessage() {
    if (!props.message) return;
    switch (props.message.messageType) {
      case "all servers offline":
        return "The game servers are temporarily offline.";
      case "some servers offline":
        return "Some servers are temporarily offline. Check the Servers page for more information.";
      case "all servers online":
        return "The game servers are online.";
      default:
        return props.message.message;
    }
  }
  return (
    <div
      className={
        props.message != null
          ? props.message.fullscreen
            ? "absolute-center"
            : ""
          : ""
      }
    >
      {props.message ? (
        props.message.fullscreen && (
          <div
            className="overlay"
            onClick={function () {
              props.popMessage();
              set_userClosed(true);
            }}
          />
        )
      ) : (
        <></>
      )}
      {props.message && (
        <div
          style={{ visibility: visible ? "visible" : "hidden" }}
          className={
            "popup-message " + (props.message.fullscreen ? " fullscreen" : "")
          }
          onClick={() => {
            if (props.message.reportMessage === undefined) {
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
          <span style={{ marginBottom: "0px", fontSize: "1.3rem" }}>
            {getMessage()}
          </span>
          {props.message.submessage && (
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
              Reason: {props.message.submessage}
            </p>
          )}
          {props.message.reportMessage && (
            <div
              className="action-button-container"
              style={{
                justifyContent: "flex-end",
              }}
            >
              <div
                className={
                  "secondary-button should-invert full-width-mobile" +
                  (reported ? " disabled" : "")
                }
                onClick={() => {
                  if (reported === false) {
                    Submit(
                      "User reported issue from " + props.page + " popup",
                      props.message.submessage || props.message.reportMessage
                    );
                    set_reported(true);
                    set_userClosed(true);
                  }
                }}
              >
                {reported ? "Thanks!" : "Report Issue"}
              </div>
              <div
                className="primary-button should-invert full-width-mobile"
                onClick={() => window.location.reload()}
              >
                Refresh Page
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PopupMessage;
