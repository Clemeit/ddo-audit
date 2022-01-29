import React from "react";
import { Helmet } from "react-helmet";
import Banner from "./Banner";
import { Submit } from "../../services/ReportIssueService";
import Poll from "./Poll";

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
                title="DDO Audit"
                subtitle="Real-time Player Concurrency Data and LFM Viewer"
            />
            <div className="content-container">
                <div className="top-content-padding shrink-on-mobile" />
                <Poll />
                <div className="content-cluster">
                    <h2 style={{ color: "var(--text)" }}>
                        Suggestions and Feedback
                    </h2>
                    <hr
                        style={{
                            backgroundColor: "var(--text)",
                            opacity: 0.2,
                        }}
                    />
                    <p
                        style={{
                            display: isSubmitted ? "none" : "block",
                            fontSize: "1.5rem",
                            lineHeight: "normal",
                            color: "var(--text-faded)",
                        }}
                    >
                        Community feedback has made this project possible.
                    </p>
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
                            We got your message. Thanks!
                        </span>
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
                                {isSubmitted ? "Submitted!" : "Submit"}
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Suggestions;
