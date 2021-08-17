import React from "react";
import {
    ComposedChart,
    Line,
    Area,
    Label,
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    Legend,
} from "recharts";

function DateConversion(date) {
    let options = {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
    };
    return new Date(Date.parse(date)).toLocaleDateString("en-US", options);
}

const serverNames = [
    "Argonnessen",
    "Cannith",
    "Ghallanda",
    "Khyber",
    "Orien",
    "Sarlona",
    "Thelanis",
    "Wayfinder",
    "Hardcore",
];

const colors = [
    "rgb(31, 119, 180)",
    "rgb(255, 127, 14)",
    "rgb(44, 160, 44)",
    "rgb(214, 39, 40)",
    "rgb(148, 103, 189)",
    "rgb(140, 86, 75)",
    "rgb(227, 119, 194)",
    "rgb(127, 127, 127)",
    "rgb(188, 189, 34)",
];

const CustomTooltip = ({ active, payload, label }) => {
    if (active) {
        return (
            payload && (
                <div className="area-line-tooltip">
                    <table>
                        <tbody>
                            <tr>
                                <th
                                    colSpan="2"
                                    style={{
                                        fontWeight: "bold",
                                        paddingLeft: "5px",
                                        paddingRight: "5px",
                                    }}
                                >
                                    {DateConversion(label) + " (Local)"}
                                </th>
                            </tr>
                            {payload.map((p) => (
                                <tr key={p.name}>
                                    <td
                                        style={{
                                            display: "flex",
                                            flexDirection: "row",
                                            alignItems: "center",
                                        }}
                                    >
                                        <div
                                            style={{
                                                width: "12px",
                                                height: "12px",
                                                backgroundColor: p.color,
                                                marginRight: "4px",
                                                marginLeft: "4px",
                                            }}
                                        ></div>
                                        {p.name}
                                        {": "}
                                    </td>
                                    <td
                                        style={{
                                            textAlign: "right",
                                            borderLeft: "dotted",
                                            borderWidth: "1px",
                                            borderColor: "white",
                                            paddingLeft: "20px",
                                            paddingRight: "10px",
                                        }}
                                    >
                                        {Math.round(p.value)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )
        );
    }

    return null;
};

const PlayerLfmChart = (props) => {
    return (
        <div className={props.isFilterable ? "chart-filterable" : ""}>
            <ResponsiveContainer width="100%" height={400}>
                <ComposedChart
                    margin={{ top: 5, right: 20, bottom: 5, left: 20 }}
                    data={props.data}
                >
                    {props.data && props.displayType === "Combined" && (
                        <Area
                            yAxisId="left"
                            type="monotone"
                            dataKey="TotalPlayers"
                            name="Players"
                            stroke="#0088ff"
                            fill="#0088ff"
                            fillOpacity="0.2"
                            strokeWidth="5"
                            dot={false}
                        />
                    )}
                    {props.data && props.displayType === "Combined" && (
                        <Line
                            yAxisId="right"
                            type="monotone"
                            dataKey="TotalLfms"
                            name="LFMs"
                            stroke="#dd6600"
                            strokeWidth="5"
                            dot={false}
                        />
                    )}

                    {serverNames.map(
                        (server, i) =>
                            props.displayType === "Composite" && (
                                <Line
                                    key={server + "Players"}
                                    yAxisId="left"
                                    type="monotone"
                                    dataKey={server + "Players"}
                                    name={server}
                                    stroke={colors[i]}
                                    strokeWidth="5"
                                    dot={false}
                                />
                            )
                    )}
                    {serverNames.map(
                        (server, i) =>
                            props.displayType === server && (
                                <Area
                                    key={server + "Players"}
                                    yAxisId="left"
                                    type="monotone"
                                    dataKey={server + "Players"}
                                    name="Players"
                                    stroke="#0088ff"
                                    fill="#0088ff"
                                    fillOpacity="0.2"
                                    strokeWidth="5"
                                    dot={false}
                                />
                            )
                    )}
                    {serverNames.map(
                        (server, i) =>
                            props.displayType === server && (
                                <Line
                                    key={server + "Lfms"}
                                    yAxisId="right"
                                    type="monotone"
                                    dataKey={server + "Lfms"}
                                    name="Lfms"
                                    stroke="#dd6600"
                                    strokeWidth="5"
                                    dot={false}
                                />
                            )
                    )}

                    <CartesianGrid stroke="#eee" strokeDasharray="2 6" />
                    <XAxis
                        dataKey="DateTime"
                        stroke="#ffffff"
                        interval={45}
                        format="time"
                    />
                    <YAxis yAxisId="left" stroke="#fff">
                        <Label
                            angle={270}
                            position="left"
                            style={{
                                stroke: "none",
                                textAnchor: "middle",
                                fill: "white",
                            }}
                            offset={0}
                        >
                            Players
                        </Label>
                    </YAxis>
                    {props.data &&
                        props.data[0].TotalLfms != null &&
                        props.displayType !== "Composite" && (
                            <YAxis
                                yAxisId="right"
                                orientation="right"
                                stroke="#fff"
                            >
                                <Label
                                    angle={270}
                                    position="right"
                                    style={{
                                        stroke: "none",
                                        textAnchor: "middle",
                                        fill: "white",
                                    }}
                                    offset={-10}
                                >
                                    LFMs
                                </Label>
                            </YAxis>
                        )}

                    <Legend />
                    <Tooltip
                        isAnimationActive={false}
                        content={<CustomTooltip />}
                    />
                </ComposedChart>
            </ResponsiveContainer>
        </div>
    );
};

export default PlayerLfmChart;
