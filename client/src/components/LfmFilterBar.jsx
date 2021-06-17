import React from "react";
import { ReactComponent as ServerSelectSVG } from "../assets/global/server.svg";
import { ReactComponent as FilterSVG } from "../assets/global/filter.svg";
import { ReactComponent as NotificationSVG } from "../assets/global/notification.svg";
import { ReactComponent as FullscreenSVG } from "../assets/global/fullscreen.svg";
import { ReactComponent as FullscreenExitSVG } from "../assets/global/fullscreen-exit.svg";
import { Link, useHistory } from "react-router-dom";

const LfmFilterBar = (props) => {
    const [fullscreen, set_fullscreen] = React.useState(false);
    const history = useHistory();
    const goBack = () => {
        history.goBack();
    };

    return (
        <div
            className="lfm-filter-bar"
            style={{ position: fullscreen ? "fixed" : "relative", top: "0px" }}
        >
            <div style={{ display: "flex", flexDirection: "row" }}>
                <Link
                    className="lfm-filter-bar-item server-selection"
                    to="/grouping"
                    style={{
                        textDecoration: "none",
                        color: "var(--text)",
                    }}
                >
                    <ServerSelectSVG
                        className="link-icon"
                        style={{
                            width: "30px",
                            height: "30px",
                            paddingRight: "5px",
                        }}
                    />
                    {props.currentServer}
                </Link>
                <div
                    className="lfm-filter-bar-item"
                    style={{ marginLeft: "auto" }}
                    onClick={props.handleFilterButton}
                >
                    <FilterSVG
                        className="link-icon"
                        style={{
                            width: "30px",
                            height: "30px",
                            paddingRight: "5px",
                        }}
                    />
                    <span className="lfm-filter-bar-text">Filter</span>
                </div>
                <div className="lfm-filter-bar-item">
                    <NotificationSVG
                        className="link-icon"
                        style={{
                            width: "30px",
                            height: "30px",
                            paddingRight: "5px",
                        }}
                    />
                    <span className="lfm-filter-bar-text">Notifications</span>
                </div>
                <div
                    className="lfm-filter-bar-item hide-on-mobile"
                    onClick={() => {
                        set_fullscreen(!fullscreen);
                    }}
                >
                    {fullscreen ? (
                        <FullscreenExitSVG
                            className="link-icon "
                            style={{
                                width: "30px",
                                height: "30px",
                                paddingRight: "5px",
                            }}
                        />
                    ) : (
                        <FullscreenSVG
                            className="link-icon"
                            style={{
                                width: "30px",
                                height: "30px",
                                paddingRight: "5px",
                            }}
                        />
                    )}
                    <span className="lfm-filter-bar-text">
                        {fullscreen ? "Go back" : "Fullscreen"}
                    </span>
                </div>
            </div>
            {props.children}
        </div>
    );
};

export default LfmFilterBar;
