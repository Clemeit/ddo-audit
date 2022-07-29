import React from "react";
import { ReactComponent as CloseSVG } from "../../assets/global/close.svg";
import { ReactComponent as GroupingSVG } from "../../assets/global/grouping.svg";
import { ReactComponent as WhoSVG } from "../../assets/global/who.svg";
import ContentCluster from "../global/ContentCluster";
import { ReactComponent as ThumbsDownSVG } from "../../assets/global/thumbs_down.svg";
import { ReactComponent as ThumbsUpSVG } from "../../assets/global/thumbs_up.svg";
import { Submit } from "../../services/CommunicationService";
import { Link } from "react-router-dom";

const PanelSelectPopup = (props) => {
    const SERVER_NAMES = [
        "Argonnessen",
        "Cannith",
        "Ghallanda",
        "Khyber",
        "Orien",
        "Sarlona",
        "Thelanis",
        "Wayfinder",
        "Hardcore",
    ];

    const [voteMessage, setVoteMessage] = React.useState(null);
    const [mayVote, setMayVote] = React.useState(false);
    const [hasVoted, setHasVoted] = React.useState(false);
    React.useEffect(() => {
        let ls = localStorage.getItem("feature-vote-multiple-panels");
        if (ls == null) {
            setMayVote(true);
        } else {
            setMayVote(false);
        }
    }, []);

    const PANEL_TYPES = [
        {
            icon: <GroupingSVG className="nav-icon-large should-invert" />,
            title: "Live LFM Viewer",
            description:
                "Easily find groups with a live LFM panel for every server.",
            onClick: () => setPanelType("lfm"),
        },
        {
            icon: <WhoSVG className="nav-icon-large should-invert" />,
            title: "Live Who List",
            description:
                "Explore a list of online players with a live Who panel.",
            onClick: () => setPanelType("who"),
        },
    ];

    function vote(response) {
        if (response != null) {
            Submit("Feature: Multiple Panels", response);
            if (response === "Like") {
                setVoteMessage("positive");
            } else {
                setVoteMessage("negative");
            }
        } else {
            setVoteMessage("close");
            setMayVote(false);
        }
        setHasVoted(true);
        localStorage.setItem("feature-vote-multiple-panels", new Date());
    }

    function close() {
        setPanelType(null);
        props.handleClose();
    }

    const [panelType, setPanelType] = React.useState(null);

    return props.visible ? (
        <div className="absolute-center">
            <div className="overlay" onClick={() => close()} />
            <div
                className={"popup-message fullscreen"}
                style={{
                    minWidth: "unset",
                    width: "unset",
                    padding: "20px 0px",
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
                            {`Select a ${
                                panelType === null ? "Panel" : "Server"
                            }`}
                        </div>
                    }
                    noLink={true}
                    altTitle="Select"
                    description=""
                    noMargin={true}
                >
                    <span style={{ marginBottom: "0px", fontSize: "1.3rem" }}>
                        {panelType === null &&
                            PANEL_TYPES.map((t, i) => (
                                <div
                                    key={i}
                                    className={"nav-box small"}
                                    style={{
                                        height: "auto",
                                        minHeight: "150px",
                                    }}
                                    onClick={(e) => {
                                        t.onClick();
                                        e.stopPropagation();
                                    }}
                                >
                                    <div className="nav-box-title">
                                        {t.icon}
                                        <h2 className="content-option-title">
                                            {t.title}
                                        </h2>
                                    </div>
                                    <p className="content-option-description">
                                        {t.description}
                                    </p>
                                </div>
                            ))}
                        {panelType !== null &&
                            SERVER_NAMES.map((name, i) => (
                                <div
                                    key={i}
                                    className="nav-box small"
                                    onClick={() => {
                                        props.userSelected({
                                            type: panelType,
                                            server: name,
                                        });
                                        close();
                                    }}
                                >
                                    <h2 className="nav-box-title">{name}</h2>
                                </div>
                            ))}
                    </span>
                    {mayVote &&
                        (hasVoted ? (
                            <div className="feature-vote-container">
                                {voteMessage === "positive" ? (
                                    "Thanks!"
                                ) : voteMessage === "negative" ? (
                                    <span>
                                        Your{" "}
                                        <Link to="/suggestions">
                                            suggestions
                                        </Link>{" "}
                                        are welcome!
                                    </span>
                                ) : (
                                    ""
                                )}
                            </div>
                        ) : (
                            <div className="feature-vote-container">
                                <span style={{ cursor: "default" }}>
                                    Is this feature useful?
                                </span>
                                <ThumbsUpSVG
                                    className="nav-icon should-invert"
                                    style={{ cursor: "pointer" }}
                                    onClick={() => vote("Like")}
                                />
                                <ThumbsDownSVG
                                    className="nav-icon should-invert"
                                    style={{ cursor: "pointer" }}
                                    onClick={() => vote("Dislike")}
                                />
                                <CloseSVG
                                    className="nav-icon should-invert"
                                    style={{ cursor: "pointer" }}
                                    onClick={() => vote(null)}
                                />
                            </div>
                        ))}
                </ContentCluster>
            </div>
        </div>
    ) : (
        <div />
    );
};

export default PanelSelectPopup;
