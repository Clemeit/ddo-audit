import React from "react";
import { ReactComponent as TimelineSVG } from "../assets/global/timeline.svg";
import { ReactComponent as SortSVG } from "../assets/global/sort.svg";

const ContentTable = (props) => {
    const [filteredData, set_filteredData] = React.useState(null);

    function generateLevelString(quest) {
        return `${quest.CR_Heroic ? "Heroic: " + quest.CR_Heroic : ""}${
            quest.CR_Heroic && quest.CR_Epic ? " / " : ""
        }${quest.CR_Epic ? "Epic: " + quest.CR_Epic : ""}`;
    }

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
                    maxHeight: props.collapsed ? "300px" : "",
                }}
            >
                {props.data === null ? (
                    <div
                        className="loading-data-message"
                        style={{
                            height: "300px",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                        }}
                    >
                        <h4>Loading data. Please wait...</h4>
                    </div>
                ) : (
                    <table className="content-table">
                        <thead>
                            <tr>
                                <th></th>
                                <th
                                    onClick={() => props.handleSort("name")}
                                    style={{
                                        cursor: "pointer",
                                        // display: "flex",
                                        // flexDirection: "row",
                                        // alignItems: "center",
                                    }}
                                >
                                    Quest <SortSVG />
                                </th>
                                <th
                                    onClick={() => props.handleSort("duration")}
                                    style={{
                                        cursor: "pointer",
                                        // display: "flex",
                                        // flexDirection: "row",
                                        // alignItems: "center",
                                    }}
                                >
                                    Average Duration <SortSVG />
                                </th>
                                <th
                                    onClick={() =>
                                        props.handleSort("instances")
                                    }
                                    style={{
                                        cursor: "pointer",
                                        // display: "flex",
                                        // flexDirection: "row",
                                        // alignItems: "center",
                                    }}
                                >
                                    Instances <SortSVG />
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {props.data.map((quest, i) => (
                                <tr
                                    className="content-table-row-highlight"
                                    key={quest.QuestName}
                                    onClick={() => {
                                        props.handleSelection(quest);
                                    }}
                                >
                                    <td>
                                        {i +
                                            1 +
                                            props.pageNumber * props.pageSize}
                                    </td>
                                    <td>
                                        <div
                                            style={{
                                                cursor: "pointer",
                                                textDecoration: "underline",
                                                width: "max-content",
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
