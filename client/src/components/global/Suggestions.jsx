import React from "react";
import { Helmet } from "react-helmet";
import Banner from "./Banner";
import { Submit } from "../../services/ReportIssueService";
import Poll from "./Poll";
import ContentCluster from "./ContentCluster";
import { ReactComponent as WarningSVG } from "../../assets/global/warning.svg";

const Suggestions = (props) => {
    const TITLE = "DDO Audit | Make a Suggestion";

    const [message, setMessage] = React.useState("");
    const [contact, setContact] = React.useState("");

    const [isSubmitted, setIsSubmitted] = React.useState(false);

    function SubmitMessage() {
        if (isSubmitted) return;
        if (message) {
            Submit(
                "Suggestion",
                message + (contact && ` (Contact: '${contact}')`)
            );
            setIsSubmitted(true);
        } else {
            alert("Did you forget to add a message?");
        }
    }

    return (
        <div>
            <Helmet>
                <title>{TITLE}</title>
                <meta
                    name="description"
                    content="Have a suggestion for DDO Audit? Submit it here!"
                />
                <meta
                    property="og:image"
                    content="/icons/logo-512px.png"
                    data-react-helmet="true"
                />
                <meta
                    property="twitter:image"
                    content="/icons/logo-512px.png"
                    data-react-helmet="true"
                />
            </Helmet>
            <Banner
                small={false}
                showTitle={true}
                showSubtitle={true}
                showButtons={true}
                hideSuggestions={true}
                hideOnMobile={true}
                hideVote={true}
                title="DDO Audit"
                subtitle="Real-time Player Concurrency Data and LFM Viewer"
            />
            <div className="content-container">
                <div className="top-content-padding shrink-on-mobile" />
                <ContentCluster
                    title={
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "center",
                                lineHeight: "30px",
                            }}
                        >
                            <WarningSVG
                                style={{
                                    width: "30px",
                                    height: "30px",
                                    marginRight: "10px",
                                }}
                            />
                            Please Note
                        </div>
                    }
                    altTitle="Please Note"
                    noLink={true}
                    description={
                        <div>
                            <ul>
                                <li style={{ marginBottom: "20px" }}>
                                    I've received a lot of feedback expressing
                                    dissatisfaction with the{" "}
                                    <span className="lfm-number">
                                        filtering on the LFM panel.{" "}
                                    </span>
                                    I completely agree - it's clunky and not
                                    user-friendly. I plan on updating it as soon
                                    as possible. Please be patient.
                                </li>
                                <li>
                                    The new website doesn't include all of the
                                    reports or features from the old website.{" "}
                                    <span className="lfm-number">
                                        If a report or feature is missing
                                    </span>{" "}
                                    and you'd like to see it returned, please
                                    let me know so I can add it.
                                </li>
                            </ul>
                        </div>
                    }
                    noFade={true}
                />
                <Poll />
                <ContentCluster
                    title="Suggestions and Feedback"
                    description={
                        isSubmitted
                            ? ""
                            : "Community feedback has made this project possible."
                    }
                >
                    <form>
                        <div
                            style={{
                                display: isSubmitted ? "none" : "flex",
                                flexDirection: "column",
                                gap: "10px",
                            }}
                        >
                            <label
                                htmlFor="message"
                                style={{
                                    fontSize: "1.5rem",
                                    color: "var(--text)",
                                    marginRight: "10px",
                                    marginBottom: "0px",
                                }}
                            >
                                Your message:
                            </label>
                            <textarea
                                disabled={isSubmitted}
                                id="message"
                                rows={4}
                                placeholder="What's on your mind?"
                                style={{
                                    fontSize: "1.2rem",
                                    width: "100%",
                                }}
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                            />

                            <label
                                htmlFor="contact"
                                style={{
                                    fontSize: "1.5rem",
                                    color: "var(--text)",
                                    marginRight: "10px",
                                    marginBottom: "0px",
                                }}
                            >
                                Contact info (optional):
                            </label>
                            <input
                                disabled={isSubmitted}
                                id="contact"
                                placeholder="(e.g. Reddit username, forum name, email, etc.)"
                                style={{
                                    fontSize: "1.2rem",
                                    width: "100%",
                                }}
                                value={contact}
                                onChange={(e) => setContact(e.target.value)}
                            />
                        </div>
                        <span
                            style={{
                                display: isSubmitted ? "flex" : "none",
                                color: "var(--text)",
                                fontSize: "1.5rem",
                                flexDirection: "row",
                                justifyContent: "center",
                                alignItems: "center",
                                width: "100%",
                                minHeight: "60px",
                            }}
                        >
                            I got your message. Thanks!
                        </span>
                        {isSubmitted === false && (
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
                                    className={
                                        "primary-button full-width-mobile should-invert" +
                                        (isSubmitted ? " disabled" : "")
                                    }
                                    style={{
                                        display: "flex",
                                        justifyContent: "center",
                                        minWidth: "150px",
                                    }}
                                    onClick={() => SubmitMessage()}
                                >
                                    Submit
                                </div>
                            </div>
                        )}
                    </form>
                </ContentCluster>
                <ContentCluster
                    title="Disclaimer"
                    description={
                        <p
                            style={{
                                fontSize: "1.5rem",
                                lineHeight: "normal",
                                color: "var(--text)",
                                marginTop: "30px",
                            }}
                        >
                            This website is in no way affiliated with, or
                            endorsed by, Standing Stone Games or{" "}
                            <a
                                href="https://www.daybreakgames.com/home"
                                rel="noreferrer"
                                target="_blank"
                            >
                                Daybreak Game Company
                            </a>
                            .{" "}
                            <span className="lfm-number">
                                Please do not submit personal information, login
                                details, or bug reports related to the game.
                            </span>
                        </p>
                    }
                />
            </div>
        </div>
    );
};

export default Suggestions;
