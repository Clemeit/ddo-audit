import React, { Component } from "react";
import Filter from "./Filter";
import { ReactComponent as TrendPositiveSVG } from "../assets/global/trendpositive.svg";
import { ReactComponent as TrendNegativeSVG } from "../assets/global/trendnegative.svg";
import { ReactComponent as TrendNeutralSVG } from "../assets/global/trendneutral.svg";

function TrendDisplay(props, serverName) {
    if (
        props.trendType === null ||
        props.trendType === undefined ||
        props.trendType === ""
    )
        return <div></div>;
    if (props.data === null)
        return <div style={{ marginLeft: 10 }}>(Loading data...)</div>;
    let delta;
    // Get correct dataset to use, depending on the server prop
    let dataset = props.data[0];
    if (serverName) {
        props.data.forEach((datum) => {
            if (datum.id === serverName) {
                dataset = datum;
            }
        });
    }
    switch (props.trendType) {
        case "day":
            delta =
                (dataset.data[dataset.data.length - 1].y - dataset.data[0].y) /
                dataset.data[0].y;
            break;
        case "week":
            delta =
                (dataset.data[dataset.data.length - 1].y - dataset.data[0].y) /
                dataset.data[0].y;
            break;
        case "quarter":
            delta =
                (dataset.data[dataset.data.length - 1].y -
                    dataset.data[dataset.data.length - 29].y) /
                dataset.data[dataset.data.length - 29].y;
            break;
        default:
            delta = 0;
            break;
    }
    if (delta < -0.03)
        return (
            <div className="trend-display">
                <TrendNegativeSVG style={{ marginRight: "5px" }} />
                <span className="red-text">{Math.round(delta * 100)}%</span>
            </div>
        );
    else if (delta > 0.03)
        return (
            <div className="trend-display">
                <TrendPositiveSVG style={{ marginRight: "5px" }} />
                <span className="green-text">+{Math.round(delta * 100)}%</span>
            </div>
        );
    else
        return (
            <div className="trend-display">
                <TrendNeutralSVG
                    style={{ marginRight: "5px" }}
                    className="link-icon"
                />
                <span className="default-text">~0%</span>
            </div>
        );
}

const Tile = (props) => {
    function report(reference) {
        props.content.props.reportReference(reference);
    }

    return (
        <div>
            <h4
                style={{
                    display: "flex",
                    flexDirection: "row",
                    fontWeight: "bold",
                }}
            >
                {props.title}{" "}
                {TrendDisplay(props.content.props, props.serverName)}
            </h4>
            {props.description}
            {/* Render the chart's histories, filters, and displays. */}
            {(props.content.props.filters ||
                props.content.props.showServerFilters ||
                props.content.props.histories ||
                props.content.props.displays) && (
                <Filter
                    histories={props.content.props.histories}
                    filters={props.content.props.filters}
                    showServerFilters={props.content.props.showServerFilters}
                    serverFilterReference={
                        props.content.props.serverFilterReference
                    }
                    displays={props.content.props.displays}
                />
            )}
            {/* Render the actual chart itself. This is a component that has been passed down from the page level. */}
            {props.content}
            {/* Render the chart's actions. */}
            {props.content.props.showActions && (
                <div className="chart-action-bar">
                    <span
                        className="blue-link chart-action-bar-item"
                        style={{ paddingLeft: "0px" }}
                    >
                        Download this graph
                    </span>
                    <span
                        className="blue-link chart-action-bar-item"
                        onClick={() => report(props)}
                    >
                        Report a problem
                    </span>
                    {props.content.props.showLastUpdated &&
                        props.content.props.data && (
                            <span
                                className="chart-action-bar-item"
                                style={{
                                    marginLeft: "auto",
                                    paddingRight: "0px",
                                }}
                            >
                                Last updated:{" "}
                                {props.content.props.data &&
                                    props.content.props.data[0].data[
                                        props.content.props.data[0].data
                                            .length - 1
                                    ].x}
                            </span>
                        )}
                </div>
            )}
        </div>
    );
};

export default Tile;
