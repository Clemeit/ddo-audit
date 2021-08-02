import React from "react";
import { ReactComponent as TimelineSVG } from "../assets/global/timeline.svg";

const ContentTable = (props) => {
    const [filteredData, set_filteredData] = React.useState(null);

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
            );
        }
    }, [props.data, props.activeFilter, props.activeOrder]); // Only filter the data when a) the data has changed, or b) the filter has changed

    function averageTimeString(sec) {
        if (sec > 60) {
            return `${Math.round((sec / 60) * 10) / 10} minutes`;
        } else {
            return `${sec} seconds`;
        }
    }

    return (
        <div>
            <div
                className={"content-table-container"}
                style={{
                    display: "flex",
                    justifyContent: "center",
                    height: "min-content",
                    maxHeight: "300px",
                }}
            >
                {filteredData === null ? (
                    <div className="loading-data-message">
                        <h5>Loading data...</h5>
                    </div>
                ) : (
                    <table className="content-table">
                        <thead>
                            <tr>
                                <th></th>
                                <th>Quest</th>
                                <th>Average Duration</th>
                                <th>Instances</th>
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
                                                props.handleSelection(quest);
                                            }}
                                        >
                                            {quest.QuestName}
                                            <TimelineSVG
                                                className="link-icon"
                                                style={{ marginLeft: "8px" }}
                                            />
                                        </div>
                                    </td>
                                    <td>
                                        {averageTimeString(quest.AverageTime)}
                                    </td>
                                    <td>{quest.Count}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default ContentTable;
