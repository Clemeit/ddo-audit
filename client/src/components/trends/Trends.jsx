import React from "react";
import { Helmet } from "react-helmet";
import Banner from "../global/Banner";
import BannerMessage from "../global/BannerMessage";
import NoMobileOptimization from "../global/NoMobileOptimization";

const Trends = (props) => {
    const TITLE = "Data Trends";
    return (
        <div>
            <Helmet>
                <title>{TITLE}</title>
                <meta
                    name="description"
                    content="Check quest activity, duration, and popularity."
                />
            </Helmet>
            <Banner
                small={true}
                showTitle={true}
                showSubtitle={true}
                showButtons={false}
                title="Trends"
                subtitle="Long-term trends and custom reports"
            />
            <div id="content-container">
                <BannerMessage page="trends" />
                <div className="top-content-padding shrink-on-mobile" />
                <NoMobileOptimization />
                <div className="content-cluster">
                    <h2 style={{ color: "var(--text)" }}>
                        Server Population Trends
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
                            color: "var(--text-faded)",
                        }}
                    >
                        The last year of trend data for each server. Display as
                        individual servers, a composite overlay with all
                        servers, or a combined total population.
                    </p>
                    <h2 style={{ color: "var(--text)" }}>
                        Live Server and Hardcore Server Trends
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
                            color: "var(--text-faded)",
                        }}
                    >
                        The last year of trend data comparing the combined
                        population of the live servers compared to the
                        population of the Hardcore League server.
                    </p>
                    <h2 style={{ color: "var(--text)" }}>Custom Report</h2>
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
                            color: "var(--text-faded)",
                        }}
                    >
                        Select a date range and any combination of servers.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Trends;
