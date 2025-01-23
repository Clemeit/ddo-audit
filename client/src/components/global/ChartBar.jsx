import React from "react";
import { ResponsiveBar } from "@nivo/bar";
import CustomBarLegend from "./CustomBarLegend";

// This chart is used to show class distribution.
// Pages: Servers

const theme = {
  background: "var(--base)",
  text: {
    fontSize: 14,
    fill: "var(--text)",
  },
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

const ChartBar = (props) => {
  const [isMobileLoaded, setIsMobileLoaded] = React.useState(false);

  const [isMobile, setIsMobile] = React.useState(null);
  React.useEffect(() => {
    setIsMobile(window.innerWidth <= 950);
  }, []);

  const [excludedSeries, setExcludedSeries] = React.useState(
    props.forceHardcore ? [] : ["Hardcore"]
  );
  function switchExcludedSeries(server) {
    if (excludedSeries.includes(server)) {
      let temp = [...excludedSeries.filter((s) => s != server)];
      setExcludedSeries([...temp]);
    } else {
      let temp = [...excludedSeries, server];
      setExcludedSeries([...temp]);
    }
  }

  function xLabel(value) {
    if (props.days) {
      if (value % 24 === 0) {
        return ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][
          Math.floor(value / 24)
        ];
      } else if (value % 6 === 0) {
        return value - Math.floor(value / 24) * 24;
      } else {
        return "";
      }
    }

    return value;
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
          (props.filters || props.showServerFilters ? "chart-filterable" : "") +
          (isMobileLoaded ? "" : " hide-on-mobile")
        }
        style={{ height: "400px" }}
      >
        {props.data ? (
          <ResponsiveBar
            data={props.data}
            // keys={[
            //     "Argonnessen",
            //     "Cannith",
            //     "Ghallanda",
            //     "Khyber",
            //     "Orien",
            //     "Sarlona",
            //     "Thelanis",
            //     "Wayfinder",
            //     "Hardcore",
            // ]}
            // indexBy="className"
            keys={props.keys
              .slice(0)
              .filter((k) => !excludedSeries.includes(k))}
            indexBy={props.indexBy}
            margin={{
              top: 20,
              right: 0,
              bottom: isMobile ? 80 : props.paddingBottom || 80,
              left: isMobile ? 40 : 60,
            }}
            padding={0.15}
            minValue={0}
            groupMode={
              isMobile ? "" : props.display === "grouped" ? "grouped" : ""
            }
            valueScale={{ type: "linear" }}
            indexScale={{ type: "band", round: true }}
            colors={
              props.dataIncludesColors
                ? ({ id, data }) => data[`${id}Color`]
                : { scheme: "category10" }
            }
            borderColor={{
              from: "color",
              modifiers: [["darker", 1.6]],
            }}
            axisTop={null}
            axisRight={null}
            axisBottom={{
              tickSize: 5,
              tickPadding: 5,
              tickRotation: isMobile || !props.straightLegend ? -45 : 0,
              legend: isMobile ? "" : props.legendBottom || "",
              legendPosition: "middle",
              legendOffset: props.legendOffset || 32,
              format: (value) => xLabel(value),
            }}
            axisLeft={{
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 0,
              legend: isMobile ? "" : props.legendLeft || "",
              legendPosition: "middle",
              legendOffset: -50,
              // format: (value) =>
              //     `${props.display === "Grouped" ? value + "%" : ""}`,
            }}
            // tooltipFormat={(value) => `${value}%`}
            // label={(d) => `${Math.round(d.value)}%`}
            labelSkipWidth={40}
            labelSkipHeight={18}
            labelTextColor={"white"}
            // legends={[
            //     {
            //         dataFrom: "keys",
            //         anchor: "right",
            //         direction: "column",
            //         justify: false,
            //         translateX: 120,
            //         translateY: 0,
            //         itemsSpacing: 2,
            //         itemWidth: 110,
            //         itemHeight: 20,
            //         symbolShape: "circle",
            //         itemDirection: "left-to-right",
            //         itemOpacity: 1,
            //         symbolSize: 12,
            //         // effects: [
            //         //     {
            //         //         on: "hover",
            //         //         style: {
            //         //             itemOpacity: 1,
            //         //         },
            //         //     },
            //         // ],
            //     },
            // ]}
            animate={props.noAnim ? false : true}
            theme={theme}
            motionStiffness={300}
            motionDamping={30}
          />
        ) : (
          <div className="loading-data-message">
            <h5>{props.loadingMessage || "Loading data..."}</h5>
          </div>
        )}
      </div>
      {!props.hideLegend && (
        <CustomBarLegend
          data={props.data}
          legendKeys={props.legendKeys}
          isMobileLoaded={isMobileLoaded}
          excludedSeries={excludedSeries}
          switchExcludedSeries={(server) => switchExcludedSeries(server)}
        />
      )}
    </div>
  );
};

export default ChartBar;
