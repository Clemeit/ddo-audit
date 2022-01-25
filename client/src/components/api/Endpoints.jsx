import React from "react";
import Endpoint from "./Endpoint";

const Endpoints = (props) => {
    const [endpoints, setEndpoints] = React.useState([
        {
            name: "Population Data",
            path: "population/",
            sub: [
                {
                    endpoint: "day",
                    description: (
                        <div>
                            <p style={{ marginBottom: "5px" }}>
                                Returns the last 24 hours of population data.
                                The data is returned as an array of server
                                objects. Each server object has an{" "}
                                <span className="api-field">id [string]</span>{" "}
                                (the name of the server), a{" "}
                                <span className="api-field">
                                    color [string]
                                </span>{" "}
                                (the color displayed on this website's graphs),
                                and{" "}
                                <span className="api-field">
                                    data [object array]
                                </span>
                                .
                            </p>
                            <p>
                                The{" "}
                                <span className="api-field">
                                    data [object array]
                                </span>{" "}
                                is an array of population objects, each with a
                                date (
                                <span className="api-field">
                                    x [string : %Y-%m-%dT%H:%M:%S.%LZ]
                                </span>
                                ) and a population count (
                                <span className="api-field">y [int]</span>)
                            </p>
                        </div>
                    ),
                },
                {
                    endpoint: "week",
                    description: (
                        <div>
                            <p style={{ marginBottom: "5px" }}>
                                Returns the last 168 hours of population data.
                                The data is returned as an array of server
                                objects. Each server object has an{" "}
                                <span className="api-field">id [string]</span>{" "}
                                (the name of the server), a{" "}
                                <span className="api-field">
                                    color [string]
                                </span>{" "}
                                (the color displayed on this website's graphs),
                                and{" "}
                                <span className="api-field">
                                    data [object array]
                                </span>
                                .
                            </p>
                            <p>
                                The{" "}
                                <span className="api-field">
                                    data [object array]
                                </span>{" "}
                                is an array of population objects, each with a
                                date (
                                <span className="api-field">
                                    x [string : %Y-%m-%dT%H:%M:%S.%LZ]
                                </span>
                                ) and an <b>hourly</b> population average (
                                <span className="api-field">y [int]</span>)
                            </p>
                        </div>
                    ),
                },
                {
                    endpoint: "quarter",
                    description: (
                        <div>
                            <p style={{ marginBottom: "5px" }}>
                                Returns the last 92 days of population data. The
                                data is returned as an array of server objects.
                                Each server object has an{" "}
                                <span className="api-field">id [string]</span>{" "}
                                (the name of the server), a{" "}
                                <span className="api-field">
                                    color [string]
                                </span>{" "}
                                (the color displayed on this website's graphs),
                                and{" "}
                                <span className="api-field">
                                    data [object array]
                                </span>
                                .
                            </p>
                            <p>
                                The{" "}
                                <span className="api-field">
                                    data [object array]
                                </span>{" "}
                                is an array of population objects, each with a
                                date (
                                <span className="api-field">
                                    x [string : %Y-%m-%dT%H:%M:%S.%LZ]
                                </span>
                                ) and a <b>daily</b> population average (
                                <span className="api-field">y [int]</span>)
                            </p>
                        </div>
                    ),
                },
                {
                    endpoint: "year",
                    description: (
                        <div>
                            <p style={{ marginBottom: "5px" }}>
                                Returns the last 52 weeks of population data.
                                The data is returned as an array of server
                                objects. Each server object has an{" "}
                                <span className="api-field">id [string]</span>{" "}
                                (the name of the server), a{" "}
                                <span className="api-field">
                                    color [string]
                                </span>{" "}
                                (the color displayed on this website's graphs),
                                and{" "}
                                <span className="api-field">
                                    data [object array]
                                </span>
                                .
                            </p>
                            <p>
                                The{" "}
                                <span className="api-field">
                                    data [object array]
                                </span>{" "}
                                is an array of population objects, each with a
                                date (
                                <span className="api-field">
                                    x [string : %Y-%m-%dT%H:%M:%S.%LZ]
                                </span>
                                ) and a <b>weekly</b> population average (
                                <span className="api-field">y [int]</span>)
                            </p>
                        </div>
                    ),
                },
            ],
            description:
                "Population data can be obtained from various endpoints found under the /population subdirectory. Endpoints exist for daily, weekly, quarterly, and annual population data.",
        },
    ]);

    return (
        <div>
            {endpoints.map((endpoint, i) => (
                <Endpoint
                    key={i}
                    data={endpoint}
                    handleExpansion={(sub) => {
                        let teps = endpoints;
                        teps
                            .filter((tep) => tep.name == endpoint.name)[0]
                            .sub.filter(
                                (s) => s.endpoint == sub.endpoint
                            )[0].expanded = !sub.expanded;
                        setEndpoints([...teps]);
                    }}
                />
            ))}
        </div>
    );
};

export default Endpoints;
