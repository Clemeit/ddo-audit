import React from "react";
import { Helmet } from "react-helmet";
import Banner from "../global/Banner";
import { ReactComponent as DeleteSVG } from "../../assets/global/delete.svg";
import { ReactComponent as EditSVG } from "../../assets/global/edit.svg";

const NotificationForm = (props) => {
    const TITLE = "Grouping Notifications";

    const [server, setServer] = React.useState("");
    const [leaderName, setLeaderName] = React.useState("");
    const [levelRange, setLevelRange] = React.useState("");
    const [questName, setQuestName] = React.useState("");
    const [comment, setComment] = React.useState("");

    const [rules, setRules] = React.useState([]);

    React.useEffect(() => {
        let loadrules = JSON.parse(localStorage.getItem("notification-rules"));
        if (loadrules) {
            setRules(loadrules);
        } else {
            setRules([]);
        }
    }, []);

    React.useEffect(() => {
        localStorage.setItem("notification-rules", JSON.stringify(rules));
    }, [rules]);

    function AddRule() {
        setRules([
            ...rules,
            {
                server,
                leaderName,
                levelRange,
                questName,
                comment,
            },
        ]);
        ResetForm();
    }

    function ResetForm() {
        setServer("");
        setLeaderName("");
        setLevelRange("");
        setQuestName("");
        setComment("");
    }

    function Edit(index) {
        console.log(index);
        setServer(rules[index].server);
        setLeaderName(rules[index].leaderName);
        setLevelRange(rules[index].levelRange);
        setQuestName(rules[index].questName);
        setComment(rules[index].comment);
        Delete(index);
    }

    function Delete(index) {
        let rulescopy = [];
        rules.forEach((rule, i) => {
            if (i !== index) rulescopy.push(rule);
        });
        setRules(rulescopy);
    }

    return (
        <div>
            <Banner
                small={true}
                showTitle={true}
                showSubtitle={true}
                showButtons={false}
                hideOnMobile={true}
                title="Grouping"
                subtitle="Setup custom group notifications"
            />
            <Helmet>
                <title>{TITLE}</title>
                <meta
                    name="description"
                    content="Setup custom group notifications."
                />
            </Helmet>
            <div id="content-container">
                <div className="top-content-padding shrink-on-mobile" />
                <div className="content-cluster">
                    <h2 style={{ color: "var(--text)" }}>
                        Notification Permission
                    </h2>
                    <hr
                        style={{
                            backgroundColor: "var(--text)",
                            opacity: 0.2,
                        }}
                    />
                    <p
                        style={{
                            fontSize: "1.5rem",
                            lineHeight: "normal",
                            color: "var(--text-faded)",
                        }}
                    >
                        We're going to need permission to send you
                        notifications.
                    </p>
                    <div className="primary-button full-width-mobile">
                        Allow Notifications
                    </div>
                </div>
                <div className="content-cluster">
                    <h2 style={{ color: "var(--text)" }}>
                        Your Notification Settings
                    </h2>
                    <hr
                        style={{
                            backgroundColor: "var(--text)",
                            opacity: 0.2,
                        }}
                    />
                    <p
                        style={{
                            fontSize: "1.5rem",
                            lineHeight: "normal",
                            color: "var(--text-faded)",
                        }}
                    >
                        You will be notified of groups that match <b>any</b> of
                        the following entries.
                    </p>
                    <div style={{ overflowX: "scroll" }}>
                        <table className="notification-table">
                            <tbody>
                                <tr>
                                    <th>Server</th>
                                    <th>Leader</th>
                                    <th>Level</th>
                                    <th>Quest</th>
                                    <th>Comment</th>
                                    <th style={{ width: "50px" }}></th>
                                    <th style={{ width: "50px" }}></th>
                                </tr>
                                {rules.map((rule, i) => (
                                    <tr key={i}>
                                        <td>{rule.server}</td>
                                        <td>{rule.leaderName}</td>
                                        <td>{rule.levelRange}</td>
                                        <td>{rule.questName}</td>
                                        <td>{rule.comment}</td>
                                        <td>
                                            <EditSVG
                                                style={{
                                                    cursor: "pointer",
                                                    width: "30px",
                                                    height: "30px",
                                                }}
                                                onClick={() => Edit(i)}
                                            />
                                        </td>
                                        <td>
                                            <DeleteSVG
                                                style={{
                                                    cursor: "pointer",
                                                    width: "30px",
                                                    height: "30px",
                                                }}
                                                onClick={() => Delete(i)}
                                            />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className="content-cluster">
                    <h2 style={{ color: "var(--text)" }}>Create a New Rule</h2>
                    <hr
                        style={{
                            backgroundColor: "var(--text)",
                            opacity: 0.2,
                        }}
                    />
                    <p
                        style={{
                            fontSize: "1.5rem",
                            lineHeight: "normal",
                            color: "var(--text-faded)",
                        }}
                    >
                        Groups must meet <b>all</b> of the following criteria.
                        Leave a field blank to ignore it. You may separate
                        queries with commas (,).
                    </p>
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "10px",
                        }}
                    >
                        <label
                            htmlFor="server"
                            style={{
                                fontSize: "1.5rem",
                                color: "var(--text)",
                                marginRight: "10px",
                                marginBottom: "0px",
                            }}
                        >
                            Server(s):
                        </label>
                        <input
                            id="server"
                            className="full-width-mobile"
                            placeholder="(e.g. Cannith,Thelanis)"
                            style={{
                                fontSize: "1.2rem",
                            }}
                            value={server}
                            onChange={(e) => setServer(e.target.value)}
                        />

                        <label
                            htmlFor="leader-name"
                            style={{
                                fontSize: "1.5rem",
                                color: "var(--text)",
                                marginRight: "10px",
                                marginBottom: "0px",
                            }}
                        >
                            Leader name:
                        </label>
                        <input
                            id="leader-name"
                            className="full-width-mobile"
                            placeholder="(e.g. Clemeit,Someotherguy)"
                            style={{
                                fontSize: "1.2rem",
                            }}
                            value={leaderName}
                            onChange={(e) => setLeaderName(e.target.value)}
                        />

                        <label
                            htmlFor="level-range"
                            style={{
                                fontSize: "1.5rem",
                                color: "var(--text)",
                                marginRight: "10px",
                                marginBottom: "0px",
                            }}
                        >
                            Level range:
                        </label>
                        <input
                            id="level-range"
                            className="full-width-mobile"
                            placeholder="(e.g. 1,2,28-30)"
                            style={{
                                fontSize: "1.2rem",
                            }}
                            value={levelRange}
                            onChange={(e) => setLevelRange(e.target.value)}
                        />

                        <label
                            htmlFor="quest"
                            style={{
                                fontSize: "1.5rem",
                                color: "var(--text)",
                                marginRight: "10px",
                                marginBottom: "0px",
                            }}
                        >
                            Quest name:
                        </label>
                        <input
                            id="quest"
                            className="full-width-mobile"
                            placeholder="(e.g. The Cannith Crystal)"
                            style={{
                                fontSize: "1.2rem",
                            }}
                            value={questName}
                            onChange={(e) => setQuestName(e.target.value)}
                        />

                        <label
                            htmlFor="comment"
                            style={{
                                fontSize: "1.5rem",
                                color: "var(--text)",
                                marginRight: "10px",
                                marginBottom: "0px",
                            }}
                        >
                            Comment:
                        </label>
                        <input
                            id="comment"
                            className="full-width-mobile"
                            placeholder="(e.g. thth,r1,kt)"
                            style={{
                                fontSize: "1.2rem",
                            }}
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                        />
                    </div>
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "flex-end",
                            gap: "10px",
                            marginTop: "20px",
                        }}
                    >
                        <div
                            className="primary-button should-invert full-width-mobile"
                            onClick={() => AddRule()}
                        >
                            Add Rule
                        </div>
                        <div
                            className="secondary-button should-invert"
                            onClick={() => ResetForm()}
                        >
                            Reset
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NotificationForm;
