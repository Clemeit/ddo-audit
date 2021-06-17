import React from "react";

const PlayerAndLfmSubtitle = (props) => {
    function FormatWithCommas(x) {
        return x.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    function GetPlayersOnline() {
        let playercount = 0;
        props.data.forEach((server) => {
            if (server.id === props.server) {
                playercount = server.data[server.data.length - 1].y;
            }
        });
        return playercount;
    }

    return (
        <div>
            {props.data ? (
                <p>
                    There are currently{" "}
                    <span className="population-number">
                        {FormatWithCommas(GetPlayersOnline().toString())}
                    </span>{" "}
                    players online and{" "}
                    <span className="lfm-number">{"GET_LFM_COUNT"}</span> LFMs
                    posted.{" "}
                    {
                        /*props.data[props.data.length - 1]
                            .PlayerCount !== 0* <====================== */ 1
                            ? "Are you one of them?"
                            : "Maybe everyone's anonymous."
                    }
                </p>
            ) : (
                "Loading data..."
            )}
        </div>
    );
};

export default PlayerAndLfmSubtitle;
