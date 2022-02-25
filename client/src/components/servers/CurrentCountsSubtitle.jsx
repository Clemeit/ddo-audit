import React from "react";

const CurrentCountsSubtitle = (props) => {
    function FormatWithCommas(x) {
        return x.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    function GetPlayerCount(noformat) {
        let playercount = 0;
        props.data.forEach((server) => {
            if (server.ServerName === props.server) {
                playercount = server.PlayerCount;
            }
        });
        if (noformat) return playercount;
        return FormatWithCommas(playercount.toString());
    }

    function GetLfmCount(noformat) {
        let playercount = 0;
        props.data.forEach((server) => {
            if (server.ServerName === props.server) {
                playercount = server.LfmCount;
            }
        });
        if (noformat) return playercount;
        return FormatWithCommas(playercount.toString());
    }

    return (
        <div>
            {props.data ? (
                <p>
                    There are currently{" "}
                    <span className="population-number">
                        {GetPlayerCount()}
                    </span>{" "}
                    players online and{" "}
                    <span className="lfm-number">{GetLfmCount()}</span> LFMs
                    posted on {props.server}. Fancy joining us?
                </p>
            ) : (
                "Loading current population data..."
            )}
        </div>
    );
};

export default CurrentCountsSubtitle;
