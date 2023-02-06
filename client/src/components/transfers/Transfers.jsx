import React from "react";
import { Helmet } from "react-helmet";
import PopupMessage from "../global/PopupMessage";
import Banner from "../global/Banner";
import BannerMessage from "../global/BannerMessage";
import ContentCluster from "../global/ContentCluster";
import { Log } from "../../services/CommunicationService";
import ChartLine from "../global/ChartLine";
import { Fetch } from "../../services/DataLoader";
import ToggleButton from "../global/ToggleButton";
import { Link } from "react-router-dom";

const Transfers = () => {
    const TITLE = "Server Transfers";
    const DAY_ONLY = {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
    };

    // Popup message
    var [popupMessage, setPopupMessage] = React.useState(null);

    const [ignoreHCLCounts, setIgnoreHCLCounts] = React.useState(false);
    const [ignoreHCLTo, setIgnoreHCLTo] = React.useState(false);

    function dataFailedToLoad() {
        setPopupMessage({
            title: "Some data failed to load",
            message:
                "Some of the reports on this page may have failed to load. Please refresh the page. If the issue continues, report it.",
            icon: "warning",
            fullscreen: false,
            reportMessage: "Failed to fetch data.",
        });
    }

    const [transferCounts, setTransferCounts] = React.useState(null);
    const [transfersTo, setTransfersTo] = React.useState(null);
    const [transfersFrom, setTransfersFrom] = React.useState(null);

    React.useEffect(() => {
        Log("Transfers page", "Page viewed");

        Fetch("https://api.ddoaudit.com/population/transfersfrom", 5000)
            .then((val) => {
                setTransfersFrom(
                    val.filter((set) => set.id !== "Hardcore").reverse()
                );
            })
            .catch((err) => {
                dataFailedToLoad();
            });
    }, []);

    React.useEffect(() => {
        Fetch(
            `https://api.ddoaudit.com/population/transfercounts${
                ignoreHCLCounts ? "_ignorehcl" : ""
            }`,
            5000
        )
            .then((val) => {
                setTransferCounts(val.reverse());
            })
            .catch((err) => {
                dataFailedToLoad();
            });
    }, [ignoreHCLCounts]);

    React.useEffect(() => {
        Fetch(
            `https://api.ddoaudit.com/population/transfersto${
                ignoreHCLTo ? "_ignorehcl" : ""
            }`,
            5000
        )
            .then((val) => {
                setTransfersTo(
                    val.filter((set) => set.id !== "Hardcore").reverse()
                );
            })
            .catch((err) => {
                dataFailedToLoad();
            });
    }, [ignoreHCLTo]);

    return (
        <div>
            <Helmet>
                <title>{TITLE}</title>
                <meta
                    name="description"
                    content="Explore character transfer trends. Discover where characters are moving, which servers are gaining, and which servers are losing."
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
                title="Server Transfers"
                subtitle="The Movement of Characters"
            />
            <PopupMessage
                page="transfers"
                message={popupMessage}
                popMessage={() => {
                    setPopupMessage(null);
                }}
            />
            <div className="content-container">
                <BannerMessage page="transfers" />
                <div className="top-content-padding shrink-on-mobile" />
                <ContentCluster
                    title="About Server Transfers"
                    description={
                        <span>
                            <ul>
                                <li>
                                    The following reports display server
                                    transfer information. Like most of the
                                    demographic reports on DDO Audit, the
                                    reports shown here only count characters
                                    that have logged in within the last 90 days.
                                </li>
                                <li>
                                    A "transfer character" is defined as a
                                    character that is currently playing on a
                                    different server than the one they were
                                    created on.
                                </li>
                                <li>
                                    A lot of character transfers result from the
                                    existence of the Hardcore server. You can
                                    filter those transfers out of the reports
                                    with the toggle buttons.
                                </li>
                                <li>
                                    This is a new feature, and it deals with a
                                    new set of data. There may be
                                    inconsistencies. Numbers may not be exact,
                                    but they will provide excellent insight into
                                    overarching trends.
                                </li>
                            </ul>
                            <div
                                style={{
                                    width: "100%",
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: "7px",
                                }}
                            >
                                <span>Thanks, Clemeit</span>
                                <Link to="/suggestions">Make a suggestion</Link>
                            </div>
                        </span>
                    }
                    smallBottomMargin={true}
                />
                <ContentCluster
                    title="Total Transfer Characters"
                    description={
                        <>
                            <p>
                                The total number of transfer characters online
                                on any given day.{" "}
                                <span className="lfm-number">
                                    This is NOT the number of character
                                    transfers per day.
                                </span>
                            </p>
                            <ToggleButton
                                className="wide"
                                textA="Include HCL Transfers"
                                textB="Exclude HCL Transfers"
                                isA={!ignoreHCLCounts}
                                isB={ignoreHCLCounts}
                                doA={() => {
                                    setIgnoreHCLCounts(false);
                                }}
                                doB={() => {
                                    setIgnoreHCLCounts(true);
                                }}
                            />
                        </>
                    }
                >
                    <ChartLine
                        keys={null}
                        indexBy={null}
                        legendBottom="Day"
                        legendLeft="Total Transfer Characters"
                        data={transferCounts}
                        title="Transfer Characters"
                        marginBottom={60}
                        trendType="week"
                        noArea={true}
                        straightLegend={true}
                        tooltipPrefix="Day"
                        padLeft={true}
                        yMin="auto"
                        dateOptions={DAY_ONLY}
                    />
                </ContentCluster>
                <ContentCluster
                    title={`Transfers "To"`}
                    description={
                        <>
                            <p>
                                The total number of characters transferred{" "}
                                <i>to</i> each server. Servers with a high
                                transfer count are gaining players from other
                                servers.
                            </p>
                            <ToggleButton
                                className="wide"
                                textA="Include HCL Transfers"
                                textB="Exclude HCL Transfers"
                                isA={!ignoreHCLTo}
                                isB={ignoreHCLTo}
                                doA={() => {
                                    setIgnoreHCLTo(false);
                                }}
                                doB={() => {
                                    setIgnoreHCLTo(true);
                                }}
                            />
                        </>
                    }
                >
                    <ChartLine
                        keys={null}
                        indexBy={null}
                        legendBottom="Day"
                        legendLeft="Total Transfer Characters"
                        data={transfersTo}
                        title="Transfer Characters To"
                        marginBottom={60}
                        trendType="week"
                        noArea={true}
                        straightLegend={true}
                        tooltipPrefix="Day"
                        padLeft={true}
                        yMin="auto"
                        dateOptions={DAY_ONLY}
                    />
                </ContentCluster>
                <ContentCluster
                    title={`Transfers "From"`}
                    description={
                        <span>
                            <p>
                                The total number of characters transferred{" "}
                                <i>from</i> each server. Servers with a high
                                transfer count are losing players to other
                                servers.
                            </p>
                        </span>
                    }
                >
                    <ChartLine
                        keys={null}
                        indexBy={null}
                        legendBottom="Day"
                        legendLeft="Total Transfer Characters"
                        data={transfersFrom}
                        title="Transfer Characters From"
                        x
                        marginBottom={60}
                        trendType="week"
                        noArea={true}
                        straightLegend={true}
                        tooltipPrefix="Day"
                        padLeft={true}
                        yMin="auto"
                        dateOptions={DAY_ONLY}
                    />
                </ContentCluster>
            </div>
        </div>
    );
};

export default Transfers;
