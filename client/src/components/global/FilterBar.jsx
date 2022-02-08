import React from "react";
import { ReactComponent as ServerSelectSVG } from "../../assets/global/server.svg";
import { ReactComponent as FilterSVG } from "../../assets/global/filter.svg";
import { ReactComponent as CloseSVG } from "../../assets/global/close.svg";
import { ReactComponent as CaptureSVG } from "../../assets/global/capture.svg";
import { ReactComponent as NotificationSVG } from "../../assets/global/notification.svg";
import { ReactComponent as FullscreenSVG } from "../../assets/global/fullscreen.svg";
import { ReactComponent as FullscreenExitSVG } from "../../assets/global/fullscreen-exit.svg";
import { Link, useHistory } from "react-router-dom";
import $ from "jquery";

const LfmFilterBar = (props) => {
    const [fullscreen, set_fullscreen] = React.useState(false);
    const history = useHistory();
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
                style={{
                    top: "0px",
                    maxWidth: props.maxWidth + "px",
                }}
            >
                <div style={{ display: "flex", flexDirection: "row" }}>
                    {props.minimal && (
                        <div
                            className="filter-bar-item"
                            onClick={() => props.closePanel()}
                        >
                            <CloseSVG className="nav-icon should-invert" />
                            <span className="filter-bar-text settings hide-on-mobile">
                                {props.currentServer}
                            </span>
                        </div>
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
                            className="filter-bar-item"
                            style={{ marginLeft: "auto" }}
                            onClick={props.handleSaveButton}
                        >
                            <CaptureSVG className="nav-icon should-invert" />
                            <span className="filter-bar-text settings hide-on-mobile">
                                Screenshot
                            </span>
                        </div>
                    )}
                    <div
                        className="filter-bar-item"
                        style={{
                            marginLeft: props.minimal
                                ? "auto"
                                : props.showSave
                                ? ""
                                : "auto",
                        }}
                        onClick={props.handleFilterButton}
                    >
                        <FilterSVG className="nav-icon should-invert" />
                        <span className="filter-bar-text settings hide-on-mobile">
                            Filters
                        </span>
                    </div>
                    {props.showNotifications && !props.minimal && (
                        <Link
                            to="/notifications"
                            className="filter-bar-item"
                            style={{
                                color: "var(--text)",
                                textDecoration: "none",
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
                            className="filter-bar-item hide-on-mobile"
                            onClick={() => {
                                set_fullscreen(!fullscreen);
                            }}
                        >
                            {fullscreen ? (
                                <FullscreenExitSVG className="nav-icon should-invert " />
                            ) : (
                                <FullscreenSVG className="nav-icon should-invert" />
                            )}
                            <span className="filter-bar-text">
                                {fullscreen ? "Go back" : "Fullscreen"}
                            </span>
                        </div>
                    )}
                </div>
                {props.children}
            </div>
        </div>
    );
};

export default LfmFilterBar;
