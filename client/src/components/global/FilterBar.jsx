import React from "react";
import { ReactComponent as ServerSelectSVG } from "../../assets/global/server.svg";
import { ReactComponent as FilterSVG } from "../../assets/global/filter.svg";
import { ReactComponent as SettingsSVG } from "../../assets/global/settings.svg";
import { ReactComponent as NotificationSVG } from "../../assets/global/notification.svg";
import { ReactComponent as FullscreenSVG } from "../../assets/global/fullscreen.svg";
import { ReactComponent as FullscreenExitSVG } from "../../assets/global/fullscreen-exit.svg";
import { Link, useHistory } from "react-router-dom";

const LfmFilterBar = (props) => {
    const [fullscreen, set_fullscreen] = React.useState(false);
    const history = useHistory();
    const goBack = () => {
        history.goBack();
    };

    return (
        <div
            className="filter-bar"
            style={{ position: fullscreen ? "fixed" : "relative", top: "0px" }}
        >
            <div style={{ display: "flex", flexDirection: "row" }}>
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
                <div
                    className="filter-bar-item"
                    style={{ marginLeft: "auto" }}
                    onClick={props.handleFilterButton}
                >
                    <SettingsSVG
                        className="nav-icon should-invert"
                        style={{
                            width: "30px",
                            height: "30px",
                            paddingRight: "5px",
                        }}
                    />
                    <span className="filter-bar-text settings hide-on-mobile">
                        Settings
                    </span>
                </div>
                {props.showNotifications && (
                    <Link
                        to="/notifications"
                        className="filter-bar-item"
                        style={{ color: "var(--text)", textDecoration: "none" }}
                    >
                        <NotificationSVG
                            className="nav-icon should-invert"
                            style={{
                                width: "30px",
                                height: "30px",
                                paddingRight: "5px",
                            }}
                        />
                        <span className="filter-bar-text notifications hide-on-mobile">
                            Notifications
                        </span>
                    </Link>
                )}
                <div
                    className="filter-bar-item hide-on-mobile"
                    onClick={() => {
                        set_fullscreen(!fullscreen);
                    }}
                >
                    {fullscreen ? (
                        <FullscreenExitSVG
                            className="nav-icon should-invert "
                            style={{
                                width: "30px",
                                height: "30px",
                                paddingRight: "5px",
                            }}
                        />
                    ) : (
                        <FullscreenSVG
                            className="nav-icon should-invert"
                            style={{
                                width: "30px",
                                height: "30px",
                                paddingRight: "5px",
                            }}
                        />
                    )}
                    <span className="filter-bar-text">
                        {fullscreen ? "Go back" : "Fullscreen"}
                    </span>
                </div>
            </div>
            {props.children}
        </div>
    );
};

export default LfmFilterBar;
