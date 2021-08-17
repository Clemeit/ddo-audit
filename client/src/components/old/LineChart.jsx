import React from "react";
import { ResponsiveLine } from "@nivo/line";

const theme = {
    background: "#222222",
    textColor: "#ffffff",
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
            stroke: "#ffffff",
            strokeWidth: 1,
            strokeOpacity: 1,
            strokeDasharray: "6 6",
        },
    },
    tooltip: {
        container: {
            background: "#333",
            color: "inherit",
            fontSize: "inherit",
            borderRadius: "2px",
            boxShadow: "0 0 6px rgba(255, 255, 255, 0.25)",
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

const LineChart = (props) => {
    function FilterData(props) {
        switch (props.chartSubType) {
            case "history":
                return props.data.filter(
                    (series) =>
                        (series.id === "Total") &
                            (props.displayType === "Combined") ||
                        (series.id !== "Total") &
                            (props.displayType === "Composite")
                );
            case "timeofday":
                return props.data;
            case "dayofweek":
                break;
            default:
                return null;
        }
    }

    function GetXScale(props) {
        switch (props.chartSubType) {
            case "history":
                return {
                    type: "time",
                    format: "%Y-%m-%dT%H:%M:%SZ",
                    useUTC: true,
                };
            case "timeofday":
                return {
                    type: "linear",
                };
            case "dayofweek":
                break;
            default:
                return {};
        }
    }

    function GetBottomAxis(props) {
        switch (props.chartSubType) {
            case "history":
                return {
                    orient: "bottom",
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: -45,
                    //legend: "Time",
                    legendPosition: "middle",
                    tickValues:
                        props.trendType === "day"
                            ? "every 1 hour"
                            : props.trendType === "week"
                            ? "every 6 hour"
                            : "every 1 week",
                    format:
                        props.trendType === "day"
                            ? "%-I:%M %p"
                            : props.trendType === "week"
                            ? "%a %-I %p"
                            : "%a %b %-d",
                };
            case "timeofday":
                return {
                    orient: "bottom",
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: 0,
                    legend: "Time",
                    legendPosition: "middle",
                    legendOffset: 40,
                };
            case "dayofweek":
                break;
            default:
                return {};
        }
    }

    return (
        <div
            className={props.isFilterable ? "chart-filterable" : ""}
            style={{ height: "400px" }}
        >
            {props.data && (
                <ResponsiveLine
                    data={FilterData(props)}
                    margin={{ top: 20, right: 120, bottom: 60, left: 70 }}
                    xScale={GetXScale(props)}
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
                    axisBottom={GetBottomAxis(props)}
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
                    // colors={{ scheme: "category10" }}
                    //pointSize={10}
                    //pointColor={{ from: "color", modifiers: [] }}
                    //pointBorderWidth={2}
                    //pointBorderColor={{ from: "serieColor" }}
                    //pointLabelYOffset={-12}
                    enableArea={props.displayType === "Combined"}
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
            )}
        </div>
    );
};

export default LineChart;
