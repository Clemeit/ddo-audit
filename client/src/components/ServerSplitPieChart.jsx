import React from "react";
import {
    PieChart,
    Pie,
    // Sector,
    Legend,
    Cell,
    ResponsiveContainer,
} from "recharts";

// const serverNames = [
//     "Argonnessen",
//     "Cannith",
//     "Ghallanda",
//     "Khyber",
//     "Orien",
//     "Sarlona",
//     "Thelanis",
//     "Wayfinder",
//     "Hardcore",
// ];

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

// Custom label
const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
    index,
}) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.7;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
        <text
            style={{ fontSize: "large" }}
            x={x}
            y={y}
            fill="white"
            textAnchor="middle"
            dominantBaseline="central"
        >
            {percent !== 0 ? `${(percent * 100).toFixed(0)}%` : ""}
        </text>
    );
};

const ServerSplitPieChart = (props) => {
    return (
        <div className={props.isFilterable ? "chart-filterable" : ""}>
            <ResponsiveContainer width="100%" height={400}>
                <PieChart>
                    {props.data && (
                        <Pie
                            dataKey="value"
                            data={props.data}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={renderCustomizedLabel}
                            outerRadius={160}
                        >
                            {props.data.map((entry, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={colors[index]}
                                    color="#000"
                                />
                            ))}
                        </Pie>
                    )}
                    {props.data && (
                        <Legend
                            payload={props.data.map((item, index) => ({
                                id: item.name,
                                type: "square",
                                value: `${item.name} (${Math.round(
                                    item.value
                                )})`,
                                color: colors[index],
                            }))}
                        />
                    )}
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
};

export default ServerSplitPieChart;
