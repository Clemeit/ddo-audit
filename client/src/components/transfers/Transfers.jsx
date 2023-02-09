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
import TransfersTable from "./TransfersTable";

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

  const [uniqueData, setUniqueData] = React.useState(null);
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
      Submit("Feature: Server Transfers (v3)", response);
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

  function readAbout() {
    Log("Transfers page", "Read about active characters");
    setPopupMessage({
      title: "Active Characters",
      message: (
        <span>
          We consider a character "active" when they meet ALL of the following
          criteria:
          <ul>
            <li>
              A character has moved areas (public or private) within 2 days of
              last being online, AND
            </li>
            <li>
              A character has run a quest (solo or in a group) within 7 days of
              last being online, AND
            </li>
            <li>
              A character has increased in level within 20 days of last being
              online (max-level characters are excluded)
            </li>
          </ul>
          <p>Transfering servers does not directly affect any of these.</p>
          <p className="lfm-number">
            This is an art, not a science. If you have suggestions for improving
            this algorithm, <Link to="/suggestions">please let me know</Link>.
          </p>
        </span>
      ),
      icon: "info",
      fullscreen: true,
    });
  }

  const [zeroedOnFeb8, setZeroedOnFeb8] = React.useState(true);
  const truncateDataRange = true;
  const [performDerivation, setPerformDerivation] = React.useState(true);
  const [transferCounts, setTransferCounts] = React.useState(null);
  const [transfersTo, setTransfersTo] = React.useState(null);
  const [transfersFrom, setTransfersFrom] = React.useState(null);

  const [tableAllTo, setTableAllTo] = React.useState(null);
  const [tableActiveTo, setTableActiveTo] = React.useState(null);
  const [tableAllFrom, setTableAllFrom] = React.useState(null);
  const [tableActiveFrom, setTableActiveFrom] = React.useState(null);

  React.useEffect(() => {
    let fetchDelay = setTimeout(() => {
      Fetch("https://api.ddoaudit.com/population/uniquedata", 5000)
        .then((val) => {
          setUniqueData(val);
        })
        .catch((err) => {
          dataFailedToLoad();
        });

      Fetch(`https://api.ddoaudit.com/population/transfersto_ignorehcl`, 5000)
        .then((val) => {
          let tableData = [];

          val.forEach((server) => {
            let feb8Count = -1;
            let finalCount = -1;
            server.data.forEach((dataPoint) => {
              if (dataPoint.x === "2023-02-08T15:00:00.000Z") {
                feb8Count = dataPoint.y;
              }
              finalCount = dataPoint.y;
            });
            tableData.push({
              server: server.id,
              delta: finalCount - feb8Count,
            });
          });

          setTableAllTo(tableData);
        })
        .catch((err) => {
          dataFailedToLoad();
        });

      Fetch(
        `https://api.ddoaudit.com/population/transfersto_active_ignorehcl`,
        5000
      )
        .then((val) => {
          let tableData = [];

          val.forEach((server) => {
            let feb8Count = -1;
            let finalCount = -1;
            server.data.forEach((dataPoint) => {
              if (dataPoint.x === "2023-02-08T15:00:00.000Z") {
                feb8Count = dataPoint.y;
              }
              finalCount = dataPoint.y;
            });
            tableData.push({
              server: server.id,
              delta: finalCount - feb8Count,
            });
          });

          setTableActiveTo(tableData);
        })
        .catch((err) => {
          dataFailedToLoad();
        });

      Fetch(`https://api.ddoaudit.com/population/transfersfrom_ignorehcl`, 5000)
        .then((val) => {
          let tableData = [];

          val.forEach((server) => {
            let feb8Count = -1;
            let finalCount = -1;
            server.data.forEach((dataPoint) => {
              if (dataPoint.x === "2023-02-08T15:00:00.000Z") {
                feb8Count = dataPoint.y;
              }
              finalCount = dataPoint.y;
            });
            tableData.push({
              server: server.id,
              delta: finalCount - feb8Count,
            });
          });

          setTableAllFrom(tableData);
        })
        .catch((err) => {
          dataFailedToLoad();
        });

      Fetch(
        `https://api.ddoaudit.com/population/transfersfrom_active_ignorehcl`,
        5000
      )
        .then((val) => {
          let tableData = [];

          val.forEach((server) => {
            let feb8Count = -1;
            let finalCount = -1;
            server.data.forEach((dataPoint) => {
              if (dataPoint.x === "2023-02-08T15:00:00.000Z") {
                feb8Count = dataPoint.y;
              }
              finalCount = dataPoint.y;
            });
            tableData.push({
              server: server.id,
              delta: finalCount - feb8Count,
            });
          });

          setTableActiveFrom(tableData);
        })
        .catch((err) => {
          dataFailedToLoad();
        });
    }, 1000);

    return () => clearTimeout(fetchDelay);
  }, []);

  React.useEffect(() => {
    Fetch(
      `https://api.ddoaudit.com/population/transfercounts${
        activeAndIgnoreHCLCounts ? "_active" : ""
      }${ignoreHCLCounts ? "_ignorehcl" : ""}`,
      5000
    )
      .then((val) => {
        if (truncateDataRange) {
          val.forEach((server) => {
            let firstGoodIndex = 0;
            server.data.forEach((dataPoint, i) => {
              if (dataPoint.x === "2023-02-07T00:00:00.000Z")
                firstGoodIndex = i;
            });
            server.data = server.data.slice(firstGoodIndex);
          });
        }
        if (performDerivation) {
          // first derivative
          val.forEach((server) => {
            let lastTime = server.data[0].x;
            let lastValue = server.data[0].y;
            server.data.forEach((dataPoint) => {
              const diff = dataPoint.y - lastValue;
              const timeDiff = Math.max(
                (new Date(dataPoint.x).getTime() -
                  new Date(lastTime).getTime()) /
                  (1000 * 60 * 60),
                1
              );
              lastValue = dataPoint.y;
              lastTime = dataPoint.x;
              dataPoint.y = Math.round(Math.abs(diff, 0) / timeDiff);
            });
          });
        } else {
          if (zeroedOnFeb8) {
            val.forEach((server) => {
              let feb8Count = -1;
              server.data.forEach((dataPoint) => {
                if (dataPoint.x === "2023-02-08T15:00:00.000Z") {
                  feb8Count = dataPoint.y;
                }
                if (feb8Count === -1) {
                  dataPoint.y = 0;
                } else {
                  dataPoint.y = Math.max(dataPoint.y - feb8Count, 0);
                }
              });
            });
          }
        }

        setTransferCounts(val.reverse());
      })
      .catch((err) => {
        dataFailedToLoad();
      });
  }, [
    ignoreHCLCounts,
    activeAndIgnoreHCLCounts,
    performDerivation,
    zeroedOnFeb8,
  ]);

  React.useEffect(() => {
    Fetch(
      `https://api.ddoaudit.com/population/transfersto${
        activeAndIgnoreHCLTo ? "_active" : ""
      }${ignoreHCLTo ? "_ignorehcl" : ""}`,
      5000
    )
      .then((val) => {
        if (truncateDataRange) {
          val.forEach((server) => {
            let firstGoodIndex = 0;
            server.data.forEach((dataPoint, i) => {
              if (dataPoint.x === "2023-02-07T00:00:00.000Z")
                firstGoodIndex = i;
            });
            server.data = server.data.slice(firstGoodIndex);
          });
        }
        if (performDerivation) {
          // first derivative
          val.forEach((server) => {
            let lastTime = server.data[0].x;
            let lastValue = server.data[0].y;
            server.data.forEach((dataPoint) => {
              const diff = dataPoint.y - lastValue;
              const timeDiff = Math.max(
                (new Date(dataPoint.x).getTime() -
                  new Date(lastTime).getTime()) /
                  (1000 * 60 * 60),
                1
              );
              lastValue = dataPoint.y;
              lastTime = dataPoint.x;
              dataPoint.y = Math.round(Math.abs(diff, 0) / timeDiff);
            });
          });
        } else {
          if (zeroedOnFeb8) {
            val.forEach((server) => {
              let feb8Count = -1;
              server.data.forEach((dataPoint) => {
                if (dataPoint.x === "2023-02-08T15:00:00.000Z") {
                  feb8Count = dataPoint.y;
                }
                if (feb8Count === -1) {
                  dataPoint.y = 0;
                } else {
                  dataPoint.y = Math.max(dataPoint.y - feb8Count, 0);
                }
              });
            });
          }
        }

        setTransfersTo(val.filter((set) => set.id !== "Hardcore").reverse());
      })
      .catch((err) => {
        dataFailedToLoad();
      });
  }, [ignoreHCLTo, activeAndIgnoreHCLTo, performDerivation, zeroedOnFeb8]);

  React.useEffect(() => {
    Fetch(
      `https://api.ddoaudit.com/population/transfersfrom${
        activeAndIgnoreHCLFrom ? "_active_ignorehcl" : ""
      }`,
      5000
    )
      .then((val) => {
        if (truncateDataRange) {
          val.forEach((server) => {
            let firstGoodIndex = 0;
            server.data.forEach((dataPoint, i) => {
              if (dataPoint.x === "2023-02-07T00:00:00.000Z")
                firstGoodIndex = i;
            });
            server.data = server.data.slice(firstGoodIndex);
          });
        }
        if (performDerivation) {
          // first derivative
          val.forEach((server) => {
            let lastTime = server.data[0].x;
            let lastValue = server.data[0].y;
            server.data.forEach((dataPoint) => {
              const diff = dataPoint.y - lastValue;
              const timeDiff = Math.max(
                (new Date(dataPoint.x).getTime() -
                  new Date(lastTime).getTime()) /
                  (1000 * 60 * 60),
                1
              );
              lastValue = dataPoint.y;
              lastTime = dataPoint.x;
              dataPoint.y = Math.round(Math.abs(diff, 0) / timeDiff);
            });
          });
        } else {
          if (zeroedOnFeb8) {
            val.forEach((server) => {
              let feb8Count = -1;
              server.data.forEach((dataPoint) => {
                if (dataPoint.x === "2023-02-08T15:00:00.000Z") {
                  feb8Count = dataPoint.y;
                }
                if (feb8Count === -1) {
                  dataPoint.y = 0;
                } else {
                  dataPoint.y = Math.max(dataPoint.y - feb8Count, 0);
                }
              });
            });
          }
        }

        setTransfersFrom(val.filter((set) => set.id !== "Hardcore").reverse());
      })
      .catch((err) => {
        dataFailedToLoad();
      });
  }, [activeAndIgnoreHCLFrom, performDerivation, zeroedOnFeb8]);

  React.useEffect(() => {
    const logView = setTimeout(
      () => Log("Transfers page", "Page viewed (v3)"),
      1000
    );
    return () => clearTimeout(logView);
  }, []);

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
          title="Important Changes"
          description={
            <>
              <p>
                The original reports were rather confusing and led to a lot of
                misinformation being circulated.{" "}
                <span className="lfm-number">
                  I've changed how the data is presented to be more in line with
                  what players expected.
                </span>
              </p>
              <p>
                For anyone curious, the reports now display the instantaneous
                rate of change - or first derivative - of the underlying data.
                You can swap between the two methods with the toggle button
                below.
              </p>
              <ToggleButton
                className="wide"
                textA="New Reports (Instantaneous)"
                textB="Old Reports (Cumulative)"
                isA={performDerivation}
                isB={!performDerivation}
                doA={() => {
                  setPerformDerivation(true);
                }}
                doB={() => {
                  setPerformDerivation(false);
                }}
              />
              {!performDerivation && (
                <label style={{ marginTop: "10px" }}>
                  <input
                    className="input-radio"
                    name="showeligiblecharacters"
                    type="checkbox"
                    checked={zeroedOnFeb8}
                    onChange={() => {
                      setZeroedOnFeb8((lastVal) => !lastVal);
                    }}
                  />
                  Zeroed at the start of the free transfer period
                </label>
              )}
            </>
          }
          smallBottomMargin={true}
        />
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
                  This is a new feature, and it deals with a new set of data.{" "}
                  <span className="lfm-number">
                    There may be inconsistencies.
                  </span>
                </li>
                <li>
                  Information about{" "}
                  <span className="faux-link" onClick={() => readAbout()}>
                    "active characters"
                  </span>
                  .
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
          title="Summary Table"
          description={
            <span>
              Total transfer counts and transfer counts as a percentage of total
              server population. Hardcore League is ignored completely. Some
              information is unavailable or statistically insignificant.
            </span>
          }
        >
          {uniqueData &&
          tableAllTo &&
          tableActiveTo &&
          tableAllFrom &&
          tableActiveFrom ? (
            <TransfersTable
              uniqueData={uniqueData}
              transfersToData={tableAllTo}
              transfersActiveToData={tableActiveTo}
              transfersFromData={tableAllFrom}
              transfersActiveFromData={tableActiveFrom}
            />
          ) : (
            <p style={{ width: "100%", textAlign: "center" }}>Loading...</p>
          )}
        </ContentCluster>
        <ContentCluster
          title="Total Counts"
          description={
            <>
              {performDerivation ? (
                <p>
                  An approximation of the number of{" "}
                  <span className="lfm-number">
                    character transfers per hour
                  </span>
                  .
                </p>
              ) : (
                <p>
                  The total number of transfer characters online on any given
                  day.{" "}
                  <span className="lfm-number">
                    This is a cumulative count.
                  </span>
                </p>
              )}
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
            curve="linear"
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
              {performDerivation ? (
                <p>
                  An approximation of the number of{" "}
                  <span className="lfm-number">
                    character transfers per hour
                  </span>{" "}
                  <i>to</i> each server. Servers with a high transfer count are
                  gaining players from other servers.
                </p>
              ) : (
                <p>
                  The cumulative number of characters transferred <i>to</i> each
                  server. Servers with a high transfer count have gained players
                  from other servers.{" "}
                  <span className="lfm-number">
                    This is a cumulative count.
                  </span>
                </p>
              )}
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
            curve="linear"
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
              {performDerivation ? (
                <p>
                  An approximation of the number of{" "}
                  <span className="lfm-number">
                    character transfers per hour
                  </span>{" "}
                  <i>from</i> each server. Servers with a high transfer count
                  are losing players to other servers.
                </p>
              ) : (
                <p>
                  The cumulative number of characters transferred <i>from</i>{" "}
                  each server. Servers with a high transfer count have lost
                  players to other servers.{" "}
                  <span className="lfm-number">
                    This is a cumulative count.
                  </span>
                </p>
              )}
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
            curve="linear"
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
