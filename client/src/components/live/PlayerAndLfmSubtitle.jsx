import React from "react";

const PlayerAndLfmSubtitle = (props) => {
    function FormatWithCommas(x) {
        return x.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    return (
        <div>
            <p
                style={{
                    textAlign: "justify",
                    fontSize: "1.5rem",
                    lineHeight: "normal",
                    color: "var(--text)",
                }}
            >
                There are currently{" "}
                <span className="population-number">
                    {props.data
                        ? FormatWithCommas(props.data.Players.toString())
                        : "(Loading...)"}
                </span>{" "}
                players online and{" "}
                <span className="lfm-number">
                    {props.data ? props.data.LFMs : "(Loading...)"}
                </span>{" "}
                LFMs posted.{" "}
                {props.data &&
                    (props.data.Players
                        ? "Are you one of them?"
                        : "Maybe everyone's anonymous.")}
            </p>
        </div>
    );
};

export default PlayerAndLfmSubtitle;
