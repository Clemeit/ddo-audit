import React from "react";
import { Helmet } from "react-helmet";
import Banner from "../global/Banner";
import { ReactComponent as LinkSVG } from "../../assets/global/link.svg";
import { Link } from "react-router-dom";

const Community = (props) => {
    const TITLE = "Community Tools";

    const TOOLS = [
        {
            title: "Dungeon Helper",
            credit: "Morrikan, and the Vault of Kundarak Team",
            description:
                "Upload and search all of your characters' inventories from one place; add Auto Follow capability to DDO; and plan your next Greensteel item.",
            link: "https://dungeonhelper.com/",
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
                    content="A list of other useful community projects. If you have a project that you'd like added to the list, feel free to send me your suggestions!"
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
                title="Community Tools"
                subtitle="Tools developed by the community"
            />
            <div className="content-container" style={{ position: "relative" }}>
                <div className="top-content-padding" />
                <div
                    className="content-cluster"
                    style={{
                        marginBottom: "10px",
                    }}
                >
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
                            marginBottom: "0.3rem",
                        }}
                    >
                        These projects were developed by members of the DDO
                        community. If you'd like to see a project added, please{" "}
                        <Link to="/suggestions">make a suggestion</Link>!
                    </p>
                </div>
                <div className="content-cluster">
                    <div className="content-cluster-options">
                        {TOOLS.map((tool, i) => (
                            <a
                                href={tool.link}
                                rel="noreferrer"
                                target="_blank"
                                key={i}
                                className="community-box"
                            >
                                <h2 className="community-box-title column-on-mobile">
                                    <span>{tool.title} </span>
                                    <span
                                        style={{
                                            color: "var(--text-faded)",
                                        }}
                                    >
                                        <span className="hide-on-mobile">
                                            |{" "}
                                        </span>
                                        {tool.credit}
                                    </span>
                                </h2>
                                <p className="community-box-description">
                                    {tool.description}
                                </p>
                                <div className="community-box-link">
                                    <LinkSVG
                                        className="nav-icon-large should-invert"
                                        style={{ marginRight: "10px" }}
                                    />
                                    <span>Visit this project</span>
                                </div>
                            </a>
                        ))}
                    </div>
                </div>
                <div className="content-cluster">
                    <p
                        style={{
                            fontSize: "1.2rem",
                            lineHeight: "normal",
                            color: "var(--text-faded)",
                        }}
                    >
                        These are not my projects. DDO Audit is not necessarily
                        affiliated with any of the projects listed here. All
                        credit belongs to their respective owners. Do NOT
                        message me with feedback or requests regarding these
                        projects.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Community;
