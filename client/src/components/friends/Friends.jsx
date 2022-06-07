import React from "react";
import { Helmet } from "react-helmet";
import Banner from "../global/Banner";
import PopupMessage from "../global/PopupMessage";
import BannerMessage from "../global/BannerMessage";
import FriendsPanel from "./FriendsPanel";
import PageMessage from "../global/PageMessage";
import { Log } from "../../services/CommunicationService";

const Friends = () => {
    // TODO: If this server is currently offline, don't bother checking for players
    const TITLE = "Friends List";

    const [openPanels] = React.useState([
        <FriendsPanel onError={() => setShowErrorMessage(true)} />,
    ]);

    // Popup message
    var [popupMessage, setPopupMessage] = React.useState(null);

    // PageMessage
    const [showErrorMessage, setShowErrorMessage] = React.useState(false);

    function clearFriendsList() {
        localStorage.setItem("friends-list", "[]");
        window.location.reload();
    }

    React.useEffect(() => {
        if (showErrorMessage) {
            Log(
                "Friend error message shown",
                JSON.stringify(localStorage.getItem("friends-list"))
            );
        }
    }, [showErrorMessage]);

    return (
        <div>
            <Helmet>
                <title>{TITLE}</title>
                <meta
                    name="description"
                    content="What are your friends up to? Build your own friends list to quickly check who's online!"
                />
                <meta property="og:image" content="/icons/friends-512px.png" />
                <meta property="og:site_name" content="DDO Audit" />
                <meta
                    property="twitter:image"
                    content="/icons/friends-512px.png"
                />
            </Helmet>
            <Banner
                small={true}
                showTitle={true}
                showSubtitle={true}
                showButtons={false}
                hideOnMobile={true}
                title="Friends List"
                subtitle="Are Your Friends Online?"
            />
            <PopupMessage
                page={"friends"}
                message={popupMessage}
                popMessage={() => {
                    setPopupMessage(null);
                }}
            />
            <div
                className="content-container"
                style={{ minHeight: "700px", width: "100%" }}
            >
                <BannerMessage className="push-on-mobile" page="friends" />
                <div
                    id="top-content-padding"
                    className="top-content-padding hide-on-mobile"
                />
                {showErrorMessage && (
                    <div style={{ maxWidth: "706px", width: "100%" }}>
                        <PageMessage
                            type="error"
                            title="Something Broke"
                            message={
                                <>
                                    Try again later. If you still see this
                                    message, try clearing your friends list.
                                    <div
                                        className="action-button-container"
                                        style={{
                                            fontSize: "0.9rem",
                                            marginBottom: "-25px",
                                            justifyContent: "right",
                                        }}
                                    >
                                        <div
                                            className="primary-button should-invert full-width-mobile"
                                            onClick={() =>
                                                window.location.reload()
                                            }
                                        >
                                            Refresh
                                        </div>
                                        <div
                                            className="danger-button should-invert full-width-mobile"
                                            onClick={() => clearFriendsList()}
                                        >
                                            Clear Friends List
                                        </div>
                                    </div>
                                </>
                            }
                            fontSize={1.3}
                            pushBottom={true}
                        />
                    </div>
                )}
                <div className="multi-panel-container">{openPanels}</div>
                <div className="top-content-padding hide-on-mobile" />
            </div>
        </div>
    );
};

export default Friends;
