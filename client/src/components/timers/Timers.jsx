import React from "react";
import { Helmet } from "react-helmet";
import Banner from "../global/Banner";
import Card from "../global/Card";
import ContentCluster from "../global/ContentCluster";

const Timers = (props) => {
    const TITLE = "Raid Timers";
    return (
        <div>
            <Helmet>
                <title>{TITLE}</title>
                <meta
                    name="description"
                    content="Check your raid timers before you log in."
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
                <div className="top-content-padding shrink-on-mobile" />
                <ContentCluster
                    title="Raid Timers"
                    description="View your characters' current raid timers based on questing activity. Timers are automatically tracked but can be manually reset or edited if necessary."
                >
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "10px",
                        }}
                    >
                        <div
                            style={{
                                backgroundColor: "var(--highlighted-1)",
                                borderRadius: "7px",
                                padding: "7px 10px",
                            }}
                        >
                            <h4>Clemeit</h4>
                            <span>
                                <span
                                    className="lfm-number"
                                    style={{ fontSize: "1.2rem" }}
                                >
                                    Killing Time:
                                </span>
                                <span
                                    style={{
                                        fontSize: "1.2rem",
                                        marginLeft: "10px",
                                    }}
                                >
                                    1 day, 13 hours, 12 minutes
                                </span>
                            </span>
                            <br />
                            <span>
                                <span
                                    className="lfm-number"
                                    style={{ fontSize: "1.2rem" }}
                                >
                                    Too Hot to Handle:
                                </span>
                                <span
                                    style={{
                                        fontSize: "1.2rem",
                                        marginLeft: "10px",
                                    }}
                                >
                                    1 day, 11 hours, 45 minutes
                                </span>
                            </span>
                        </div>
                        <div
                            style={{
                                backgroundColor: "var(--highlighted-1)",
                                borderRadius: "7px",
                                padding: "7px 10px",
                            }}
                        >
                            <h4>Clemeiit-1</h4>
                            <span>
                                <span
                                    className="lfm-number"
                                    style={{ fontSize: "1.2rem" }}
                                >
                                    Vision of Destruction:
                                </span>
                                <span
                                    style={{
                                        fontSize: "1.2rem",
                                        marginLeft: "10px",
                                    }}
                                >
                                    4 hours, 37 minutes
                                </span>
                            </span>
                            <br />
                            <span>
                                <span
                                    className="lfm-number"
                                    style={{ fontSize: "1.2rem" }}
                                >
                                    Tempest's Spine:
                                </span>
                                <span
                                    style={{
                                        fontSize: "1.2rem",
                                        marginLeft: "10px",
                                    }}
                                >
                                    1 day, 17 hours, 51 minutes
                                </span>
                            </span>
                        </div>
                        <div
                            style={{
                                backgroundColor: "var(--highlighted-1)",
                                borderRadius: "7px",
                                padding: "7px 10px",
                            }}
                        >
                            <h4>Songbot</h4>
                            <span>
                                <span
                                    className="lfm-number"
                                    style={{ fontSize: "1.2rem" }}
                                >
                                    The Chronoscope:
                                </span>
                                <span
                                    style={{
                                        fontSize: "1.2rem",
                                        marginLeft: "10px",
                                    }}
                                >
                                    2 days, 7 hours, 40 minutes
                                </span>
                            </span>
                        </div>
                    </div>
                </ContentCluster>
            </div>
        </div>
    );
};

export default Timers;
