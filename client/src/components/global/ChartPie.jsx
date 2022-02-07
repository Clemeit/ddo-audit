import React from "react";
import { ResponsivePie } from "@nivo/pie";
import CustomLegend from "./CustomLegend";

// This pie chart is used to show the server distribution.
// Pages: Servers

const ChartPie = (props) => {
    const theme = {
        background: "var(--base)",
        textColor: "var(--text)",
        fontSize: 16,
        tooltip: {
            container: {
                background: "var(--base)",
                color: "inherit",
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

    const [isMobileLoaded, setIsMobileLoaded] = React.useState(
        props.alwaysShow === true ? true : false
    );

    function GetTotalPopulation() {
        let filtered = props.data.filter(
            (series) => !excludedSeries.includes(series.id)
        );
        if (filtered.length === 1) return filtered[0].value;
        if (filtered.length === 0) return 1;
        let total = 0;
        for (let i = 0; i < filtered.length; i++) {
            total += filtered[i].value;
        }

        return total;
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

    const [isMobile, setIsMobile] = React.useState(null);
    React.useEffect(() => {
        setIsMobile(window.innerWidth <= 950);
    }, []);

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
                style={{ height: "400px" }}
            >
                {props.data ? (
                    <ResponsivePie
                        data={props.data.filter(
                            (series) => !excludedSeries.includes(series.id)
                        )}
                        innerRadius={props.innerRadius || 0}
                        margin={{
                            top: isMobile ? 5 : 20,
                            right: isMobile ? 5 : 140,
                            bottom: isMobile ? 5 : 30,
                            left: isMobile ? 5 : 140,
                        }}
                        valueFormat=" >-.1f"
                        sortByValue={true}
                        // colors={(d) => d.color}
                        padAngle={0.7}
                        cornerRadius={3}
                        activeOuterRadiusOffset={8}
                        colors={
                            props.useDataColors
                                ? { datum: "data.color" }
                                : { scheme: "category10" }
                        }
                        borderWidth={1}
                        borderColor={{
                            from: "color",
                            modifiers: [["darker", 0.2]],
                        }}
                        enableArcLinkLabels={!isMobile}
                        arcLinkLabelsSkipAngle={10}
                        arcLinkLabelsThickness={2}
                        arcLinkLabelsColor={{ from: "color" }}
                        arcLabel={function (e) {
                            return `${(
                                (e.value / GetTotalPopulation()) *
                                100
                            ).toFixed(1)}%`;
                        }}
                        arcLabelsSkipAngle={10}
                        arcLabelsRadiusOffset={
                            props.arcLabelsRadiusOffset || 0.7
                        }
                        arcLabelsTextColor={"white"}
                        // legends={[
                        //     {
                        //         anchor: "right",
                        //         direction: "column",
                        //         justify: false,
                        //         translateX: 0,
                        //         translateY: 0,
                        //         itemsSpacing: 0,
                        //         itemWidth: 120,
                        //         itemHeight: 25,
                        //         itemTextColor: "#fff",
                        //         itemDirection: "left-to-right",
                        //         itemOpacity: 1,
                        //         symbolSize: 18,
                        //         symbolShape: "circle",
                        //         effects: [
                        //             {
                        //                 on: "hover",
                        //                 style: {
                        //                     itemTextColor: "#000",
                        //                 },
                        //             },
                        //         ],
                        //     },
                        // ]}
                        theme={theme}
                    />
                ) : (
                    <div className="loading-data-message">
                        <h5>{props.loadingMessage || "Loading data..."}</h5>
                    </div>
                )}
            </div>
            {!props.hideCustomLegend && (
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

export default ChartPie;
