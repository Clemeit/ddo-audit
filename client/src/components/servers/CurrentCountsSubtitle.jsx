import React from "react";

const CurrentCountsSubtitle = (props) => {
    function FormatWithCommas(x) {
        return x.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    function getLfmCount(noformat) {
        let lfmcount = 0;
        props.data.forEach((server) => {
            if (server.ServerName === props.server) {
                lfmcount = server.LfmCount;
            }
        });
        if (noformat) return lfmcount;
        return FormatWithCommas(lfmcount.toString());
    }

    function getPopulation() {
        return props.serverData?.Players?.length || "...";
    }

    function getPlayersInGroupCount() {
        return (
            props.serverData?.Players?.filter((player) => player.InParty === 1)
                ?.length || "..."
        );
    }

    function getPlayersInQuestsCount() {
        return props.serverData?.Players?.filter(
            (player) => player?.Location?.IsPublicSpace === 0
        )?.length;
    }

    function getAnonymousPlayersCount() {
        return props.serverData?.Players?.filter(
            (player) => player?.Name === "Anonymous"
        )?.length;
    }

    function getTransferPlayersCount() {
        return props.serverData?.Players?.filter(
            (player) => player?.HomeServer !== props.server
        )?.length;
    }

    // function getTransferList() {
    //     let val = [];
    //     props.serverData?.Players?.forEach((player) => {
    //         if (player.HomeServer !== props.server) {
    //             let found = false;
    //             val.forEach((v) => {
    //                 if (v.server === player.HomeServer) {
    //                     v.count++;
    //                     found = true;
    //                 }
    //             });
    //             if (!found) {
    //                 val.push({ server: player.HomeServer, count: 1 });
    //             }
    //         }
    //     });
    //     return val;
    // }

    function getUniqueGroupCount() {
        let groupIds = [];
        props.serverData?.Players?.forEach((player) => {
            if (!groupIds.includes(player.GroupId)) {
                groupIds.push(player.GroupId);
            }
        });
        return groupIds.length;
    }

    function getRelativeGroupCount() {
        let data = props.hourlyLfmDistribution?.filter(
            (series) => series.id === props.server
        )?.[0]?.data;
        let currentHour = (((new Date().getUTCHours() - 5) % 24) + 24) % 24;
        let averageForThisHour = data[currentHour]?.y;
        let current = getLfmCount();

        // Much fewer than average:
        if (current < 0.6 * averageForThisHour) {
            return "much fewer than average";
        } else if (current < 0.85 * averageForThisHour) {
            return "fewer than average";
        } else if (current > 1.15 * averageForThisHour) {
            return "more than average";
        } else if (current > 1.4 * averageForThisHour) {
            return "much more than average";
        } else {
            return "about average";
        }
    }

    return (
        <div>
            There are currently{" "}
            <span className="population-number">{getPopulation()}</span> players
            online:
            <ul>
                <li>
                    <span className="population-number">
                        {getPlayersInGroupCount()} (
                        {Math.round(
                            (100 * getPlayersInGroupCount()) / getPopulation()
                        )}
                        %)
                    </span>{" "}
                    are in groups
                </li>
                <li>
                    <span className="population-number">
                        {getPlayersInQuestsCount()} (
                        {Math.round(
                            (100 * getPlayersInQuestsCount()) / getPopulation()
                        )}
                        %)
                    </span>{" "}
                    are in quests
                </li>
                <li>
                    <span className="population-number">
                        {getAnonymousPlayersCount()} (
                        {Math.round(
                            (100 * getAnonymousPlayersCount()) / getPopulation()
                        )}
                        %)
                    </span>{" "}
                    {getAnonymousPlayersCount() === 1 ? "is" : "are"} anonymous
                </li>
                <li>
                    <span className="population-number">
                        {getTransferPlayersCount()} (
                        {Math.round(
                            (100 * getTransferPlayersCount()) / getPopulation()
                        )}
                        %)
                    </span>{" "}
                    transferred from another server
                    {/* <ul>
                        {getTransferList().map((item) => (
                            <li>
                                {item.count} from {item.server}
                            </li>
                        ))}
                    </ul> */}
                </li>
            </ul>
            There {getLfmCount() == 1 ? "is" : "are"} currently{" "}
            <span className="lfm-number">{getLfmCount()}</span> LFM
            {getLfmCount() == 1 ? "" : "s"} posted:
            <ul>
                <li>
                    That's{" "}
                    <span className="lfm-number">
                        {getRelativeGroupCount()}
                    </span>{" "}
                    for this time of day
                </li>
                <li>
                    There are a total of{" "}
                    <span className="lfm-number">{getUniqueGroupCount()}</span>{" "}
                    groups (including groups not posted in the LFM panel)
                </li>
            </ul>
        </div>
    );
};

export default CurrentCountsSubtitle;
