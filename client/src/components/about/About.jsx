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
        hideVote={true}
        title="About DDO Audit"
        subtitle="Real-time Player Concurrency Data and LFM Viewer"
      />
      <div className="content-container">
        <div className="top-content-padding shrink-on-mobile" />
        <ContentCluster title="Our Mission">
          <p>
            We want to provide the community with the most accurate and
            up-to-date information on DDO's population as possible, foster
            player interactions by hosting a Live LFM panel and Live 'Who' list,
            and keep players informed of server status, time zone trends,
            character demographics, and more! We're not here to push an agenda
            or to point fingers.{" "}
            <span style={{ color: "var(--text-lfm-number)" }}>
              Our goal is, and has always been, to provide useful, transparent,
              and unbiased information.
            </span>
          </p>
        </ContentCluster>
        <ContentCluster title="Methodology">
          <p>
            Data is collected from the game client every 10 seconds. This data
            contains no personal information; the information that this data
            contains is visible in the in-game "Who" panel (name, gender, race,
            etc.).{" "}
            <span style={{ color: "var(--text-lfm-number)" }}>
              We do not collect, store, or publish personal information.
            </span>{" "}
            We do, however, collect information on anonymous characters.
            Anonymous characters <u>are</u> counted in the population reports.
            Anonymous characters <u>are not</u> counted in any demographic
            reports and will never show up in our Who panel (our API includes
            anonymous characters, but their names are replaced with "Anonymous"
            and their guilds and locations are redacted).
          </p>
          <p>
            The character data that we collect includes name, gender, race,
            class, level, location, and guild name. This information is used to
            generate the various demographic reports on the website.
            Additionally, character location data is recorded, analyzed, and
            used to track quest popularity and raid timers.
          </p>
          <p>
            When a character posts a public LFM, the collected data also
            includes public comment, quest selection, difficulty selection,
            level range, accepted classes, and the "adventure active" length.
            Each character in a group is also assigned a Group ID which allows
            us to reconstruct groups of characters. The group data is then used
            to generate the LFM panel (that's not a screenshot - it's being
            drawn in your browser).
          </p>
        </ContentCluster>
        <ContentCluster title="Contributions">
          <p>
            A special thanks to the incredibly talented and generous developers
            over at Vault of Kundarak. Their support played an integral role in
            the development of this project's Live LFM and Who panels. Visit
            their various projects:{" "}
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
          <p>
            And thank <i>you</i> for your continued support.{" "}
            <span style={{ color: "var(--text-lfm-number)" }}>
              This project simply would not exist without DDO's incredible
              community.
            </span>{" "}
            Many of the features on this website were a direct result of player
            feedback on the DDO Discord, Forums, and Reddit, and your continued
            use inspires me to grow and develop the DDO Audit project far beyond
            what I could have ever imagined. I'm always looking for feedback and
            suggestions!
          </p>
          <div
            className="action-button-container"
            style={{ justifyContent: "flex-start" }}
          >
            <Link
              to="/suggestions"
              className="primary-button should-invert full-width-mobile"
              style={{
                color: "var(--text)",
                textDecoration: "none",
              }}
            >
              Make a suggestion
            </Link>
            <a
              href="https://github.com/Clemeit/ddo-audit"
              rel="noreferrer"
              target="_blank"
              className="secondary-button should-invert full-width-mobile"
              onClick={() => {
                Log("Clicked GitHub link", "About");
              }}
            >
              Visit my GitHub
            </a>
          </div>
        </ContentCluster>
        <ContentCluster title="Development">
          <p>
            This website is the culmination of over two years of hard work and
            many sleepless nights. When I started DDO Audit I knew little to
            nothing about web development, server infrastructure, or databases.
            I learned as I went, browsing countless forum posts, watching
            YouTube tutorial videos, reading books, and iterating on my designs.
          </p>
          <p>
            The original website was written in HTML, JavaScript, and CSS using
            the famous IDE known as Notepad (no joke - I have like 20,000 lines
            of frontend work done using Notepad). The data aggregation and
            interpretation work was painfully done using C (I'm never using that
            terrible language again), and the data collection portion was
            written in Visual Basic (using Visual Studio). The current version
            of the website is a little less haphazardly thrown together. It's
            written using JSX and the React framework in an <i>actual</i> IDE -
            Visual Studio Code. All of the server infrastructure work is done
            using NodeJS. Data aggregation and interpretation work is now done
            using JavaScript, and the data collection side was recreated using
            C#.
          </p>
          <p>
            It honestly has been a lot of fun to work on, and I'm sure I'll
            continue development well into the future. Thanks for stopping by!
          </p>
          <p>
            See you in game,
            <br />
            <i>Clemeit of Thelanis</i>
          </p>
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
        <ContentCluster title="Privacy" hidden={true}>
          <p>
            I wish websites were more open about the data they collect on users.
            Here's a list of privacy-related topics that pertain to this website
            specifically. Feel free to send me a message if you'd like more
            information.
          </p>
          <h3
            style={{
              marginTop: "30px",
            }}
          >
            Google Analytics
          </h3>
          <p>
            This website uses Google Analytics to monitor user traffic,
            engagement, page popularity, and more. This data is used to
            determine which pages are performing adequately, which pages are
            ranking well in Google search results, and which pages may need more
            work. I have no access to the personal information of any of the
            website's users. I do not run advertisements on the website or
            profit from the information in any way. If you would prefer to not
            be tracked by Google Analytics (on this website or on the millions
            of others that use it), I encourage you to install an ad blocker
            extension for your browser.
          </p>
          <h3
            style={{
              marginTop: "30px",
            }}
          >
            Google Firebase
          </h3>
          <p>
            This website uses Google Firebase to send push notifications to
            users who set up LFM notifications. This feature is still in
            development but will be released on an opt-in only basis.
          </p>
          <h3
            style={{
              marginTop: "30px",
            }}
          >
            Cookies
          </h3>
          <p>
            This website uses local storage cookies to enhance the user
            experience. Clearing your browser's cookies will delete the
            following preferences:
          </p>
          <ul
            style={{
              fontSize: "1.5rem",
              lineHeight: "normal",
              color: "var(--text)",
            }}
          >
            <li>LFM filters, accessibility options, and ad-ons</li>
            <li>Your registered characters</li>
            <li>Feature votes (like/dislike)</li>
            <li>Page message dismissals</li>
            <li>Disclaimer acknowledgements</li>
          </ul>
          <p></p>
          <h3
            style={{
              marginTop: "30px",
            }}
          >
            Logging
          </h3>
          <p>
            This website collects data on certain user actions to improve
            features that are underperforming, uninteresting, or unknown, and to
            improve website accessibility. Logging is anonymous except when you
            opt to send me contact information. Examples of events that may be
            logged include:
          </p>
          <ul
            style={{
              fontSize: "1.5rem",
              lineHeight: "normal",
              color: "var(--text)",
            }}
          >
            <li>Submitting a request/suggestion</li>
            <li>Reporting an error</li>
            <li>Errors encountered while fetching character data</li>
            <li>Errors encountered while fetching LFM data</li>
            <li>Clicking on certain buttons or using certain features</li>
          </ul>
        </ContentCluster>
        <ContentCluster title="Disclaimer">
          <p>
            All screenshots were taken from{" "}
            <a href="https://www.ddo.com" rel="noreferrer" target="_blank">
              Dungeons and Dragons Online
            </a>
            . This website is in no way affiliated with, or endorsed by,
            Standing Stone Games or{" "}
            <a
              href="https://www.daybreakgames.com/home"
              rel="noreferrer"
              target="_blank"
            >
              Daybreak Game Company
            </a>
            . Dungeons and Dragons Online is a registered trademark of Wizards
            of the Coast LLC. You can support this project by supporting
            Dungeons and Dragons Online.
          </p>
        </ContentCluster>
        <ContentCluster title="More Information">
          <div className="content-cluster-options">
            <Link
              to="/api"
              className="nav-box shrinkable"
              style={{
                height: "auto",
                minHeight: "150px",
              }}
            >
              <div className="nav-box-title">
                <ApiSVG className="nav-icon should-invert" />
                <h2 className="content-option-title">API</h2>
              </div>
              <p className="content-option-description">
                Look behind the curtain. Get the data for your own projects.
              </p>
            </Link>
            <Link
              to="/timeline"
              className="nav-box shrinkable"
              style={{
                height: "auto",
                minHeight: "150px",
              }}
            >
              <div className="nav-box-title">
                <TimelineSVG className="nav-icon should-invert" />
                <h2 className="content-option-title">Timeline</h2>
              </div>
              <p className="content-option-description">
                This project's development log.
              </p>
            </Link>
          </div>
        </ContentCluster>
      </div>
    </div>
  );
};

export default About;
