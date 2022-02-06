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
    const [permanentVsHardcore1Year, setPermanentVsHardcore1Year] =
        React.useState(null);
    const [minsAndMaxes1Year, setMinsAndMaxes1Year] = React.useState(null);
    const [minsAndMaxesQuarter, setMinsAndMaxesQuarter] = React.useState(null);

    React.useEffect(() => {
        Fetch("https://api.ddoaudit.com/population/year", 5000).then((val) => {
            setPopulation1Year(
                val.filter(
                    (series) =>
                        series.id !== "Total" &&
                        series.id !== "Permanent" &&
                        series.id !== "Minimum" &&
                        series.id !== "Maximum"
                )
            );
            setPermanentVsHardcore1Year(
                val.filter(
                    (series) =>
                        series.id === "Permanent" ||
                        series.id === "Hardcore" ||
                        series.id === "Total"
                )
            );
            setMinsAndMaxes1Year(
                val.filter(
                    (series) =>
                        series.id === "Total" ||
                        series.id === "Minimum" ||
                        series.id === "Maximum"
                )
            );
        });

        Fetch("https://api.ddoaudit.com/population/quarter", 5000).then(
            (val) => {
                setMinsAndMaxesQuarter(
                    val.filter(
                        (series) =>
                            series.id === "Total" ||
                            series.id === "Minimum" ||
                            series.id === "Maximum"
                    )
                );
            }
        );
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
                subtitle="Long-term population trends"
            />
            <div className="content-container">
                <BannerMessage page="trends" />
                <div className="top-content-padding shrink-on-mobile" />
                <NoMobileOptimization />
                <ContentCluster
                    title="Server Population Trends"
                    description="The last two years of trend data for each server displayed as weekly averages. All server downtimes are ignored."
                >
                    <ChartLine
                        data={population1Year}
                        trendType="annual"
                        activeFilter="Server Activity"
                        showActions={false}
                        showLastUpdated={true}
                        reportReference={null}
                        marginBottom={120}
                        height="460px"
                    />
                </ContentCluster>
                <ContentCluster
                    title="Permanent Servers vs. Hardcore League"
                    description="The last two years of trend data displayed as a total of all servers, total of the permanent servers, and Hardcore League server only. All server downtimes are ignored."
                >
                    <ChartLine
                        data={permanentVsHardcore1Year}
                        trendType="annual"
                        activeFilter="Server Activity"
                        showActions={false}
                        showLastUpdated={true}
                        reportReference={null}
                        marginBottom={120}
                        height="460px"
                        showArea={true}
                        areaOpacity={0.1}
                    />
                </ContentCluster>
                <ContentCluster
                    title="Weekly Minimum and Maximum Population"
                    description="The last two years of trend data displayed as weekly minimums, maximums, and averages."
                >
                    <ChartLine
                        data={minsAndMaxes1Year}
                        trendType="annual"
                        activeFilter="Server Activity"
                        showActions={false}
                        showLastUpdated={true}
                        reportReference={null}
                        marginBottom={120}
                        height="460px"
                        showArea={false}
                        areaOpacity={0.1}
                    />
                </ContentCluster>
                <ContentCluster
                    title="Daily Minimum and Maximum Population"
                    description="The last quarter of trend data displayed as daily minimums, maximums, and averages."
                >
                    <ChartLine
                        data={minsAndMaxesQuarter}
                        trendType="quarter"
                        activeFilter="Server Activity"
                        showActions={false}
                        showLastUpdated={true}
                        reportReference={null}
                        marginBottom={120}
                        height="460px"
                        showArea={false}
                        areaOpacity={0.1}
                    />
                </ContentCluster>
            </div>
        </div>
    );
};

export default Trends;
