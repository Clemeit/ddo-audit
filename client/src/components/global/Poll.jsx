import React from "react";
import { ReactComponent as VeryUnhappySVG } from "../../assets/global/very_unhappy.svg";
import { ReactComponent as UnhappySVG } from "../../assets/global/unhappy.svg";
import { ReactComponent as NeutralSVG } from "../../assets/global/neutral.svg";
import { ReactComponent as HappySVG } from "../../assets/global/happy.svg";
import { ReactComponent as VeryHappySVG } from "../../assets/global/very_happy.svg";
import { Submit } from "../../services/ReportIssueService";

const Poll = (props) => {
    const POLL_OPTIONS = [
        {
            id: 1,
            title: "LFM Viewer ('Grouping' page)",
        },
        {
            id: 2,
            title: "Player lookup ('Who' page)",
        },
        {
            id: 3,
            title: "Server Status ('Live' page)",
        },
        {
            id: 4,
            title: "Website loading times",
        },
        {
            id: 5,
            title: "Website visual appearance",
        },
    ];

    const [voteStates, setVoteStates] = React.useState([-1, -1, -1, -1, -1]);
    const [isPollClosed, setIsPollClosed] = React.useState(false);

    function handleVote(index, selection) {
        let copy = [...voteStates];
        copy[index] = selection;
        setVoteStates([...copy]);

        let complete = true;
        for (let i = 0; i < 5; i++) {
            if (copy[i] === -1) complete = false;
        }
        if (complete) {
            clearTimeout(closePoll);
            closePoll = setTimeout(() => {
                setIsPollClosed(true);
                localStorage.setItem("has-completed-poll", true);
                Submit(
                    "poll",
                    "",
                    `LFM Viewer: ${copy[0] + 1}/5\nWho Panel: ${
                        copy[1] + 1
                    }/5\nServer Status: ${copy[2] + 1}/5\nLoading times: ${
                        copy[3] + 1
                    }/5\nVisual appearance: ${copy[4] + 1}/5`,
                    ""
                );
            }, 2000);
        }
    }

    let closePoll;

    return (
        <div className="content-cluster">
            <h2 style={{ color: "var(--text)" }}>Poll</h2>
            <hr
                style={{
                    backgroundColor: "var(--text)",
                    opacity: 0.2,
                }}
            />
            <div className="poll">
                {!isPollClosed && (
                    <p
                        style={{
                            display: "block",
                            fontSize: "1.5rem",
                            lineHeight: "normal",
                            color: "var(--text-faded)",
                            marginBottom: "0px",
                        }}
                    >
                        Got 15 seconds for a poll? Your feedback helps a lot!
                    </p>
                )}
                {!isPollClosed ? (
                    POLL_OPTIONS.map((option, i) => (
                        <div key={i} className="poll-option">
                            <span className="poll-title">{option.title}</span>
                            <div className="poll-options">
                                <VeryUnhappySVG
                                    className={
                                        "vote-icon nav-icon should-invert" +
                                        (voteStates[i] !== -1
                                            ? voteStates[i] === 0
                                                ? " active"
                                                : " inactive"
                                            : "")
                                    }
                                    onClick={() => handleVote(i, 0)}
                                />
                                <UnhappySVG
                                    className={
                                        "vote-icon nav-icon should-invert" +
                                        (voteStates[i] !== -1
                                            ? voteStates[i] === 1
                                                ? " active"
                                                : " inactive"
                                            : "")
                                    }
                                    onClick={() => handleVote(i, 1)}
                                />
                                <NeutralSVG
                                    className={
                                        "vote-icon nav-icon should-invert" +
                                        (voteStates[i] !== -1
                                            ? voteStates[i] === 2
                                                ? " active"
                                                : " inactive"
                                            : "")
                                    }
                                    onClick={() => handleVote(i, 2)}
                                />
                                <HappySVG
                                    className={
                                        "vote-icon nav-icon should-invert" +
                                        (voteStates[i] !== -1
                                            ? voteStates[i] === 3
                                                ? " active"
                                                : " inactive"
                                            : "")
                                    }
                                    onClick={() => handleVote(i, 3)}
                                />
                                <VeryHappySVG
                                    className={
                                        "vote-icon nav-icon should-invert" +
                                        (voteStates[i] !== -1
                                            ? voteStates[i] === 4
                                                ? " active"
                                                : " inactive"
                                            : "")
                                    }
                                    onClick={() => handleVote(i, 4)}
                                />
                            </div>
                        </div>
                    ))
                ) : (
                    <p
                        style={{
                            display: "block",
                            fontSize: "1.5rem",
                            lineHeight: "normal",
                            color: "var(--text-faded)",
                        }}
                    >
                        Thanks!
                    </p>
                )}
            </div>
        </div>
    );
};

export default Poll;
