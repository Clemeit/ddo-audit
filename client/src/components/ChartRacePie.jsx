import React from "react";
import { ResponsivePie } from "@nivo/pie";

// This pie chart is used to show the server distribution.
// Pages: Servers

const theme = {
    background: "var(--card)",
    textColor: "var(--text)",
    fontSize: 16,
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
        tableCell: {
            padding: "3px 5px",
        },
    },
};

const ChartRacePie = (props) => {
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
                    margin={{ top: 20, right: 150, bottom: 30, left: 150 }}
                    valueFormat=" >-.1f"
                    sortByValue={true}
                    colors={{ scheme: "category10" }}
                    padAngle={0.7}
                    cornerRadius={3}
                    innerRadius={0.6}
                    activeOuterRadiusOffset={8}
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
                    arcLabelsTextColor={"white"}
                    theme={theme}
                />
            ) : (
                <div className="loading-data-message">
                    <h5>Loading data...</h5>
                </div>
            )}
        </div>
    );
};

export default ChartRacePie;
