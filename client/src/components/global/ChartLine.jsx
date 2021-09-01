import React from "react";
import { ResponsiveLine } from "@nivo/line";

// This chart is used to show the population history (combined or composite) over time.
// Pages: Home, Servers

const theme = {
    background: "var(--base)",
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
            background: "var(--base)",
            color: "var(--text)",
            fontSize: "inherit",
            borderRadius: "2px",
            boxShadow: "0 0 6px var(--black)",
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

const ChartLine = (props) => {
    // const [filteredData, set_filteredData] = React.useState(null);
    const [isMobileLoaded, setIsMobileLoaded] = React.useState(false);

    // React.useEffect(() => {
    //     if (props.data === null) return;
    //     set_filteredData(
    //         props.data.filter(
    //             (series) =>
    //                 (series.id === "Total") &
    //                     (props.activeFilter === "Combined Activity") ||
    //                 (series.id !== "Total") &
    //                     (props.activeFilter === "Server Activity") ||
    //                 series.id === props.activeFilter
    //         )
    //     );
    // }, [props.data, props.activeFilter]);

    function XScale() {
        return {
            type: "time",
            format: "%Y-%m-%dT%H:%M:%S.%LZ",
            useUTC: false,
            precision: "hour",
        };
    }

    // function BottomAxis() {
    //     return {
    //         orient: "bottom",
    //         tickSize: 5,
    //         tickPadding: 5,
    //         tickRotation: -45,
    //         //legend: "Time",
    //         legendPosition: "middle",
    //         tickValues:
    //             props.trendType === "day"
    //                 ? "every 1 hour"
    //                 : props.trendType === "week"
    //                 ? "every 6 hour"
    //                 : "every 1 week",
    //         format:
    //             props.trendType === "day"
    //                 ? "%-I:%M %p"
    //                 : props.trendType === "week"
    //                 ? "%a %-I %p"
    //                 : "%a %b %-d",
    //     };
    // }

    return (
        <div>
            <div
                className={
                    isMobileLoaded
                        ? "hide-on-mobile"
                        : "secondary-button should-invert show-on-mobile full-width-mobile"
                }
                onClick={() => setIsMobileLoaded(true)}
            >
                Show this graph
            </div>
            <div
                className={
                    (props.filters || props.showServerFilters
                        ? "chart-filterable"
                        : "") + (isMobileLoaded ? "" : " hide-on-mobile")
                }
                style={{ height: "400px" }}
            >
                {props.data ? (
                    <ResponsiveLine
                        data={props.data}
                        keys={props.keys}
                        indexBy={props.indexBy}
                        margin={{ top: 20, right: 120, bottom: 60, left: 70 }}
                        xScale={{
                            type: "time",
                            format: "%Y-%m-%dT%H:%M:%SZ",
                            useUTC: true,
                            // precision: "hour",
                        }}
                        xFormat="time:%Y-%m-%dT%H:%M:%sZ"
                        yScale={{
                            type: "linear",
                            min: 0,
                            max: "auto",
                            stacked: false,
                            reverse: false,
                        }}
                        // yFormat=" >-.2f"
                        curve="natural"
                        axisTop={null}
                        axisRight={null}
                        //axisBottom={BottomAxis()}
                        axisBottom={{
                            tickSize: 5,
                            tickPadding: 5,
                            tickRotation: -45,
                            legend: props.legendBottom || "",
                            legendPosition: "middle",
                            legendOffset: 32,
                            // format: (value) => xLabel(value),
                            format: "%H:%M",
                            tickValues: props.tickValues || "every 1 hour",
                            //             props.trendType === "day"
                            //                 ? "every 1 hour"
                            //                 : props.trendType === "week"
                            //                 ? "every 6 hour"
                            //                 : "every 1 week",
                        }}
                        axisLeft={{
                            orient: "left",
                            tickSize: 5,
                            tickPadding: 5,
                            tickRotation: 0,
                            legend: props.legendLeft,
                            legendOffset: -50,
                            legendPosition: "middle",
                        }}
                        lineWidth={4}
                        enablePoints={false}
                        colors={(d) => d.color}
                        enableArea={props.activeFilter !== "Server Activity"}
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
                        <h5>{props.loadingMessage || "Loading data..."}</h5>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ChartLine;
