import React from "react";
import { Helmet } from "react-helmet";
import Banner from "./Banner";
import { ReactComponent as WarningSVG } from "../../assets/global/warning.svg";
import BannerMessage from "./BannerMessage";
import ContentCluster from "./ContentCluster";
import RegistrationList from "./RegistrationList";

const CharacterRegistration = () => {
    const TITLE = "DDO Audit Character Registration";
    const [disclaimerVisible, setDisclaimerVisible] = React.useState(false);

    React.useEffect(() => {
        if (localStorage.getItem("hide-character-registration-disclaimer")) {
            setDisclaimerVisible(false);
        } else {
            setDisclaimerVisible(true);
        }
    }, []);

    function dismissDisclaimer() {
        setDisclaimerVisible(false);
        localStorage.setItem("hide-character-registration-disclaimer", true);
    }

    return (
        <div>
            <Helmet>
                <title>{TITLE}</title>
                <meta
                    name="description"
                    content="Register a list of your characters for automatic LFM filtering and raid timer tracking."
                />
                <meta property="og:image" content="/icons/grouping-512px.png" />
                <meta property="og:site_name" content="DDO Audit" />
                <meta
                    property="twitter:image"
                    content="/icons/grouping-512px.png"
                />
            </Helmet>
            <Banner
                small={true}
                showTitle={true}
                showSubtitle={true}
                showButtons={false}
                hideOnMobile={true}
                title="Characters"
                subtitle="Character Registration"
            />
            <div className="content-container">
                <BannerMessage page="grouping" />
                <div className="top-content-padding shrink-on-mobile" />
                <ContentCluster
                    title="Characters"
                    description="Register your characters and we'll automatically filter the LFM panel based on your characters' current levels and keep track of your raid timers."
                >
                    <RegistrationList />
                </ContentCluster>
                {disclaimerVisible && (
                    <ContentCluster
                        title={
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "center",
                                    lineHeight: "30px",
                                }}
                            >
                                <WarningSVG
                                    style={{
                                        width: "30px",
                                        height: "30px",
                                        marginRight: "10px",
                                    }}
                                />
                                Please Note
                            </div>
                        }
                        altTitle="Please Note"
                        noLink={true}
                        description={
                            <span>
                                <p>
                                    Anonymous players must turn off 'Anonymous'
                                    for at least 1 minute before being
                                    registered, but may return to being
                                    anonymous afterwards. Players marked as
                                    anonymous will not show online/offline
                                    status and will have their guild and
                                    location redacted.
                                </p>
                                <p>
                                    We will <b>never</b> ask for your username,
                                    password, or personal data. Please do not
                                    share this type of information with us.
                                </p>
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

export default CharacterRegistration;
