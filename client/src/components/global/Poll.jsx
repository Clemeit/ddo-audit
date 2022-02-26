import React from "react";
import { ReactComponent as VeryUnhappySVG } from "../../assets/global/very_unhappy.svg";
import { ReactComponent as UnhappySVG } from "../../assets/global/unhappy.svg";
import { ReactComponent as NeutralSVG } from "../../assets/global/neutral.svg";
import { ReactComponent as HappySVG } from "../../assets/global/happy.svg";
import { ReactComponent as VeryHappySVG } from "../../assets/global/very_happy.svg";
import { Submit } from "../../services/CommunicationService";
import ContentCluster from "./ContentCluster";

const Poll = (props) => {
    const POLL_OPTIONS = [
        {
            id: 1,
            title: "LFM viewer ('Grouping' page)",
        },
        {
            id: 2,
            title: "Player lookup ('Who' page)",
        },
        {
            id: 3,
            title: "Server status ('Live' page)",
        },
        {
            id: 4,
            title: "Website loading times",
        },
        {
            id: 5,
            title: "Website visual appearance",
        },
        {
            id: 6,
            title: "DDO Audit usefulness",
        },
    ];

    const [voteStates, setVoteStates] = React.useState([
        -1, -1, -1, -1, -1, -1,
    ]);
    const [isPollClosed, setIsPollClosed] = React.useState(false);

    const [mayVote, setMayVote] = React.useState(false);

    function handleVote(index, selection) {
        let copy = [...voteStates];
        copy[index] = selection;
        setVoteStates([...copy]);
    }

    function handleSubmit() {
        setIsPollClosed(true);
        localStorage.setItem("last-poll-time", new Date());
        Submit(
            "Poll",
            `LFM viewer: ${voteStates[0] + 1 || "-"}/5\nWho panel: ${
                voteStates[1] + 1 || "-"
            }/5\nServer status: ${voteStates[2] + 1 || "-"}/5\nLoading times: ${
                voteStates[3] + 1 || "-"
            }/5\nVisual appearance: ${
                voteStates[4] + 1 || "-"
            }/5\nWebsite usefulness: ${voteStates[5] + 1 || "-"}/5`
        );
    }

    React.useEffect(() => {
        let ls = localStorage.getItem("last-poll-time");
        if (ls !== undefined && ls !== null) {
            let mayvote =
                new Date(localStorage.getItem("last-poll-time")) <=
                new Date().getTime() - 1000 * 60 * 60 * 24 * 31;
            setMayVote(mayvote);
        } else {
            setMayVote(true);
        }
    }, []);

    return mayVote || isPollClosed ? (
        <ContentCluster title="Poll">
            {isPollClosed ? (
                <p
                    style={{
                        display: "block",
                        fontSize: "1.5rem",
                        lineHeight: "normal",
                        color: "var(--text-faded)",
                        // marginBottom: "0px",
                    }}
                >
                    Thanks!
                </p>
            ) : (
                <p
                    style={{
                        display: "block",
                        fontSize: "1.5rem",
                        lineHeight: "normal",
                        color: "var(--text-faded)",
                        // marginBottom: "0px",
                    }}
                >
                    Got 15 seconds for a poll? All fields are optional. Your
                    feedback helps a lot!
                </p>
            )}
            {!isPollClosed && (
                <div className="poll">
                    {POLL_OPTIONS.map((option, i) => (
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
                    ))}
                    <div
                        className="primary-button should-invert full-width-mobile"
                        style={{ marginTop: "10px" }}
                        onClick={() => handleSubmit()}
                    >
                        Submit
                    </div>
                </div>
            )}
        </ContentCluster>
    ) : (
        <></>
    );
};

export default Poll;
