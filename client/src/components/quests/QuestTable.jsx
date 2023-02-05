import React from "react";
import { ReactComponent as TimelineSVG } from "../../assets/global/timeline.svg";
import { ReactComponent as SortSVG } from "../../assets/global/sort.svg";

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

    function questLevelString(quest) {
        return `${!quest.isepic ? "Heroic: " + quest.level : ""}${
            quest.isepic ? "Epic: " + quest.level : ""
        }`;
    }

    function questXpPerMinuteString(quest) {
        return `${
            !quest.isepic
                ? "HE: " + Math.round(quest.xp / (quest.averagetime / 60))
                : ""
        }${
            quest.isepic
                ? "EE: " + Math.round(quest.xp / (quest.averagetime / 60))
                : ""
        }`;
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
                        <h4>Running audit. Please wait...</h4>
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
                                    Quest{" "}
                                    <SortSVG className="nav-icon should-invert" />
                                </th>
                                <th
                                    onClick={() => props.handleSort("level")}
                                    style={{
                                        cursor: "pointer",
                                        // display: "flex",
                                        // flexDirection: "row",
                                        // alignItems: "center",
                                    }}
                                >
                                    Level{" "}
                                    <SortSVG className="nav-icon should-invert" />
                                </th>
                                <th
                                    onClick={() =>
                                        props.handleSort("adventure pack")
                                    }
                                    style={{
                                        cursor: "pointer",
                                        // display: "flex",
                                        // flexDirection: "row",
                                        // alignItems: "center",
                                    }}
                                >
                                    Adventure Pack{" "}
                                    <SortSVG className="nav-icon should-invert" />
                                </th>
                                <th
                                    onClick={() => props.handleSort("xp")}
                                    style={{
                                        cursor: "pointer",
                                        // display: "flex",
                                        // flexDirection: "row",
                                        // alignItems: "center",
                                    }}
                                >
                                    XP/Min{" "}
                                    <SortSVG className="nav-icon should-invert" />
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
                                    Average Duration{" "}
                                    <SortSVG className="nav-icon should-invert" />
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
                                    Instances{" "}
                                    <SortSVG className="nav-icon should-invert" />
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {props.data.map((quest, i) => (
                                <tr
                                    className="content-table-row-highlight"
                                    key={quest.name}
                                    onClick={() => {
                                        props.handleSelection(quest);
                                    }}
                                >
                                    <td>
                                        {i +
                                            1 +
                                            props.pageNumber * props.pageSize}
                                    </td>
                                    <td
                                        style={{
                                            display: "flex",
                                            flexDirection: "row",
                                        }}
                                    >
                                        <div
                                            style={{
                                                cursor: "pointer",
                                                textDecoration: "underline",
                                                width: "max-content",
                                            }}
                                        >
                                            {quest.name}
                                        </div>
                                        {quest.groupsize === "Raid" && (
                                            <span
                                                style={{
                                                    fontWeight: "bold",
                                                    color: "red",
                                                    marginLeft: "5px",
                                                    opacity: 0.8,
                                                }}
                                            >
                                                R
                                            </span>
                                        )}
                                        <div
                                            className="report-quest-button"
                                            onClick={(e) => {
                                                props.reportQuest(quest.name);
                                                e.stopPropagation();
                                            }}
                                        >
                                            Report
                                        </div>
                                    </td>
                                    <td>{questLevelString(quest)}</td>
                                    <td>{quest.requiredadventurepack || ""}</td>
                                    <td>{questXpPerMinuteString(quest)}</td>
                                    <td>
                                        {averageTimeString(quest.averagetime)}
                                    </td>
                                    <td>{quest.datapoints}</td>
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
