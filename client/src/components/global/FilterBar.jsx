import React from "react";
import { ReactComponent as ServerSelectSVG } from "../../assets/global/server.svg";
import { ReactComponent as FilterSVG } from "../../assets/global/filter.svg";
import { ReactComponent as CloseSVG } from "../../assets/global/close.svg";
import { ReactComponent as CaptureSVG } from "../../assets/global/capture.svg";
import { ReactComponent as NotificationSVG } from "../../assets/global/notification.svg";
import { ReactComponent as FullscreenSVG } from "../../assets/global/fullscreen.svg";
import { ReactComponent as FullscreenExitSVG } from "../../assets/global/fullscreen-exit.svg";
import { ReactComponent as LinkSVG } from "../../assets/global/chain.svg";
import { ReactComponent as RefreshSVG } from "../../assets/global/refresh.svg";
import { ReactComponent as UpdateSVG } from "../../assets/global/update.svg";
import { Link, useNavigate } from "react-router-dom";
import $ from "jquery";
import { Log } from "../../services/CommunicationService";

const LfmFilterBar = (props) => {
  const [fullscreen, set_fullscreen] = React.useState(false);
  const history = useNavigate();
  const goBack = () => {
    history.goBack();
  };

  React.useEffect(() => {
    if (!props.minimal) {
      if (fullscreen) {
        $("#main-banner").css({ display: "none" });
        $("#main-nav").css({ display: "none" });
        $("#top-content-padding").css({ display: "none" });
      } else {
        $("#main-banner").css({ display: "block" });
        $("#main-nav").css({ display: "block" });
        $("#top-content-padding").css({ display: "block" });
      }
    }
  }, [fullscreen]);

  React.useEffect(() => {
    document
      .getElementById("filter-bar")
      ?.addEventListener("mouseleave", startCollapseTimeout);
    document
      .getElementById("filter-bar")
      ?.addEventListener("mouseenter", stopCollapseTimeout);
    startCollapseTimeout();

    return () => clearTimeout(collapseTimeout);
  }, []);

  function startCollapseTimeout() {
    clearTimeout(collapseTimeout);
    collapseTimeout = setTimeout(() => collapseFilterButtons(), 5000);
  }

  function stopCollapseTimeout() {
    clearTimeout(collapseTimeout);
  }

  let collapseTimeout;
  function collapseFilterButtons() {
    $(".filter-bar-item.collapsible").css({ maxWidth: `44px` });
    $(".filter-bar-item.collapsible span").css({ opacity: 0 });
    document
      .getElementById("filter-bar")
      ?.removeEventListener("mouseleave", startCollapseTimeout);
    document
      .getElementById("filter-bar")
      ?.removeEventListener("mouseenter", stopCollapseTimeout);
  }

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        width: "100%",
        top: "0px",
        maxWidth: props.maxWidth + "px",
      }}
    >
      <div
        className="show-on-mobile"
        style={{ width: "100%", height: "36px" }}
      />
      <div
        className="filter-bar"
        id="filter-bar"
        style={{
          top: "0px",
          maxWidth: props.maxWidth + "px",
        }}
      >
        <div style={{ display: "flex", flexDirection: "row" }}>
          {props.minimal && (
            <div className="filter-bar-item" onClick={() => props.closePanel()}>
              <CloseSVG className="nav-icon should-invert" />
              {props.currentServer && (
                <span className="filter-bar-text settings hide-on-mobile">
                  {props.currentServer}
                </span>
              )}
            </div>
          )}
          {props.minimal && (
            <a
              className="filter-bar-item no-link-decoration"
              href={props.permalink}
              target="_blank"
              onClick={() => {
                Log("Clicked permalink", props.permalink);
              }}
            >
              <LinkSVG className="nav-icon should-invert" />
              <span className="filter-bar-text settings hide-on-mobile">
                Permalink
              </span>
            </a>
          )}
          {!props.minimal && (
            <Link
              className="filter-bar-item server-selection"
              to={props.returnTo}
              style={{
                textDecoration: "none",
                color: "var(--text)",
              }}
            >
              <ServerSelectSVG
                className="nav-icon should-invert"
                style={{
                  width: "30px",
                  height: "30px",
                  paddingRight: "5px",
                }}
              />
              {props.currentServer}
            </Link>
          )}
          {props.showSave && !props.minimal && (
            <div
              className="filter-bar-item collapsible"
              style={{
                marginLeft: "auto",
                padding: "3px 7px",
              }}
              onClick={() => {
                Log("Took LFM screenshot", `Grouping ${props.currentServer}`);
                props.handleSaveButton();
              }}
            >
              <CaptureSVG className="nav-icon should-invert" />
              <span className="filter-bar-text settings hide-on-mobile">
                Screenshot
              </span>
            </div>
          )}
          {!props.hideFilterButton && (
            <div
              className="filter-bar-item collapsible"
              style={{
                marginLeft: props.minimal
                  ? "auto"
                  : props.showSave
                  ? ""
                  : "auto",
                padding: "3px 7px",
              }}
              onClick={props.handleFilterButton}
            >
              <FilterSVG className="nav-icon should-invert" />
              <span className="filter-bar-text settings hide-on-mobile">
                Filters
              </span>
            </div>
          )}
          {props.showNotifications && !props.minimal && (
            <Link
              to="/notifications"
              className="filter-bar-item collapsible"
              style={{
                color: "var(--text)",
                textDecoration: "none",
                padding: "3px 7px",
              }}
            >
              <NotificationSVG className="nav-icon should-invert" />
              <span className="filter-bar-text notifications hide-on-mobile">
                Notifications
              </span>
            </Link>
          )}
          {!props.minimal && (
            <div
              className="filter-bar-item hide-on-mobile collapsible"
              style={{
                color: "var(--text)",
                textDecoration: "none",
                padding: "3px 7px",
              }}
              onClick={() => {
                if (!fullscreen) {
                  Log("Entered fullscreen", `Grouping ${props.currentServer}`);
                }
                set_fullscreen(!fullscreen);
              }}
            >
              {fullscreen ? (
                <FullscreenExitSVG className="nav-icon should-invert " />
              ) : (
                <FullscreenSVG className="nav-icon should-invert" />
              )}
              <span
                className="filter-bar-text"
                style={{ whiteSpace: "nowrap" }}
              >
                {fullscreen ? "Go back" : "Fullscreen"}
              </span>
            </div>
          )}
          {props.showRefreshButton && (
            <div
              className="filter-bar-item"
              onClick={props.handleRefreshButton}
            >
              {props.failedToFetchCharacters ? (
                <>
                  <UpdateSVG
                    className="nav-icon should-invert"
                    id={
                      props.returnTo === "/grouping"
                        ? "lfm-refresh-button"
                        : "who-refresh-button"
                    }
                  />
                  <span
                    className="filter-bar-text"
                    style={{ marginLeft: "5px" }}
                  >
                    Refresh characters
                  </span>
                </>
              ) : props.failedToFetchRaidActivity ? (
                <>
                  <UpdateSVG
                    className="nav-icon should-invert"
                    id={
                      props.returnTo === "/grouping"
                        ? "lfm-refresh-button"
                        : "who-refresh-button"
                    }
                  />
                  <span
                    className="filter-bar-text"
                    style={{ marginLeft: "5px" }}
                  >
                    Refresh raid timers
                  </span>
                </>
              ) : (
                <RefreshSVG
                  className="nav-icon should-invert"
                  id={
                    props.returnTo === "/grouping"
                      ? "lfm-refresh-button"
                      : "who-refresh-button"
                  }
                />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LfmFilterBar;
