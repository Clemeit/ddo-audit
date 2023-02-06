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

const Transfers = () => {
    const TITLE = "Server Transfers";

    // Popup message
    var [popupMessage, setPopupMessage] = React.useState(null);

    const [ignoreHCL, setIgnoreHCL] = React.useState(false);

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
        Fetch(
            `https://api.ddoaudit.com/population/transfercounts${
                ignoreHCL ? "_ignorehcl" : ""
            }`,
            5000
        )
            .then((val) => {
                setTransferCounts(val.reverse());
            })
            .catch((err) => {
                dataFailedToLoad();
            });

        Fetch(
            `https://api.ddoaudit.com/population/transfersto${
                ignoreHCL ? "_ignorehcl" : ""
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

        Fetch("https://api.ddoaudit.com/population/transfersfrom", 5000)
            .then((val) => {
                setTransfersFrom(
                    val.filter((set) => set.id !== "Hardcore").reverse()
                );
            })
            .catch((err) => {
                dataFailedToLoad();
            });
    }, [ignoreHCL]);

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
                            <p>
                                The following reports display server transfer
                                information. Like most of the demographic
                                reports on DDO Audit, the server transfer
                                reports only count characters that have logged
                                in within the last 90 days.
                            </p>
                            <p>
                                Note: a "transfer character" is defined as a
                                character that is currently playing on a
                                different server than the one they were created
                                on.
                            </p>
                            <p>
                                A lot of transfers result from the existence
                                Hardcore server. You can filter these transfers
                                out of the report using the button below.
                            </p>
                        </span>
                    }
                >
                    <ToggleButton
                        className="wide"
                        textA="Include HCL Transfers"
                        textB="Exclude HCL Transfers"
                        isA={!ignoreHCL}
                        isB={ignoreHCL}
                        doA={() => {
                            setIgnoreHCL(false);
                        }}
                        doB={() => {
                            setIgnoreHCL(true);
                        }}
                    />
                </ContentCluster>
                <ContentCluster
                    title="Total Transfer Characters"
                    description={
                        <span>
                            <p>
                                The total number of transfer characters online
                                on any given day. This is NOT the number of
                                character transfers per day.
                            </p>
                        </span>
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
                        trendType="day"
                        noArea={true}
                        straightLegend={true}
                        tooltipPrefix="Day"
                        padLeft={true}
                        yMin="auto"
                    />
                </ContentCluster>
                <ContentCluster
                    title={`Transfers "To"`}
                    description={
                        <p>
                            The total number of characters transferred <i>to</i>{" "}
                            each server. Servers with a high transfer count are
                            gaining players from other servers.
                        </p>
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
                        trendType="day"
                        noArea={true}
                        straightLegend={true}
                        tooltipPrefix="Day"
                        padLeft={true}
                        yMin="auto"
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
                            {ignoreHCL && (
                                <p>
                                    <span className="red-text">Note:</span>{" "}
                                    Filtering out Hardcore League transfers
                                    doesn't affect this report since you cannot
                                    transfer from any server to the Hardcore
                                    server.
                                </p>
                            )}
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
                        forceHardcore={true}
                        marginBottom={60}
                        trendType="day"
                        noArea={true}
                        straightLegend={true}
                        tooltipPrefix="Day"
                        padLeft={true}
                        yMin="auto"
                    />
                </ContentCluster>
            </div>
        </div>
    );
};

export default Transfers;
