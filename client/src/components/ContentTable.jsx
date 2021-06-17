import React from "react";
import { ReactComponent as TimelineSVG } from "../assets/global/timeline.svg";
import { ReactComponent as ExpandSVG } from "../assets/global/expand.svg";

const ContentTable = (props) => {
    const [filteredData, set_filteredData] = React.useState(null);
    const [expanded, set_expanded] = React.useState(false);

    function generateLevelString(quest) {
        return `${quest.CR_Heroic ? "Heroic: " + quest.CR_Heroic : ""}${
            quest.CR_Heroic && quest.CR_Epic ? " / " : ""
        }${quest.CR_Epic ? "Epic: " + quest.CR_Epic : ""}`;
    }

    React.useEffect(() => {
        if (props.data === null) return;
        if (props.activeFilter === "By Adventure Pack") {
            set_filteredData(
                props.data
                    .sort(function (a, b) {
                        return props.activeOrder === "Least Popular"
                            ? a.Count - b.Count
                            : b.Count - a.Count;
                    })
                    .filter((quest) => quest.Count > 100)
                    .slice(0, 20)
            );
        } else {
            set_filteredData(
                props.data
                    .filter((quest) => quest.Patron !== null)
                    .filter((quest) =>
                        props.activeFilter === "Raids Only" ? quest.Raid : true
                    )
                    .filter((quest) =>
                        props.activeFilter === "Free to Play"
                            ? quest.AdventurePack === null
                            : true
                    )
                    .sort(function (a, b) {
                        return props.activeOrder === "Least Popular"
                            ? a.Count - b.Count
                            : b.Count - a.Count;
                    })
                    .slice(0, 20)
            );
        }
    }, [props.data, props.activeFilter, props.activeOrder]); // Only filter the data when a) the data has changed, or b) the filter has changed

    return (
        <div>
            <div
                className={
                    "content-table-container" + (expanded ? " expanded" : "")
                }
                style={{ display: "flex", justifyContent: "center" }}
            >
                {filteredData === null ? (
                    <div className="loading-data-message">
                        <h5>Loading data...</h5>
                    </div>
                ) : props.activeFilter === "By Adventure Pack" ? (
                    <table className="content-table">
                        <thead>
                            <tr>
                                <th></th>
                                <th>Adventure Pack</th>
                                <th>Instances</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredData.map((adventurePack, i) => (
                                <tr key={adventurePack.AdventurePack}>
                                    <td>{i + 1}</td>
                                    <td>
                                        <div
                                            style={{
                                                cursor: "pointer",
                                                textDecoration: "underline",
                                            }}
                                            onClick={() => {
                                                console.log(
                                                    adventurePack.AdventurePack
                                                );
                                            }}
                                        >
                                            {adventurePack.AdventurePack}
                                            <TimelineSVG
                                                className="link-icon"
                                                style={{ marginLeft: "8px" }}
                                            />
                                        </div>
                                    </td>
                                    <td>{adventurePack.Count}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <table className="content-table">
                        <thead>
                            <tr>
                                <th></th>
                                <th>Quest</th>
                                <th>Patron</th>
                                <th>Level</th>
                                <th>Average Time</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredData.map((quest, i) => (
                                <tr key={quest.QuestName}>
                                    <td>{i + 1}</td>
                                    <td>
                                        <div
                                            style={{
                                                cursor: "pointer",
                                                textDecoration: "underline",
                                                width: "max-content",
                                            }}
                                            onClick={() => {
                                                console.log(quest.Id);
                                            }}
                                        >
                                            {quest.QuestName +
                                                (quest.QuestName ===
                                                "An Invitation to Dinner"
                                                    ? "*"
                                                    : "")}
                                            <TimelineSVG
                                                className="link-icon"
                                                style={{ marginLeft: "8px" }}
                                            />
                                        </div>
                                    </td>
                                    <td>{quest.Patron}</td>
                                    <td>{generateLevelString(quest)}</td>
                                    <td>{quest.AverageTime}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
                <div
                    className="expand-content-table-button"
                    style={{
                        display:
                            expanded || filteredData === null
                                ? "none"
                                : "block",
                    }}
                    onClick={() => set_expanded(true)}
                >
                    Expand
                    <ExpandSVG className="link-icon" width={30} height={30} />
                </div>
            </div>
            <p style={{ fontSize: "smaller" }}>
                *
                <span style={{ fontStyle: "italic" }}>
                    An Invitation to Dinner
                </span>{" "}
                is over-represented in this report due to the high number of
                players instance farming the quest.
            </p>
        </div>
    );
};

export default ContentTable;
