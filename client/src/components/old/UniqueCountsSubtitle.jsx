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

    // function GetUniqueGuilds() {
    //     let guildcount = 0;
    //     props.data.forEach((server) => {
    //         if (server.ServerName === props.server) {
    //             guildcount = server.UniqueGuilds;
    //         }
    //     });
    //     return FormatWithCommas(guildcount.toString());
    // }

    return (
        <div>
            {props.data ? (
                <p>
                    We've seen{" "}
                    <span className="population-number">
                        {GetUniquePlayers()}
                    </span>{" "}
                    unique characters,{" "}
                    <span className="lfm-number">
                        {Math.round(
                            (GetUniqueActivePlayers(true) /
                                GetUniquePlayers(true)) *
                                100
                        )}
                        % ({GetUniqueActivePlayers()})
                    </span>{" "}
                    of whom we consider active{" "}
                    <span
                        className="faux-link"
                        onClick={() => props.readAbout("active characters")}
                    >
                        (read more)
                    </span>
                    . Fancy joining us?{" "}
                </p>
            ) : (
                "Loading data..."
            )}
        </div>
    );
};

export default UniqueCountsSubtitle;
