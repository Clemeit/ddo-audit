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
            <div className="content-container">
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
                        We want to provide the community with the most accurate
                        and up-to-date information on DDO's population as
                        possible, foster player interactions by hosting a Live
                        LFM panel and Live 'Who' list, and keep players informed
                        of server status, time zone trends, character
                        demographics, and more! We're not here to push an agenda
                        or to point fingers.{" "}
                        <span style={{ color: "var(--text-lfm-number)" }}>
                            Our goal is, and has always been, to provide useful,
                            transparent, and unbiased information.
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
                        Data is collected from the game client every 15 seconds.
                        This data contains no personally-identifying
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
                        Each player in a group is also assigned a Group ID which
                        allows us to reconstruct groups of players. The group
                        data is then used to generate the LFM panel (that's not
                        a screenshot - it's being drawn in your browser).
                    </p>
                    <p
                        style={{
                            fontSize: "1.5rem",
                            lineHeight: "normal",
                            color: "var(--text)",
                        }}
                    >
                        Group data is refreshed every 15 seconds. Player data is
                        refreshed every 30 seconds. Server status is refreshed
                        every 1 minute. Population data is refreshed every 5
                        minutes. Demographic reports are refresh on various
                        intervals depending on the report type and span.
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
                            Discord server
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
                        And thank <i>you</i> for your continued support.{" "}
                        <span style={{ color: "var(--text-lfm-number)" }}>
                            This project simply would not exist without DDO's
                            incredible community.
                        </span>{" "}
                        Many of the features on this website were a direct
                        result of player feedback on the DDO Discord, Forums,
                        and Reddit, and your continued use inspires me to grow
                        and develop the DDO Audit project far beyond what I
                        could have ever imagined. I'm always looking for
                        feedback and suggestions!
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
                <div className="content-cluster">
                    <h2 style={{ color: "var(--text)" }}>Disclaimer</h2>
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
                        All screenshots were taken from{" "}
                        <a
                            href="https://www.ddo.com"
                            rel="noreferrer"
                            target="_blank"
                        >
                            Dungeons and Dragons Online
                        </a>
                        . This website is in no way affiliated with, or endorsed
                        by, Standing Stone Games or{" "}
                        <a
                            href="https://www.daybreakgames.com/home"
                            rel="noreferrer"
                            target="_blank"
                        >
                            Daybreak Game Company
                        </a>
                        . Dungeons and Dragons Online is a registered trademark
                        of Wizards of the Coast LLC. This website generates no
                        revenue and is not used for commercial purposes. I do
                        not host ads nor accept donations. You can support this
                        project by supporting Dungeons and Dragons Online.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default About;
