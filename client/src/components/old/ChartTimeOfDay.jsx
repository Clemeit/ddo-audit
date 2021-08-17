import React from "react";
import { ResponsiveLine } from "@nivo/line";

// This chart is used to show time-of-day distribution.
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

const ChartTimeOfDay = (props) => {
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
                <ResponsiveLine
                    data={props.data}
                    margin={{ top: 20, right: 120, bottom: 60, left: 70 }}
                    xScale={{
                        type: "linear",
                    }}
                    //xFormat="time:%Y-%m-%dT%H:%M:%sZ"
                    yScale={{
                        type: "linear",
                        min: 0,
                        max: "auto",
                        stacked: false,
                        reverse: false,
                    }}
                    //yFormat=" >-.2f"
                    curve="natural"
                    axisTop={null}
                    axisRight={null}
                    axisBottom={{
                        orient: "bottom",
                        tickSize: 5,
                        tickPadding: 5,
                        tickRotation: 0,
                        legend: "Hour",
                        legendOffset: 40,
                        legendPosition: "middle",
                    }}
                    axisLeft={{
                        orient: "left",
                        tickSize: 5,
                        tickPadding: 5,
                        tickRotation: 0,
                        legend: "Players",
                        legendOffset: -50,
                        legendPosition: "middle",
                    }}
                    lineWidth={4}
                    enablePoints={false}
                    colors={(d) => d.color}
                    enableArea={false}
                    areaOpacity={0.3}
                    enableSlices="x"
                    useMesh={true}
                    legends={[
                        {
                            anchor: "right",
                            direction: "column",
                            justify: false,
                            translateX: 120,
                            translateY: 0,
                            itemsSpacing: 0,
                            itemDirection: "left-to-right",
                            itemWidth: 110,
                            itemHeight: 20,
                            itemOpacity: 1,
                            symbolSize: 12,
                            symbolShape: "circle",
                            symbolBorderColor: "rgba(0, 0, 0, .5)",
                            effects: [
                                {
                                    on: "hover",
                                    style: {
                                        //itemBackground: "rgba(255, 255, 255, .03)",
                                        itemOpacity: 1,
                                    },
                                },
                            ],
                        },
                    ]}
                    motionConfig="stiff"
                    theme={theme}
                ></ResponsiveLine>
            ) : (
                <div className="loading-data-message">
                    <h5>Loading data...</h5>
                </div>
            )}
        </div>
    );
};

export default ChartTimeOfDay;
