import React from "react";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import Banner from "../global/Banner";
import Endpoints from "./Endpoints";

const Api = (props) => {
    const TITLE = "DDO Audit API";

    return (
        <div>
            <Helmet>
                <title>{TITLE}</title>
                <meta
                    name="description"
                    content="A live summary of DDO's current player population and LFM status. View population trends, check server status, browse live grouping panels, and see what server is best for you!"
                />
            </Helmet>
            <Banner
                small={false}
                showTitle={true}
                showSubtitle={true}
                showButtons={true}
                hideOnMobile={false}
                title="DDO Audit API"
                subtitle="Use our data for your projects"
            />
            <div className="content-container">
                <div className="top-content-padding shrink-on-mobile" />
                <div className="content-cluster">
                    <h2 style={{ color: "var(--text)" }}>
                        About the DDO Audit API
                    </h2>
                    <hr
                        style={{
                            backgroundColor: "var(--text)",
                            opacity: 0.2,
                        }}
                    />
                    <p
                        style={{
                            fontSize: "1.5rem",
                            lineHeight: "normal",
                            color: "var(--text)",
                        }}
                    >
                        We offer our data for the community to use through a
                        free, public API. By using our API, you agree to the
                        following stipulations<sup>&#8224;</sup>:
                    </p>
                    <ul
                        style={{
                            fontSize: "1.5rem",
                            lineHeight: "normal",
                            color: "var(--text)",
                        }}
                    >
                        <li>
                            You may not monetize any project that uses our data.
                            This includes running ads, implementing paywalls, or
                            selling Android or iOS applications in their
                            respective app stores.
                        </li>
                        <li>
                            You may not use our data for malicious or illegal
                            purposes as defined by local law.
                        </li>
                        <li>
                            You may not use our data to hinder, harass, or
                            insult members of the community or development team.
                        </li>
                        <li>
                            You must credit "DDO Audit" for the data and provide
                            at least one hyperlink to the website's main page, "
                            <a
                                href="https://www.ddoaudit.com/"
                                rel="noreferrer"
                                target="_blank"
                            >
                                https://www.ddoaudit.com/
                            </a>
                            ".
                        </li>
                    </ul>
                    <p
                        style={{
                            fontSize: "1.5rem",
                            lineHeight: "normal",
                            color: "var(--text)",
                        }}
                    >
                        <span style={{ color: "var(--text-lfm-number)" }}>
                            We are providing this data as-is and in good faith
                            that it will be used to the benefit of the
                            community.
                        </span>{" "}
                        If abused, this API will be disabled.
                    </p>
                    <p>
                        <sup>&#8224;</sup> This is in no way a legally binding
                        contract. I am not a lawyer. Please use this data to
                        engage with the community in a positive, helpful manner.
                    </p>
                </div>
                <div className="content-cluster">
                    <h2 style={{ color: "var(--text)" }}>How to Use the API</h2>
                    <hr
                        style={{
                            backgroundColor: "var(--text)",
                            opacity: 0.2,
                        }}
                    />
                    <p
                        style={{
                            fontSize: "1.5rem",
                            lineHeight: "normal",
                            color: "var(--text)",
                        }}
                    >
                        DDO Audit's API is available on the "api" subdomain (
                        <a
                            href="https://api.ddoaudit.com/"
                            rel="noreferrer"
                            target="_blank"
                        >
                            https://api.ddoaudit.com/
                        </a>
                        ). There are various subdirectories for different types
                        of data. For example, population data can be found on
                        the{" "}
                        <a
                            href="https://api.ddoaudit.com/population"
                            rel="noreferrer"
                            target="_blank"
                        >
                            /population
                        </a>{" "}
                        subdirectory. A full list of API endpoints can be found
                        below. Data can be retrieved by sending a GET request to
                        any of the endpoints. The content-type is always
                        application/json.
                    </p>
                    <p
                        style={{
                            fontSize: "1.5rem",
                            lineHeight: "normal",
                            color: "var(--text)",
                        }}
                    >
                        When possible, please limit the number of API requests
                        you make to one (1) every 15 seconds.
                    </p>
                </div>
                <div className="content-cluster">
                    <h2 style={{ color: "var(--text)" }}>Endpoints</h2>
                    <hr
                        style={{
                            backgroundColor: "var(--text)",
                            opacity: 0.2,
                        }}
                    />
                    <Endpoints />
                </div>
            </div>
        </div>
    );
};

export default Api;
