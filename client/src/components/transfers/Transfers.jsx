import React from "react";
import { Helmet } from "react-helmet";
import PopupMessage from "../global/PopupMessage";
import Banner from "../global/Banner";
import BannerMessage from "../global/BannerMessage";
import ContentCluster from "../global/ContentCluster";
import { Log, Submit } from "../../services/CommunicationService";
import ChartLine from "../global/ChartLine";
import { Fetch } from "../../services/DataLoader";
import ToggleButton from "../global/ToggleButton";
import { Link } from "react-router-dom";
import { ReactComponent as ThumbsDownSVG } from "../../assets/global/thumbs_down.svg";
import { ReactComponent as ThumbsUpSVG } from "../../assets/global/thumbs_up.svg";
import { ReactComponent as CloseSVG } from "../../assets/global/close.svg";

const Transfers = () => {
  const TITLE = "Server Transfers";
  const DAY_ONLY = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };

  // Popup message
  var [popupMessage, setPopupMessage] = React.useState(null);

  const [voteMessage, setVoteMessage] = React.useState(null);
  const [mayVote, setMayVote] = React.useState(false);
  const [hasVoted, setHasVoted] = React.useState(false);
  React.useEffect(() => {
    let ls = localStorage.getItem("feature-vote-server-transfers");
    if (ls == null) {
      setMayVote(true);
    } else {
      setMayVote(false);
    }
  }, []);
  function vote(response) {
    if (response != null) {
      Submit("Feature: Server Transfers", response);
      if (response === "Like") {
        setVoteMessage("positive");
      } else {
        setVoteMessage("negative");
      }
    } else {
      setVoteMessage("close");
      setMayVote(false);
    }
    setHasVoted(true);
    localStorage.setItem("feature-vote-server-transfers", new Date());
  }

  const [ignoreHCLCounts, setIgnoreHCLCounts] = React.useState(true);
  const [ignoreHCLTo, setIgnoreHCLTo] = React.useState(true);

  const [activeAndIgnoreHCLCounts, setActiveAndIgnoreHCLCounts] =
    React.useState(false);
  const [activeAndIgnoreHCLTo, setActiveAndIgnoreHCLTo] = React.useState(false);
  const [activeAndIgnoreHCLFrom, setActiveAndIgnoreHCLFrom] =
    React.useState(false);

  function dataFailedToLoad() {
    setPopupMessage({
      title: "Some data failed to load",
      message:
        "Some of the reports on this page may have failed to load. Please refresh the page. If the issue continues, report it.",
      icon: "warning",
      fullscreen: false,
      reportMessage: "Failed to fetch data.",
    });
  }

  const [transferCounts, setTransferCounts] = React.useState(null);
  const [transfersTo, setTransfersTo] = React.useState(null);
  const [transfersFrom, setTransfersFrom] = React.useState(null);

  React.useEffect(() => {
    Fetch(
      `https://api.ddoaudit.com/population/transfercounts${
        activeAndIgnoreHCLCounts ? "_active" : ""
      }${ignoreHCLCounts ? "_ignorehcl" : ""}`,
      5000
    )
      .then((val) => {
        setTransferCounts(val.reverse());
      })
      .catch((err) => {
        dataFailedToLoad();
      });
  }, [ignoreHCLCounts, activeAndIgnoreHCLCounts]);

  React.useEffect(() => {
    Fetch(
      `https://api.ddoaudit.com/population/transfersto${
        activeAndIgnoreHCLTo ? "_active" : ""
      }${ignoreHCLTo ? "_ignorehcl" : ""}`,
      5000
    )
      .then((val) => {
        setTransfersTo(val.filter((set) => set.id !== "Hardcore").reverse());
      })
      .catch((err) => {
        dataFailedToLoad();
      });
  }, [ignoreHCLTo, activeAndIgnoreHCLTo]);

  React.useEffect(() => {
    const logView = setTimeout(
      () => Log("Transfers page", "Page viewed"),
      1000
    );

    Fetch(
      `https://api.ddoaudit.com/population/transfersfrom${
        activeAndIgnoreHCLFrom ? "_active_ignorehcl" : ""
      }`,
      5000
    )
      .then((val) => {
        setTransfersFrom(val.filter((set) => set.id !== "Hardcore").reverse());
      })
      .catch((err) => {
        dataFailedToLoad();
      });

    return () => clearTimeout(logView);
  }, [activeAndIgnoreHCLFrom]);

  const VoteContainer = () => (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
      }}
    >
      {mayVote &&
        (hasVoted ? (
          <div className="feature-vote-container">
            {voteMessage === "positive" ? (
              "Thanks!"
            ) : voteMessage === "negative" ? (
              <span>
                Your <Link to="/suggestions">suggestions</Link> are welcome!
              </span>
            ) : (
              ""
            )}
          </div>
        ) : (
          <div
            className="feature-vote-container"
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <span
              style={{
                cursor: "default",
              }}
            >
              New Feature
            </span>
            <ThumbsUpSVG
              className="nav-icon-small should-invert"
              style={{
                cursor: "pointer",
              }}
              onClick={() => vote("Like")}
            />
            <ThumbsDownSVG
              className="nav-icon-small should-invert"
              style={{
                cursor: "pointer",
              }}
              onClick={() => vote("Dislike")}
            />
            <CloseSVG
              className="nav-icon-small should-invert"
              style={{
                cursor: "pointer",
              }}
              onClick={() => vote(null)}
            />
          </div>
        ))}
    </div>
  );

  return (
    <div>
      <Helmet>
        <title>{TITLE}</title>
        <meta
          name="description"
          content="Explore character transfer trends. Discover where characters are moving, which servers are gaining, and which servers are losing."
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
        title="Server Transfers"
        subtitle="The Movement of Characters"
      />
      <PopupMessage
        page="transfers"
        message={popupMessage}
        popMessage={() => {
          setPopupMessage(null);
        }}
      />
      <div className="content-container">
        <BannerMessage page="transfers" />
        <div className="top-content-padding shrink-on-mobile" />
        <ContentCluster
          title="About Server Transfers"
          description={
            <span>
              <ul>
                <li>
                  Like most of the demographic reports on DDO Audit, the reports
                  shown here only count characters that have logged in within
                  the last 90 days.
                </li>
                <li>
                  A "transfer character" is defined as a character that is
                  currently playing on a different server than the one they were
                  created on.
                </li>
                <li>
                  A lot of character transfers result from the existence of the
                  Hardcore server. These transfers are filtered out by default,
                  but you can include them with the toggle buttons.
                </li>
                <li>
                  This is a new feature, and it deals with a new set of data.
                  There may be inconsistencies.
                </li>
              </ul>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  flexWrap: "wrap",
                  justifyContent: "space-between",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "7px",
                  }}
                >
                  <span>Thanks, Clemeit</span>
                  <Link to="/suggestions">Make a suggestion</Link>
                </div>
                <VoteContainer />
              </div>
            </span>
          }
          smallBottomMargin={true}
        />
        <ContentCluster
          title="Total Transfer Characters"
          description={
            <>
              <p>
                The total number of transfer characters online on any given day.{" "}
                <span className="lfm-number">
                  This is NOT the number of character transfers per day.
                </span>
              </p>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  flexWrap: "wrap",
                  gap: "10px",
                }}
              >
                <ToggleButton
                  className="wide"
                  textA="All Characters"
                  textB="Active Characters"
                  isA={!activeAndIgnoreHCLCounts}
                  isB={activeAndIgnoreHCLCounts}
                  doA={() => {
                    setActiveAndIgnoreHCLCounts(false);
                  }}
                  doB={() => {
                    setIgnoreHCLCounts(true);
                    setActiveAndIgnoreHCLCounts(true);
                  }}
                />
                <ToggleButton
                  className={`wide${
                    activeAndIgnoreHCLCounts ? " disabled" : ""
                  }`}
                  textA="Exclude HCL Transfers"
                  textB="Include HCL Transfers"
                  isA={ignoreHCLCounts}
                  isB={!ignoreHCLCounts}
                  doA={() => {
                    setIgnoreHCLCounts(true);
                  }}
                  doB={() => {
                    setIgnoreHCLCounts(false);
                    setActiveAndIgnoreHCLCounts(false);
                  }}
                />
              </div>
            </>
          }
        >
          <ChartLine
            keys={null}
            indexBy={null}
            legendBottom="Day"
            legendLeft="Total Transfer Characters"
            data={transferCounts}
            title="Transfer Characters"
            marginBottom={60}
            trendType="week"
            noArea={true}
            straightLegend={true}
            tooltipPrefix="Day"
            padLeft={true}
            yMin="auto"
            dateOptions={DAY_ONLY}
          />
        </ContentCluster>
        <ContentCluster
          title={`Transfers "To"`}
          description={
            <>
              <p>
                The total number of characters transferred <i>to</i> each
                server. Servers with a high transfer count are gaining players
                from other servers.
              </p>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  flexWrap: "wrap",
                  gap: "10px",
                }}
              >
                <ToggleButton
                  className="wide"
                  textA="All Characters"
                  textB="Active Characters"
                  isA={!activeAndIgnoreHCLTo}
                  isB={activeAndIgnoreHCLTo}
                  doA={() => {
                    setActiveAndIgnoreHCLTo(false);
                  }}
                  doB={() => {
                    setIgnoreHCLTo(true);
                    setActiveAndIgnoreHCLTo(true);
                  }}
                />
                <ToggleButton
                  className={`wide${activeAndIgnoreHCLTo ? " disabled" : ""}`}
                  textA="Exclude HCL Transfers"
                  textB="Include HCL Transfers"
                  isA={ignoreHCLTo}
                  isB={!ignoreHCLTo}
                  doA={() => {
                    setIgnoreHCLTo(true);
                  }}
                  doB={() => {
                    setIgnoreHCLTo(false);
                  }}
                />
              </div>
            </>
          }
        >
          <ChartLine
            keys={null}
            indexBy={null}
            legendBottom="Day"
            legendLeft="Total Transfer Characters"
            data={transfersTo}
            title="Transfer Characters To"
            marginBottom={60}
            trendType="week"
            noArea={true}
            straightLegend={true}
            tooltipPrefix="Day"
            padLeft={true}
            yMin="auto"
            dateOptions={DAY_ONLY}
          />
        </ContentCluster>
        <ContentCluster
          title={`Transfers "From"`}
          description={
            <>
              <p>
                The total number of characters transferred <i>from</i> each
                server. Servers with a high transfer count are losing players to
                other servers.
              </p>
              <ToggleButton
                className="wide"
                textA="All Characters"
                textB="Active Characters"
                isA={!activeAndIgnoreHCLFrom}
                isB={activeAndIgnoreHCLFrom}
                doA={() => {
                  setActiveAndIgnoreHCLFrom(false);
                }}
                doB={() => {
                  setActiveAndIgnoreHCLFrom(true);
                }}
              />
            </>
          }
        >
          <ChartLine
            keys={null}
            indexBy={null}
            legendBottom="Day"
            legendLeft="Total Transfer Characters"
            data={transfersFrom}
            title="Transfer Characters From"
            x
            marginBottom={60}
            trendType="week"
            noArea={true}
            straightLegend={true}
            tooltipPrefix="Day"
            padLeft={true}
            yMin="auto"
            dateOptions={DAY_ONLY}
          />
        </ContentCluster>
      </div>
    </div>
  );
};

export default Transfers;
