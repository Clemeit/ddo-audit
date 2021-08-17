import React from "react";

const PlayerAndLfmSubtitle = (props) => {
    function FormatWithCommas(x) {
        return x.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    return (
        <div>
            {props.data ? (
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
                        {FormatWithCommas(props.data.Players.toString())}
                    </span>{" "}
                    players online and{" "}
                    <span className="lfm-number">{props.data.LFMs}</span> LFMs
                    posted.{" "}
                    {props.data.Players
                        ? "Are you one of them?"
                        : "Maybe everyone's anonymous."}
                </p>
            ) : (
                "Loading data..."
            )}
        </div>
    );
};

export default PlayerAndLfmSubtitle;
