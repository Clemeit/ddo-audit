import React from "react";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import Banner from "../global/Banner";
import BannerMessage from "../global/BannerMessage";
import Card from "../global/Card";
import ContentCluster from "../global/ContentCluster";
import NoMobileOptimization from "../global/NoMobileOptimization";
import TimerList from "./TimerList";

const Timers = (props) => {
    const TITLE = "Raid Timers";
    const [disclaimerVisible, setDisclaimerVisible] = React.useState(false);

    React.useEffect(() => {
        if (localStorage.getItem("hide-raid-timer-disclaimer")) {
            setDisclaimerVisible(false);
        } else {
            setDisclaimerVisible(true);
        }
    }, []);

    function dismissDisclaimer() {
        setDisclaimerVisible(false);
        localStorage.setItem("hide-raid-timer-disclaimer", true);
    }

    return (
        <div>
            <Helmet>
                <title>{TITLE}</title>
                <meta
                    name="description"
                    content="Check your raid timers before you log in!"
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
                title="Raid Timers"
                subtitle="Check Raid Timers"
            />
            <div className="content-container">
                <BannerMessage page="timers" />
                <div className="top-content-padding shrink-on-mobile" />
                <NoMobileOptimization />
                <ContentCluster
                    title="Raid Timers"
                    description="View your characters' current raid timers based on questing activity."
                >
                    <TimerList />
                    <div style={{ display: "flex" }}>
                        <Link
                            className="primary-button should-invert"
                            to="/registration"
                        >
                            Manage characters
                        </Link>
                    </div>
                </ContentCluster>
                {disclaimerVisible && (
                    <ContentCluster
                        title="Please Note"
                        noLink={true}
                        description={
                            <span>
                                <p>
                                    The raid timers displayed here are estimates
                                    and come with the following caveats:
                                </p>
                                <ul>
                                    <li>
                                        The timer begins the moment your
                                        character leaves a raid, whether or not
                                        the raid was completed.
                                    </li>
                                    <li>
                                        The timer starts even if you forget to
                                        claim your reward from the quest giver.
                                    </li>
                                    <li>
                                        There is no way to account for the use
                                        of Raid Timer Bypass Hourglasses.
                                    </li>
                                    <li>
                                        There is no distinction between
                                        legendary and heroic versions of a raid.
                                    </li>
                                    <li>
                                        Some raids may not be tracked. If you
                                        find one, let me know.
                                    </li>
                                </ul>
                            </span>
                        }
                        noFade={true}
                    >
                        <div
                            className="secondary-button should-invert"
                            onClick={() => dismissDisclaimer()}
                        >
                            Dismiss
                        </div>
                    </ContentCluster>
                )}
            </div>
        </div>
    );
};

export default Timers;
