import React from "react";
import { ResponsivePie } from "@nivo/pie";

// This pie chart is used to show the server distribution.
// Pages: Servers

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

const ChartPie = (props) => {
    function GetTotalPopulation() {
        let total = 0;
        for (let i = 0; i < props.data.length; i++) {
            total += props.data[i].value;
        }

        return total;
    }

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
                <ResponsivePie
                    data={props.data}
                    margin={{ top: 30, right: 110, bottom: 30, left: 110 }}
                    valueFormat=" >-.1f"
                    sortByValue={true}
                    // colors={(d) => d.color}
                    padAngle={0.7}
                    cornerRadius={3}
                    activeOuterRadiusOffset={8}
                    colors={{ scheme: "category10" }}
                    borderWidth={1}
                    borderColor={{
                        from: "color",
                        modifiers: [["darker", 0.2]],
                    }}
                    enableArcLinkLabels={true}
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
                    arcLabelsRadiusOffset={0.7}
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
    );
};

export default ChartPie;
