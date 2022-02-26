import React from "react";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import { ReactComponent as ApiSVG } from "../../assets/global/api.svg";
import { ReactComponent as TimelineSVG } from "../../assets/global/timeline.svg";
import Banner from "../global/Banner";
import ContentCluster from "../global/ContentCluster";
import { Log } from "../../services/CommunicationService";

const About = (props) => {
    const TITLE = "About DDO Audit";

    return (
        <div>
            <Helmet>
                <title>{TITLE}</title>
                <meta
                    name="description"
                    content="Learn about the DDO Audit project! Read our mission statement, methodology, and contributing parties."
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
                <ContentCluster title="Our Mission">
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
                </ContentCluster>
                <ContentCluster title="Our Methodology">
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
                        but their names are replaced with "Anonymous" and their
                        guilds and locations are redacted).
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
                </ContentCluster>
                <ContentCluster title="Contributions">
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
                        className="action-button-container"
                        style={{ justifyContent: "flex-start" }}
                    >
                        <a
                            href="https://github.com/Clemeit/ddo-audit"
                            rel="noreferrer"
                            target="_blank"
                            className="primary-button should-invert full-width-mobile"
                            onClick={() => {
                                Log("Clicked GitHub link", "About");
                            }}
                        >
                            Visit my GitHub
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
                </ContentCluster>
                <ContentCluster
                    title="Contact Information"
                    description="Listed in order of preference."
                >
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
                </ContentCluster>
                <ContentCluster title="More Information">
                    <div className="content-cluster-options">
                        <Link
                            to="/api"
                            className="nav-box"
                            style={{
                                height: "auto",
                                minHeight: "150px",
                            }}
                        >
                            <div className="nav-box-title">
                                <ApiSVG className="nav-icon-large should-invert" />
                                <h2 className="content-option-title">API</h2>
                            </div>
                            <p className="content-option-description">
                                Look behind the curtain. Get the data for your
                                own projects.
                            </p>
                        </Link>
                        <Link
                            to="/timeline"
                            className="nav-box"
                            style={{
                                height: "auto",
                                minHeight: "150px",
                            }}
                        >
                            <div className="nav-box-title">
                                <TimelineSVG className="nav-icon-large should-invert" />
                                <h2 className="content-option-title">
                                    Timeline
                                </h2>
                            </div>
                            <p className="content-option-description">
                                This project's development log.
                            </p>
                        </Link>
                    </div>
                </ContentCluster>
                <ContentCluster title="Disclaimer">
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
                </ContentCluster>
            </div>
        </div>
    );
};

export default About;
