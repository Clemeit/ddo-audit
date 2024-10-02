import React from "react";
import { Helmet } from "react-helmet";
import Banner from "./Banner";
import { ReactComponent as WarningSVG } from "../../assets/global/warning.svg";
import { ReactComponent as TimerSVG } from "../../assets/global/timer.svg";
import { ReactComponent as ThumbsDownSVG } from "../../assets/global/thumbs_down.svg";
import { ReactComponent as ThumbsUpSVG } from "../../assets/global/thumbs_up.svg";
import { ReactComponent as CloseSVG } from "../../assets/global/close.svg";
import BannerMessage from "./BannerMessage";
import ContentCluster from "./ContentCluster";
import RegistrationList from "./RegistrationList";
import { Link } from "react-router-dom";
import NoMobileOptimization from "./NoMobileOptimization";
import { Submit } from "../../services/CommunicationService";
import { Log } from "../../services/CommunicationService";
import { SERVER_LIST } from "../../constants/Servers";

const CharacterRegistration = () => {
  const TITLE = "DDO Audit Character Registration";
  const [disclaimerVisible, setDisclaimerVisible] = React.useState(false);
  const [mayVote, setMayVote] = React.useState(false);
  const [hasVoted, setHasVoted] = React.useState(false);
  const [voteResponse, setVoteResponse] = React.useState(null);

  // Add character
  const [server, setServer] = React.useState("Argonnessen");
  const [characterName, setCharacterName] = React.useState("");

  // Registered characters
  const [registeredCharacterIds, setRegisteredCharacterIds] = React.useState(
    []
  );

  const API_HOST = "https://api.hcnxsryjficudzazjxty.com";
  const API_VERSION = "v1";
  const API_URL = `${API_HOST}/${API_VERSION}`;
  const CHARACTER_ENDPOINT = `${API_URL}/characters`;

  async function addCharacter() {
    if (!characterName || !server) {
      return;
    }
    let validString = /^[a-zA-Z0-9\-]+$/;
    if (
      !validString.test(characterName) ||
      characterName.length === 0 ||
      characterName.length > 20
    ) {
      return;
    }
    let characterId = await getCharacterId(server, characterName);
    if (characterId) {
      if (!registeredCharacterIds.includes(characterId)) {
        setRegisteredCharacterIds([...registeredCharacterIds, characterId]);
      }
      setCharacterName("");
    }
  }

  function getCharacterId(serverName, characterName) {
    return new Promise((resolve, reject) => {
      if (!characterName || !serverName) {
        reject();
      }
      let validString = /^[a-zA-Z0-9\-]+$/;
      if (
        !validString.test(characterName) ||
        characterName.length === 0 ||
        characterName.length > 20
      ) {
        reject();
      }
      fetch(`${CHARACTER_ENDPOINT}/${serverName}/${characterName}`)
        .then((res) => res.json())
        .then((res) => {
          if (res.id) {
            resolve(res.id);
          } else if (res.error) {
            reject();
          }
        });
    });
  }

  React.useEffect(() => {
    if (localStorage.getItem("hide-character-registration-disclaimer")) {
      setDisclaimerVisible(false);
    } else {
      setDisclaimerVisible(true);
    }

    let ls = localStorage.getItem("feature-vote-character-registration");
    let registeredCharacters = JSON.parse(
      localStorage.getItem("registered-characters") || "[]"
    );
    if (registeredCharacters.length > 0 && ls == null) {
      setMayVote(true);
      setRegisteredCharacterIds(registeredCharacters);
    }
  }, []);

  function vote(response) {
    if (response != null) {
      Submit("Feature: Character Registration", response);
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
    localStorage.setItem("feature-vote-character-registration", new Date());
  }

  function dismissDisclaimer() {
    setDisclaimerVisible(false);
    localStorage.setItem("hide-character-registration-disclaimer", true);
  }

  return (
    <div>
      <Helmet>
        <title>{TITLE}</title>
        <meta
          name="description"
          content="Register a list of your characters for automatic LFM filtering and raid timer tracking."
        />
        <meta property="og:image" content="/icons/grouping-512px.png" />
        <meta property="og:site_name" content="DDO Audit" />
        <meta property="twitter:image" content="/icons/grouping-512px.png" />
      </Helmet>
      <Banner
        small={true}
        showTitle={true}
        showSubtitle={true}
        showButtons={false}
        hideOnMobile={true}
        hideVote={true}
        title="Characters"
        subtitle="Character Registration"
      />
      <div className="content-container">
        <BannerMessage page="registration" />
        <div className="top-content-padding shrink-on-mobile" />
        <NoMobileOptimization />
        <ContentCluster
          title="Characters"
          description="Register your characters and we'll automatically keep track of your raid timers and filter the LFM panel based on your characters' current levels."
        >
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              gap: "5px",
            }}
          >
            <select
              id="server-select-field"
              // disabled={isLoading}
              style={{ fontSize: "1.3rem" }}
              value={server}
              onChange={(e) => {
                setServer(e.target.value);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                }
              }}
            >
              {SERVER_LIST.map((server) => (
                <option value={server} key={server}>
                  {server}
                </option>
              ))}
            </select>
            <input
              id="name-input"
              // disabled={isLoading}
              style={{
                fontSize: "1.2rem",
                // color: "var(--text-faded)",
                // display: "flex",
                // flexDirection: "column",
              }}
              value={characterName}
              onChange={(e) => {
                setCharacterName(e.target.value);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  addCharacter();
                }
              }}
            />
            <div
              className="primary-button should-invert"
              style={{
                padding: "5px 10px",
              }}
              onClick={() => {
                addCharacter();
              }}
            >
              Add Character
            </div>
          </div>
          <br />
          <RegistrationList characterIds={registeredCharacterIds} />
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
                    Is this feature easy to use?
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
            title={
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  lineHeight: "30px",
                }}
              >
                <WarningSVG
                  style={{
                    width: "30px",
                    height: "30px",
                    marginRight: "10px",
                  }}
                />
                Please Note
              </div>
            }
            altTitle="Please Note"
            noLink={true}
            description={
              <span>
                <p>
                  Anonymous characters must turn off 'Anonymous' for at least 1
                  minute before being registered, but may return to being
                  anonymous afterwards. Characters marked as anonymous will not
                  show online/offline status and will have their guild name and
                  location redacted.
                </p>
                <p>
                  <span className="lfm-number">
                    We will never ask for your username, password, or personal
                    data.
                  </span>{" "}
                  Please do not share this type of information with us.
                </p>
              </span>
            }
            noFade={true}
          >
            <div
              className="secondary-button should-invert"
              onClick={() => {
                dismissDisclaimer();
                Log("Dismissed disclaimer", "Character registration");
              }}
            >
              Dismiss
            </div>
          </ContentCluster>
        )}
        <ContentCluster title="See Also...">
          <div className="content-cluster-options">
            <Link
              to="/timers"
              className="nav-box shrinkable"
              style={{
                height: "auto",
                minHeight: "150px",
              }}
            >
              <div className="nav-box-title">
                <TimerSVG className="nav-icon should-invert" />
                <h2 className="content-option-title">Raid Timers</h2>
              </div>
              <p className="content-option-description">
                View and manage your current raid timers.
              </p>
            </Link>
          </div>
        </ContentCluster>
      </div>
    </div>
  );
};

export default CharacterRegistration;
