import React from "react";
import { SERVER_LIST } from "../../constants/Servers";

const CustomBarLegend = (props) => {
    const COLORS = [
        "hsl(205, 70%, 41%)",
        "hsl(28, 100%, 53%)",
        "hsl(120, 57%, 40%)",
        "hsl(360, 69%, 50%)",
        "hsl(271, 39%, 57%)",
        "hsl(10, 30%, 42%)",
        "hsl(318, 66%, 68%)",
        "hsl(0, 0%, 50%)",
        "hsl(60, 70%, 44%)",
    ];

    return (
        <div
            className={
                "chart-legend " +
                (props.isMobileLoaded ? "" : " hide-on-mobile")
            }
        >
            {props.data &&
                SERVER_LIST.map((server, i) => (
                    <div
                        key={i}
                        className={
                            "chart-legend-item" +
                            (props.excludedSeries.includes(server)
                                ? " excluded"
                                : "")
                        }
                        onClick={() => props.switchExcludedSeries(server)}
                    >
                        <div
                            style={{
                                width: "12px",
                                height: "12px",
                                backgroundColor: COLORS[i],
                            }}
                        />
                        <span>{server}</span>
                    </div>
                ))}
        </div>
    );
};

export default CustomBarLegend;
