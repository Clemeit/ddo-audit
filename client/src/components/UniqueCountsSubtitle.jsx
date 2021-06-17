import React from "react";

const UniqueCountsSubtitle = (props) => {
    function FormatWithCommas(x) {
        return x.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    function GetUniquePlayers() {
        let playercount = 0;
        props.data.forEach((server) => {
            if (server.ServerName === props.server) {
                playercount = server.UniquePlayers;
            }
        });
        return FormatWithCommas(playercount.toString());
    }

    function GetUniqueGuilds() {
        let guildcount = 0;
        props.data.forEach((server) => {
            if (server.ServerName === props.server) {
                guildcount = server.UniqueGuilds;
            }
        });
        return FormatWithCommas(guildcount.toString());
    }

    return (
        <div>
            {props.data ? (
                <p>
                    We've seen{" "}
                    <span className="population-number">
                        {GetUniquePlayers()}
                    </span>{" "}
                    unique characters and{" "}
                    <span className="lfm-number">{GetUniqueGuilds()}</span>{" "}
                    unique guilds in the last month. Fancy joining us?{" "}
                </p>
            ) : (
                "Loading data..."
            )}
        </div>
    );
};

export default UniqueCountsSubtitle;
