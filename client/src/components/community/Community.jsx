import React from "react";
import { Helmet } from "react-helmet";
import Banner from "../global/Banner";
import { ReactComponent as LinkSVG } from "../../assets/global/link.svg";

const Community = (props) => {
    const TITLE = "Community Tools";

    const TOOLS = [
        {
            title: "Automatic Inventory Management",
            credit: "Vault of Kundarak",
            description:
                "Upload your entire inventory with a single click, and search all of your characters' inventories from one place.",
            link: "https://www.vaultofkundarak.com/",
        },
        {
            title: "DDO Character Planner",
            credit: "Ordinary",
            description:
                "Plan your next character from start to finish with this character planner.",
            link: "https://www.ddo.com/forums/showthread.php/487211-DDO-Character-Planner",
        },
    ];

    return (
        <div>
            <Helmet>
                <title>{TITLE}</title>
                <meta
                    name="description"
                    content="Have a suggestion for DDO Audit? Submit it here!"
                />
            </Helmet>
            <Banner
                small={true}
                showTitle={true}
                showSubtitle={true}
                showButtons={false}
                hideOnMobile={true}
                title="Community Tools"
                subtitle="Tools developed by the community"
            />
            <div id="content-container">
                <div className="top-content-padding" />
                <div className="content-cluster">
                    <h2 style={{ color: "var(--text)" }}>Community Tools</h2>
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
                        These projects were developed by members of the DDO
                        community. If you'd like to see a project added, please
                        make a suggestion!
                    </p>
                    <p
                        style={{
                            fontSize: "1.2rem",
                            lineHeight: "normal",
                            color: "var(--text-faded)",
                        }}
                    >
                        These are not my tools! DDO Audit is in no way
                        affiliated with the developers of these various
                        projects. All credit belongs to their respective owners.
                    </p>
                </div>
                <div className="content-cluster">
                    <div className="content-cluster-options">
                        {TOOLS.map((tool, i) => (
                            <div
                                key={i}
                                className="nav-box"
                                style={{ width: "100%" }}
                            >
                                <div className="nav-box-title">
                                    <h2 className="content-option-title">
                                        {tool.title}{" "}
                                        <span
                                            style={{
                                                color: "var(--text-faded)",
                                            }}
                                        >
                                            | {tool.credit}
                                        </span>
                                    </h2>
                                </div>
                                <p
                                    className="content-option-description"
                                    style={{ fontSize: "1.5rem" }}
                                >
                                    {tool.description}
                                </p>
                                <div
                                    style={{
                                        display: "flex",
                                        flexDirection: "row",
                                        alignItems: "center",
                                        fontSize: "1.5rem",
                                        color: "var(--text-faded)",
                                    }}
                                >
                                    <LinkSVG
                                        className="nav-icon-large should-invert"
                                        style={{ marginRight: "10px" }}
                                    />
                                    <span
                                    // style={{
                                    //     maxWidth: "350px",
                                    //     overflow: "hidden",
                                    //     textOverflow: "ellipsis",
                                    // }}
                                    >
                                        Visit this project
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Community;
