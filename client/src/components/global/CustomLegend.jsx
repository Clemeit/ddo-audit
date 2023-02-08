import React from "react";

const CustomLegend = (props) => {
  return (
    <div
      className={
        "chart-legend " + (props.isMobileLoaded ? "" : " hide-on-mobile")
      }
    >
      {props.data &&
        props.data
          .slice(0)
          .reverse()
          .map((dat, i) => (
            <div
              key={i}
              className={
                "chart-legend-item" +
                (props.excludedSeries.includes(dat.id) ? " excluded" : "")
              }
              onClick={() => props.switchExcludedSeries(dat)}
            >
              <div
                style={{
                  width: "12px",
                  height: "12px",
                  backgroundColor: dat.color,
                }}
              />
              <span>{dat.id}</span>
            </div>
          ))}
    </div>
  );
};

export default CustomLegend;
