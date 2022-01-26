import React from "react";
import { Helmet } from "react-helmet";
import Banner from "../global/Banner";
import { Fetch } from "../../services/DataLoader";
import BannerMessage from "../global/BannerMessage";
import NoMobileOptimization from "../global/NoMobileOptimization";
import ChartLine from "../global/ChartLine";

const Trends = (props) => {
    const TITLE = "Data Trends";

    const [population1Year, setPopulation1Year] = React.useState(null);

    React.useEffect(() => {
        Fetch("https://api.ddoaudit.com/population/year", 5000).then((val) => {
            setPopulation1Year(val.filter((series) => series.id !== "Total"));
        });
    }, []);

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
                hideOnMobile={true}
                title="Trends"
                subtitle="Long-term trends and custom reports"
            />
            <div className="content-container">
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
                    <ChartLine
                        data={population1Year}
                        trendType="quarter"
                        activeFilter="Server Activity"
                        showActions={false}
                        showLastUpdated={true}
                        reportReference={null}
                    />
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
