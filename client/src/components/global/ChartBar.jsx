import React from "react";
import { ResponsiveBar } from "@nivo/bar";

// This chart is used to show class distribution.
// Pages: Servers

const theme = {
    background: "var(--card)",
    textColor: "var(--text)",
    fontSize: 14,
    axis: {
        domain: {
            line: {
                stroke: "#777777",
                strokeWidth: 1,
            },
        },
        ticks: {
            line: {
                stroke: "#777777",
                strokeWidth: 2,
            },
        },
    },
    grid: {
        line: {
            stroke: "#dddddd",
            strokeWidth: 1,
        },
    },
    crosshair: {
        line: {
            stroke: "var(--text)",
            strokeWidth: 1,
            strokeOpacity: 1,
            strokeDasharray: "6 6",
        },
    },
    tooltip: {
        container: {
            background: "var(--card)",
            color: "inherit",
            fontSize: "inherit",
            borderRadius: "2px",
            boxShadow: "0 0 6px var(--card-border)",
            padding: "5px 9px",
        },
        basic: {
            whiteSpace: "pre",
            display: "flex",
            alignItems: "center",
        },
        table: {},
        tableCell: {
            padding: "3px 5px",
        },
    },
};

const ChartBar = (props) => {
    return (
        <div
            className={
                props.filters || props.showServerFilters
                    ? "chart-filterable"
                    : ""
            }
            style={{ height: "400px" }}
        >
            {props.data ? (
                <ResponsiveBar
                    data={props.data}
                    keys={[
                        "Argonnessen",
                        "Cannith",
                        "Ghallanda",
                        "Khyber",
                        "Orien",
                        "Sarlona",
                        "Thelanis",
                        "Wayfinder",
                        "Hardcore",
                    ]}
                    indexBy="className"
                    margin={{ top: 20, right: 120, bottom: 80, left: 70 }}
                    padding={0.15}
                    minValue={0}
                    groupMode={props.display === "Grouped" ? "grouped" : ""}
                    valueScale={{ type: "linear" }}
                    indexScale={{ type: "band", round: true }}
                    colors={{ scheme: "category10" }}
                    borderColor={{
                        from: "color",
                        modifiers: [["darker", 1.6]],
                    }}
                    axisTop={null}
                    axisRight={null}
                    axisBottom={{
                        tickSize: 5,
                        tickPadding: 5,
                        tickRotation: -45,
                        legend: "",
                        legendPosition: "middle",
                        legendOffset: 32,
                    }}
                    axisLeft={{
                        tickSize: 5,
                        tickPadding: 5,
                        tickRotation: 0,
                        legend: "Players",
                        legendPosition: "middle",
                        legendOffset: -50,
                        format: (value) =>
                            `${props.display === "Grouped" ? value + "%" : ""}`,
                    }}
                    tooltipFormat={(value) => `${value}%`}
                    label={(d) => `${Math.round(d.value)}%`}
                    labelSkipWidth={20}
                    labelSkipHeight={18}
                    labelTextColor={"white"}
                    legends={[
                        {
                            dataFrom: "keys",
                            anchor: "right",
                            direction: "column",
                            justify: false,
                            translateX: 120,
                            translateY: 0,
                            itemsSpacing: 2,
                            itemWidth: 110,
                            itemHeight: 20,
                            symbolShape: "circle",
                            itemDirection: "left-to-right",
                            itemOpacity: 1,
                            symbolSize: 12,
                            // effects: [
                            //     {
                            //         on: "hover",
                            //         style: {
                            //             itemOpacity: 1,
                            //         },
                            //     },
                            // ],
                        },
                    ]}
                    animate={true}
                    theme={theme}
                    motionStiffness={300}
                    motionDamping={30}
                />
            ) : (
                <div className="loading-data-message">
                    <h5>Loading data...</h5>
                </div>
            )}
        </div>
    );
};

export default ChartBar;
