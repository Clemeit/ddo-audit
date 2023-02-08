import React from "react";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import { Log } from "../../services/CommunicationService";
import Banner from "../global/Banner";
import { ReactComponent as ThumbsDownSVG } from "../../assets/global/thumbs_down.svg";
import { ReactComponent as ThumbsUpSVG } from "../../assets/global/thumbs_up.svg";
import { ReactComponent as CloseSVG } from "../../assets/global/close.svg";
import BannerMessage from "../global/BannerMessage";
import ContentCluster from "../global/ContentCluster";
import NoMobileOptimization from "../global/NoMobileOptimization";
import { Submit } from "../../services/CommunicationService";
import TimerList from "./TimerList";

const Timers = (props) => {
  const TITLE = "Raid Timers";
  const [disclaimerVisible, setDisclaimerVisible] = React.useState(false);
  const [mayVote, setMayVote] = React.useState(false);
  const [hasVoted, setHasVoted] = React.useState(false);
  const [voteResponse, setVoteResponse] = React.useState(null);

  React.useEffect(() => {
    if (localStorage.getItem("hide-raid-timer-disclaimer")) {
      setDisclaimerVisible(false);
    } else {
      setDisclaimerVisible(true);
    }

    let ls = localStorage.getItem("feature-vote-raid-timers");
    let registeredCharacters = JSON.parse(
      localStorage.getItem("registered-characters") || "[]"
    );
    if (registeredCharacters.length > 0 && ls == null) {
      setMayVote(true);
    }
  }, []);

  function vote(response) {
    if (response != null) {
      Submit("Feature: Raid Timers", response);
      if (response === "Like") {
        setVoteResponse("positive");
      } else {
        setVoteResponse("negative");
      }
    } else {
      setVoteResponse("close");
      setMayVote(false);
    }
    setHasVoted(true);
    localStorage.setItem("feature-vote-raid-timers", new Date());
  }

  function dismissDisclaimer() {
    setDisclaimerVisible(false);
    localStorage.setItem("hide-raid-timer-disclaimer", true);
  }

  return (
    <div>
      <Helmet>
        <title>{TITLE}</title>
        <meta
          name="description"
          content="Check raid timers for all of your characters before you log in!"
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
        <BannerMessage page="timers" />
        <div className="top-content-padding shrink-on-mobile" />
        <NoMobileOptimization />
        <ContentCluster
          title="Raid Timers"
          description="View your characters' current raid timers based on questing activity."
        >
          <TimerList />
          <div style={{ display: "flex" }}>
            <Link className="primary-button should-invert" to="/registration">
              Manage characters
            </Link>
          </div>
          {mayVote && (
            <div
              className="feature-vote-container"
              style={{ opacity: hasVoted ? 1 : "" }}
            >
              {hasVoted ? (
                <>
                  <span style={{ cursor: "default" }}>
                    {voteResponse === "positive" ? (
                      "That's great to hear! Thanks."
                    ) : (
                      <>
                        Have a moment to{" "}
                        <Link to="/suggestions">suggest an improvement</Link>?
                      </>
                    )}
                  </span>
                </>
              ) : (
                <>
                  <span style={{ cursor: "default" }}>
                    Is this feature useful?
                  </span>
                  <ThumbsUpSVG
                    className="nav-icon should-invert"
                    style={{ cursor: "pointer" }}
                    onClick={() => vote("Like")}
                  />
                  <ThumbsDownSVG
                    className="nav-icon should-invert"
                    style={{ cursor: "pointer" }}
                    onClick={() => vote("Dislike")}
                  />
                  <CloseSVG
                    className="nav-icon should-invert"
                    style={{ cursor: "pointer" }}
                    onClick={() => vote(null)}
                  />
                </>
              )}
            </div>
          )}
        </ContentCluster>
        {disclaimerVisible && (
          <ContentCluster
            title="Please Note"
            noLink={true}
            description={
              <span>
                <p>
                  The raid timers displayed here are estimates and come with the
                  following caveats:
                </p>
                <ul>
                  <li>
                    The timer begins the moment your character leaves a raid,
                    whether or not the raid was completed.
                  </li>
                  <li>
                    The timer starts even if you forget to claim your reward
                    from the quest giver.
                  </li>
                  <li>
                    There is no way to account for the use of Raid Timer Bypass
                    Hourglasses.
                  </li>
                  <li>
                    There is no distinction between legendary and heroic
                    versions of a raid.
                  </li>
                  <li>
                    Some raids may not be tracked. If you find one,{" "}
                    <Link to="/suggestions">let me know</Link>.
                  </li>
                </ul>
              </span>
            }
            noFade={true}
          >
            <div
              className="secondary-button should-invert"
              onClick={() => {
                dismissDisclaimer();
                Log("Dismissed disclaimer", "Raid timers");
              }}
            >
              Dismiss
            </div>
          </ContentCluster>
        )}
      </div>
    </div>
  );
};

export default Timers;
