import React from "react";

const UniqueCountsSubtitle = (props) => {
    function FormatWithCommas(x) {
        return x.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    function GetUniquePlayers(noformat) {
        let playercount = 0;
        props.data.forEach((server) => {
            if (server.Name === props.server) {
                playercount = server.TotalCharacters;
            }
        });
        if (noformat) return playercount;
        return FormatWithCommas(playercount.toString());
    }

    function GetUniqueActivePlayers(noformat) {
        let playercount = 0;
        props.data.forEach((server) => {
            if (server.Name === props.server) {
                playercount = server.ActiveCharacters;
            }
        });
        if (noformat) return playercount;
        return FormatWithCommas(playercount.toString());
    }

    function GetUniqueGuilds() {
        let guildcount = 0;
        props.data.forEach((server) => {
            if (server.Name === props.server) {
                guildcount = server.TotalGuilds;
            }
        });
        return FormatWithCommas(guildcount.toString());
    }

    return (
        <div>
            <p>
                We've seen{" "}
                <span className="population-number">{GetUniquePlayers()}</span>{" "}
                unique characters and{" "}
                <span className="lfm-number">{GetUniqueGuilds()}</span> guilds
                in the last quarter on {props.server}. Of those characters, we
                consider{" "}
                <span className="population-number">
                    {GetUniqueActivePlayers()} (
                    {Math.round(
                        (GetUniqueActivePlayers(true) /
                            GetUniquePlayers(true)) *
                            100
                    )}
                    %)
                </span>{" "}
                to be active{" "}
                <span
                    className="faux-link"
                    onClick={() => props.readAbout("active characters")}
                >
                    (read more)
                </span>
                .
            </p>
        </div>
    );
};

export default UniqueCountsSubtitle;
