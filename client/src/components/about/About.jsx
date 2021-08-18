import React from "react";
import { Helmet } from "react-helmet";
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
                title="About DDO Audit"
                subtitle="Real-time Player Concurrency Data and LFM Viewer"
            />
            <div id="content-container">
                <div className="top-content-padding" />
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
                            Our goal is, and has always been, to provide
                            transparent and unbiased information.
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
                        Player data is collected from the game client every 30
                        seconds. This data contains no personally-identifying
                        information; the information that this data contains is
                        visible in the in-game "Who" panel (name, gender, race,
                        classes, location, guild, etc.).{" "}
                        <span style={{ color: "var(--text-lfm-number)" }}>
                            We do not collect, store, or publish personal
                            information.
                        </span>{" "}
                        We do, however, collect information on anonymous players
                        to be used in our population reports. Anonymous players
                        are not counted in any demographic reports and will
                        never show up in our Who panel (our API includes
                        anonymous players, but their names are replaced with
                        "Anonymous").
                    </p>
                    <p
                        style={{
                            fontSize: "1.5rem",
                            lineHeight: "normal",
                            color: "var(--text)",
                        }}
                    >
                        Player data is used to reconstruct groups of players,
                        which in turn is then used to power the LFM panel. All
                        of this data is then uploaded to a database for
                        processing. Server-side tools look through the player
                        data and generate the various population and demographic
                        reports. Player data is also used to determine average
                        quest durations. Group data is served from the database
                        directly to this website and is used to draw the LFM
                        panel on the Grouping page. That's not a screenshot -
                        it's being drawn right in your browser!
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
                        A special thank you goes to the incredibly talented and
                        generous developers over at Vault of Kundarak. Their
                        support played an integral role in the development of
                        this project's Live LFM and Who panels. Visit their
                        various projects:{" "}
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
                        And thank <u>you</u> for your continued support. This
                        project simply would not exist without DDO's incredible
                        community. Many of the features of this website were a
                        direct result of player feedback, and your continued use
                        inspires me to grow and develop this website far beyond
                        what I could have ever imagined. I'm always looking for
                        feedback and suggestions!
                    </p>
                    <div
                        className="secondary-button full-width-mobile"
                        onClick={() => {}}
                    >
                        Make a suggestion
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
