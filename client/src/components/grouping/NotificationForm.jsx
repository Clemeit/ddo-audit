import React from "react";
import { Helmet } from "react-helmet";
import Banner from "../global/Banner";
import { ReactComponent as DeleteSVG } from "../../assets/global/delete.svg";
import { ReactComponent as EditSVG } from "../../assets/global/edit.svg";
import { ReactComponent as WarningSVG } from "../../assets/global/warning.svg";

const NotificationForm = (props) => {
    const TITLE = "Grouping Notifications";

    const [server, setServer] = React.useState("");
    const [leaderName, setLeaderName] = React.useState("");
    const [levelRange, setLevelRange] = React.useState("");
    const [questName, setQuestName] = React.useState("");
    const [comment, setComment] = React.useState("");
    const [canNotify, setCanNotify] = React.useState(false);
    const [deniedNotifications, setDeniedNotifications] = React.useState(false);

    const [rules, setRules] = React.useState([]);

    React.useEffect(() => {
        let loadrules = JSON.parse(localStorage.getItem("notification-rules"));
        if (loadrules) {
            setRules(loadrules);
        } else {
            setRules([]);
        }
        if (Notification.permission == "granted") {
            setCanNotify(true);
        } else if (Notification.permission == "denied") {
            setDeniedNotifications(true);
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

    function requestNotificationPermission() {
        Notification.requestPermission().then((result) => {
            if (result === "granted") {
                navigator.serviceWorker.getRegistration().then(function (reg) {
                    if (reg == undefined) return;
                    reg.showNotification("Hello world!");
                });
                setCanNotify(true);
                randomNotification();
            } else if (result === "denied") {
                console.log(result);
                setDeniedNotifications(true);
            }
        });
    }

    function randomNotification() {
        const notifTitle = "Notification Permission Granted";
        const notifBody = `You have granted DDO Audit the ability to send you notifications.`;
        const notifImg = `../../../logo.png`;
        const options = {
            body: notifBody,
        };
        new Notification(notifTitle, options);
    }

    function subscribeUser() {
        if ("serviceWorker" in navigator) {
            navigator.serviceWorker.ready.then(function (reg) {
                reg.pushManager
                    .subscribe({
                        userVisibleOnly: true,
                    })
                    .then(function (sub) {
                        console.log("Endpoint URL: ", sub.endpoint);
                    })
                    .catch(function (e) {
                        if (Notification.permission === "denied") {
                            console.warn(
                                "Permission for notifications was denied"
                            );
                        } else {
                            console.error("Unable to subscribe to push", e);
                        }
                    });
            });
        }
    }

    React.useEffect(() => {
        subscribeUser();
    }, []);

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
                <div
                    className="content-cluster"
                    style={{
                        display:
                            !canNotify && !deniedNotifications
                                ? "block"
                                : "none",
                    }}
                >
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
                        We're going to need your permission to send you
                        notifications.
                    </p>
                    <div
                        className="primary-button full-width-mobile"
                        onClick={() => requestNotificationPermission()}
                    >
                        Allow Notifications
                    </div>
                </div>
                <div
                    className="content-cluster"
                    style={{
                        display: deniedNotifications ? "block" : "none",
                    }}
                >
                    <h2
                        style={{
                            color: "var(--text)",
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "center",
                        }}
                    >
                        <WarningSVG
                            style={{
                                width: "30px",
                                height: "30px",
                                marginRight: "10px",
                            }}
                        />
                        Notification Permission
                    </h2>
                    <p
                        style={{
                            fontSize: "1.5rem",
                            lineHeight: "normal",
                            color: "var(--text-faded)",
                        }}
                    >
                        You have explicitly denied DDO Audit the ability to send
                        you notifications.
                    </p>
                    <p
                        style={{
                            fontSize: "1.5rem",
                            lineHeight: "normal",
                            color: "var(--text-faded)",
                        }}
                    >
                        If this was an error, please see the following support
                        pages to reenable notifications:
                    </p>
                    <ul
                        style={{
                            fontSize: "1.5rem",
                        }}
                    >
                        <li>
                            <a
                                href="https://support.google.com/chrome/answer/3220216"
                                rel="noreferrer"
                                target="_blank"
                            >
                                Chrome
                            </a>
                        </li>
                        <li>
                            <a
                                href="https://support.mozilla.org/en-US/kb/push-notifications-firefox"
                                rel="noreferrer"
                                target="_blank"
                            >
                                Firefox
                            </a>
                        </li>
                    </ul>
                </div>
                <div
                    className="content-cluster"
                    style={{ display: canNotify ? "unset" : "none" }}
                >
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
                    <div className="notification-table">
                        {rules.map((rule, i) => (
                            <div
                                className="notification-rule column-on-mobile"
                                key={i}
                            >
                                {rule.server && (
                                    <div className="notification-rule-field">
                                        <span className="notification-rule-title">
                                            Server
                                        </span>
                                        <span>{rule.server}</span>
                                    </div>
                                )}
                                {rule.leaderName && (
                                    <div className="notification-rule-field">
                                        <span className="notification-rule-title">
                                            Leader Name
                                        </span>
                                        <span>{rule.leaderName}</span>
                                    </div>
                                )}
                                {rule.levelRange && (
                                    <div className="notification-rule-field">
                                        <span className="notification-rule-title">
                                            Level Range
                                        </span>
                                        <span>{rule.levelRange}</span>
                                    </div>
                                )}
                                {rule.questName && (
                                    <div className="notification-rule-field">
                                        <span className="notification-rule-title">
                                            Quest Name
                                        </span>
                                        <span>{rule.questName}</span>
                                    </div>
                                )}
                                {rule.comment && (
                                    <div className="notification-rule-field">
                                        <span className="notification-rule-title">
                                            Comment
                                        </span>
                                        <span>{rule.comment}</span>
                                    </div>
                                )}
                                <div className="notification-rule-option-container">
                                    <EditSVG
                                        title="Edit this notification rule"
                                        style={{
                                            cursor: "pointer",
                                            width: "30px",
                                            height: "30px",
                                        }}
                                        onClick={() => Edit(i)}
                                    />
                                    <DeleteSVG
                                        title="Delete this notification rule"
                                        style={{
                                            cursor: "pointer",
                                            width: "30px",
                                            height: "30px",
                                        }}
                                        onClick={() => Delete(i)}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                    {/* <div style={{ overflowX: "scroll" }}>
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
                    </div> */}
                </div>
                <div
                    className="content-cluster"
                    style={{ display: canNotify ? "unset" : "none" }}
                >
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
