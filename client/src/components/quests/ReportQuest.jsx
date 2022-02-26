import React from "react";
import { ReactComponent as CloseSVG } from "../../assets/global/close.svg";
import { Submit } from "../../services/CommunicationService";

const ReportQuest = (props) => {
    const [additionalText, setAdditionalText] = React.useState("");

    function submitForm() {
        // console.log(props.reportedQuest);
        Submit(
            "User reported a quest: " + props.reportedQuest,
            additionalText || "No comment"
        );

        close();
    }

    function close() {
        setAdditionalText("");
        props.hideForm();
    }

    return (
        <div>
            {props.visible && (
                <div className="overlay" onClick={() => props.hideForm()} />
            )}
            {props.visible && (
                <div className="report-quest-form card">
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
                    <h2 className="content-cluster-title">Report Quest</h2>
                    <hr
                        style={{
                            backgroundColor: "var(--text)",
                            opacity: 0.2,
                            marginTop: "0.5rem",
                            marginBottom: "0.5rem",
                        }}
                    />
                    <p style={{ fontSize: "1.3rem" }}>
                        You're welcome to add any additional detail, but you can
                        also just click 'Submit' and I'll take a look for
                        myself.
                    </p>
                    <input
                        id="additiona-text"
                        placeholder="More details (optional)"
                        style={{
                            width: "100%",
                            fontSize: "1.2rem",
                        }}
                        value={additionalText}
                        onChange={(e) => setAdditionalText(e.target.value)}
                    />
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
                            className="secondary-button should-invert"
                            onClick={() => close()}
                        >
                            Cancel
                        </div>
                        <div
                            className="primary-button should-invert"
                            style={{ width: "100px", textAlign: "center" }}
                            onClick={() => submitForm()}
                        >
                            Submit
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ReportQuest;
