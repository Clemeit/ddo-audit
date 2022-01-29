import React from "react";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import Banner from "../global/Banner";
import Endpoints from "./Endpoints";
import ContentCluster from "../global/ContentCluster";

const Api = (props) => {
    const TITLE = "DDO Audit API";

    return (
        <div>
            <Helmet>
                <title>{TITLE}</title>
                <meta
                    name="description"
                    content="Utilize our data for your own projects! Build a Discord bot, track player activity, or publish your own mobile app. All for free!"
                />
                <meta
                    property="og:image"
                    content="/icons/logo-512px.png"
                    data-react-helmet="true"
                />
                <meta
                    property="twitter:image"
                    content="/icons/logo-512px.png"
                    data-react-helmet="true"
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
                <ContentCluster title="About the DDO Audit API">
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
                </ContentCluster>
                <ContentCluster title="How to Use the API">
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
                </ContentCluster>
                <ContentCluster title="Endpoints">
                    <Endpoints />
                </ContentCluster>
            </div>
        </div>
    );
};

export default Api;
