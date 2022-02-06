import React from "react";
import { ResponsiveLine } from "@nivo/line";
import CustomLegend from "./CustomLegend";

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

    const [isMobile, setIsMobile] = React.useState(null);
    React.useEffect(() => {
        setIsMobile(window.innerWidth <= 950);
    }, []);

    function getAxisLeft() {
        if (isMobile)
            return {
                orient: "left",
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
            };
        return {
            orient: "left",
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: props.legendLeft,
            legendOffset: -50,
            legendPosition: "middle",
        };
    }

    const [excludedSeries, setExcludedSeries] = React.useState([""]);
    function switchExcludedSeries(series) {
        if (excludedSeries.includes(series.id)) {
            let temp = [...excludedSeries.filter((s) => s != series.id)];
            setExcludedSeries([...temp]);
        } else {
            let temp = [...excludedSeries, series.id];
            setExcludedSeries([...temp]);
        }
    }

    return (
        <div>
            <div
                className={
                    isMobileLoaded
                        ? "hide-on-mobile"
                        : "secondary-button should-invert show-on-mobile full-width-mobile"
                }
                style={{ display: isMobileLoaded ? "none" : "" }}
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
                style={{ height: props.height || "400px" }}
            >
                {props.data ? (
                    <ResponsiveLine
                        data={props.data.filter(
                            (series) => !excludedSeries.includes(series.id)
                        )}
                        keys={props.keys}
                        indexBy={props.indexBy}
                        margin={{
                            top: 20,
                            right: 10,
                            bottom: props.marginBottom || 60,
                            left: isMobile ? 40 : 60,
                        }}
                        xScale={{
                            type:
                                props.title === "Popularity over time"
                                    ? "time"
                                    : props.title === "Distribution"
                                    ? "point"
                                    : "time",
                            format:
                                props.title === "Popularity over time"
                                    ? "%Y-%m-%d"
                                    : props.title === "Distribution"
                                    ? ""
                                    : "%Y-%m-%dT%H:%M:%S.%LZ",
                            useUTC: true,
                            // precision: "hour",
                        }}
                        xFormat={
                            props.title === "Popularity over time"
                                ? "time:%Y-%m-%d"
                                : props.title === "Distribution"
                                ? ""
                                : "time:%Y-%m-%dT%H:%M:%S.%LZ"
                        }
                        yScale={{
                            type: "linear",
                            min: 0,
                            max: "auto",
                            stacked: false,
                            reverse: false,
                        }}
                        // yFormat=" >-.2f"
                        curve={props.curve || "cardinal"}
                        axisTop={null}
                        axisRight={null}
                        //axisBottom={BottomAxis()}
                        axisBottom={{
                            tickSize: 5,
                            tickPadding: 5,
                            tickRotation:
                                isMobile || !props.straightLegend ? -45 : 0,
                            legend: isMobile ? "" : props.legendBottom || "",
                            legendPosition: "middle",
                            legendOffset: 40,
                            // format: (value) => xLabel(value),
                            format:
                                props.trendType === "day"
                                    ? "%H:%M"
                                    : props.trendType === "week"
                                    ? "%b %d, %Y"
                                    : props.trendType === "quarter"
                                    ? "%b %d, %Y"
                                    : props.trendType === "annual"
                                    ? "%b %d, %Y"
                                    : "",
                            tickValues:
                                props.tickValues || props.trendType === "day"
                                    ? "every 1 hour"
                                    : props.trendType === "week"
                                    ? "every 1 day"
                                    : props.trendType === "quarter"
                                    ? "every 1 week"
                                    : props.trendType === "annual"
                                    ? "every 4 week"
                                    : "",
                        }}
                        axisLeft={getAxisLeft()}
                        lineWidth={4}
                        enablePoints={false}
                        colors={(d) => d.color}
                        enableArea={
                            props.showArea
                                ? true
                                : props.noArea
                                ? false
                                : props.activeFilter !== "Server Activity"
                        }
                        areaOpacity={props.areaOpacity || 0.3}
                        enableSlices="x"
                        useMesh={true}
                        motionConfig="stiff"
                        theme={theme}
                    ></ResponsiveLine>
                ) : (
                    <div className="loading-data-message">
                        <h5>{props.loadingMessage || "Loading data..."}</h5>
                    </div>
                )}
            </div>
            {!props.hideLegend && (
                <CustomLegend
                    data={props.data}
                    isMobileLoaded={isMobileLoaded}
                    excludedSeries={excludedSeries}
                    switchExcludedSeries={(id) => switchExcludedSeries(id)}
                />
            )}
        </div>
    );
};

export default ChartLine;
