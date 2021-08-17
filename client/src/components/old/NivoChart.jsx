import React, { Component } from "react";
import { ResponsiveLine } from "@nivo/line";

export default class NivoChart extends Component {
    render() {
        return (
            <div width="100%" height={400} style={{ height: "400px" }}>
                {this.props.data && (
                    <ResponsiveLine
                        data={this.props.data}
                        margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
                        xScale={{
                            type: "time",
                            format: "%Y-%m-%dT%H:%M:%SZ",
                            useUTC: true,
                            precision: "minute",
                        }}
                        xFormat="time:%Y-%m-%d"
                        yScale={{
                            type: "linear",
                            stacked: false,
                        }}
                        axisLeft={{
                            legend: "Players",
                            legendOffset: 12,
                        }}
                        axisRight={{
                            legend: "LFMs",
                            legendOffset: 12,
                        }}
                        axisBottom={{
                            format: "%b %d, %H:%M",
                            tickValues: "every 2 hour",
                            legend: "Time",
                            legendOffset: -12,
                        }}
                        curve="monotoneX"
                        enablePointLabel={false}
                        enablePoints={false}
                        pointBorderWidth={1}
                        useMesh={true}
                        enableSlices={false}
                        enableArea={true}
                        areaOpacity={0.25}
                    />
                )}
            </div>
        );
    }
}
