import React from "react";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import Banner from "../global/Banner";

const About = (props) => {
    const TITLE = "About DDO Audit";

    return (
        <div>
            <Helmet>
                <title>{TITLE}</title>
                <meta
                    name="description"
                    content="A live summary of DDO's current player population and LFM status. View population trends, check server status, browse live grouping panels, and see what server is best for you!"
                />
            </Helmet>
            <Banner
                small={false}
                showTitle={true}
                showSubtitle={true}
                showButtons={true}
                hideOnMobile={false}
                title="About DDO Audit"
                subtitle="Real-time Player Concurrency Data and LFM Viewer"
            />
            <div id="content-container">
                <div className="top-content-padding shrink-on-mobile" />
                <div className="content-cluster">
                    <h2 style={{ color: "var(--text)" }}>Our Mission</h2>
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
                            color: "var(--text)",
                        }}
                    >
                        We want to give players the most accurate and up-to-date
                        information on DDO's population as possible, and provide
                        the community with useful tools that players have been
                        asking for: a Live LFM panel and Live Who list. We're
                        not here to push an agenda or to point fingers.{" "}
                        <span style={{ color: "var(--text-lfm-number)" }}>
                            Our goal is, and has always been, to provide as
                            transparent and unbiased information as possible.
                        </span>
                    </p>
                </div>
                <div className="content-cluster">
                    <h2 style={{ color: "var(--text)" }}>Our Methodology</h2>
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
                            color: "var(--text)",
                        }}
                    >
                        Player data is collected from the game client every 15
                        seconds. This data contains no personally-identifying
                        information; the information that this data contains is
                        visible in the in-game "Who" panel (name, gender, race,
                        etc.).{" "}
                        <span style={{ color: "var(--text-lfm-number)" }}>
                            We do not collect, store, or publish personal
                            information.
                        </span>{" "}
                        We do, however, collect information on anonymous
                        players. Anonymous players <u>are</u> counted in the
                        population reports. Anonymous players <u>are not</u>{" "}
                        counted in any demographic reports and will never show
                        up in our Who panel (our API includes anonymous players,
                        but their names are replaced with "Anonymous").
                    </p>
                    <p
                        style={{
                            fontSize: "1.5rem",
                            lineHeight: "normal",
                            color: "var(--text)",
                        }}
                    >
                        The player data that we collect includes name, gender,
                        race, class, level, location, and guild name. This
                        information is used to generate the various demographic
                        reports on the website. When a player posts a public
                        LFM, the collected data also includes public comment,
                        quest selection, difficulty selection, level range,
                        accepted classes, and the "adventure active" length.
                        Each player in a group is also assigned a Group ID. This
                        is of particular importance because it allows us to
                        reconstruct groups of players. The group data is used to
                        generate the LFM panel (that's not a screenshot - it's
                        being drawn in your browser).
                    </p>
                </div>
                <div className="content-cluster">
                    <h2 style={{ color: "var(--text)" }}>Contributions</h2>
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
                            color: "var(--text)",
                        }}
                    >
                        A special thanks to the incredibly talented and generous
                        developers over at Vault of Kundarak. Their support
                        played an integral role in the development of this
                        project's Live LFM and Who panels. Visit their various
                        projects:{" "}
                        <a
                            href="https://vaultofkundarak.com/"
                            rel="noreferrer"
                            target="_blank"
                        >
                            VoK Item Database
                        </a>
                        ,{" "}
                        <a
                            href="https://dungeonhelper.com/"
                            rel="noreferrer"
                            target="_blank"
                        >
                            DDO Plugin Framework
                        </a>
                        , and{" "}
                        <a
                            href="https://trove.dungeonhelper.com/"
                            rel="noreferrer"
                            target="_blank"
                        >
                            Automated Inventory Management
                        </a>
                        , or stop by their{" "}
                        <a
                            href="https://discord.gg/bfMZnbz"
                            rel="noreferrer"
                            target="_blank"
                        >
                            Discord channel
                        </a>{" "}
                        to stay up-to-date on their development.
                    </p>
                    <p
                        style={{
                            fontSize: "1.5rem",
                            lineHeight: "normal",
                            color: "var(--text)",
                        }}
                    >
                        And thank <i>you</i> for your continued support. This
                        project simply would not exist without DDO's incredible
                        community. Many of the features of this website were a
                        result of player feedback - both directly and indirectly
                        on the DDO Discord, Forums, and Reddit - and your
                        continued use inspires me to grow and develop this
                        website far beyond what I could have ever imagined. I'm
                        always looking for feedback and suggestions!
                    </p>
                    <div
                        id="action-button-container"
                        style={{ justifyContent: "flex-start" }}
                    >
                        <a
                            href="https://github.com/Clemeit/ddo-audit"
                            rel="noreferrer"
                            target="_blank"
                            className="primary-button should-invert full-width-mobile"
                        >
                            Visit our GitHub
                        </a>
                        <Link
                            to="/suggestions"
                            className="secondary-button should-invert full-width-mobile"
                            style={{
                                color: "var(--text)",
                                textDecoration: "none",
                            }}
                        >
                            Make a suggestion
                        </Link>
                    </div>
                </div>
                <div className="content-cluster">
                    <h2 style={{ color: "var(--text)" }}>
                        Contact Information
                    </h2>
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
                        Listed in order of preference.
                    </p>
                    <ul
                        style={{
                            fontSize: "1.5rem",
                            lineHeight: "normal",
                            color: "var(--text)",
                        }}
                    >
                        <li>
                            <a
                                href="https://discord.com/users/313127244362940416"
                                rel="noreferrer"
                                target="_blank"
                            >
                                Discord: Clemeit#7994
                            </a>
                        </li>
                        <li>
                            <a
                                href="https://www.reddit.com/user/Clemeit"
                                rel="noreferrer"
                                target="_blank"
                            >
                                Reddit: Clemeit
                            </a>
                        </li>
                        <li>
                            <a
                                href="https://www.ddo.com/forums/member.php/384353-Clemeit"
                                rel="noreferrer"
                                target="_blank"
                            >
                                DDO Forums: Clemeit
                            </a>
                        </li>
                        <li>
                            <a
                                href="https://twitter.com/DDOAudit"
                                rel="noreferrer"
                                target="_blank"
                            >
                                Twitter: @DDOAudit
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default About;
