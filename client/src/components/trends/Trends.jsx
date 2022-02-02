import React from "react";
import { Helmet } from "react-helmet";
import Banner from "../global/Banner";
import { Fetch } from "../../services/DataLoader";
import BannerMessage from "../global/BannerMessage";
import NoMobileOptimization from "../global/NoMobileOptimization";
import ChartLine from "../global/ChartLine";
import ContentCluster from "../global/ContentCluster";

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
                    content="DDO's population trends over the last year. View permanent servers' and Hardcore League's population over time. See how each update has effected the population."
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
                <ContentCluster
                    title="Server Population Trends"
                    description="The last year of trend data for each server displayed as weekly averages. All server downtimes are ignored."
                >
                    <ChartLine
                        data={population1Year}
                        trendType="quarter"
                        activeFilter="Server Activity"
                        showActions={false}
                        showLastUpdated={true}
                        reportReference={null}
                        marginBottom={120}
                        height="460px"
                    />
                </ContentCluster>
                <ContentCluster
                    title="Live Server and Hardcore Server Trends"
                    description="The last year of trend data comparing the combined
                        population of the live servers compared to the
                        population of the Hardcore League server."
                ></ContentCluster>
                <ContentCluster
                    title="Custom Report"
                    description="Select a date range and any combination of servers."
                ></ContentCluster>
            </div>
        </div>
    );
};

export default Trends;
