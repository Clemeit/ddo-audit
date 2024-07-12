import React from "react";
import { Submit } from "../../services/CommunicationService";
import { Fetch, VerifyServerLfmData, Post } from "../../services/DataLoader";
import { ReactComponent as CloseSVG } from "../../assets/global/close.svg";
import ContentCluster from "../global/ContentCluster";
import CanvasLfmPanel from "./CanvasLfmPanel";
import LevelRangeSlider from "./LevelRangeSlider";
import FilterBar from "../global/FilterBar";
import Lfm from "./Lfm";
import { Log } from "../../services/CommunicationService";
import $ from "jquery";
import { Link } from "react-router-dom";
import FeatureFlagHook from "../../hooks/FeatureFlagHook";
import PageMessage from "../global/PageMessage";

const Panel = (props) => {
  const REFRESH_CHARACTER_LEVEL_INTERVAL = 60; //seconds
  const REFRESH_LFM_INTERVAL = 2; //seconds
  const MAX_LEVEL = 32;
  const API_HOST = "http://137.184.2.181";
  const API_VERSION = "v1";
  const API_URL = `${API_HOST}/${API_VERSION}`;
  const LFM_API = `${API_URL}/lfms`;

  const noReport = FeatureFlagHook("no-report", 1000 * 60 * 60);

  // Download canvas
  var download = function () {
    // Redraw panel without names
    var link = document.createElement("a");
    link.download = `ddo-lfm-panel.png`;
    link.href = document.getElementById("lfm-canvas").toDataURL();
    link.click();
  };

  const [theme, setTheme] = React.useState(true);
  const [reported, setReported] = React.useState(false);

  const [failedAttemptCount, setFailedAttemptCount] = React.useState(0);
  const failedAttemptRef = React.useRef(failedAttemptCount);
  failedAttemptRef.current = failedAttemptCount;

  const [serverStatus, setServerStatus] = React.useState(null);
  const serverStatusRef = React.useRef(serverStatus);
  serverStatusRef.current = serverStatus;

  const [ignoreServerStatus, setIgnoreServerStatus] = React.useState(false);
  const ignoreServerStatusRef = React.useRef(ignoreServerStatus);
  ignoreServerStatusRef.current = ignoreServerStatus;

  const [unfilteredServerData, setUnfilteredServerData] = React.useState(null);
  const [filteredServerData, setFilteredServerData] = React.useState(null);
  const [showNotEligible, setShowNotEligible] = React.useState(true);
  const [adjustedLfmCount, setAdjustedLfmCount] = React.useState(4);
  const [fontModifier, setFontModifier] = React.useState();
  const [highVisibility, setHighVisibility] = React.useState();
  const [alternativeLook, setAlternativeLook] = React.useState();
  const [minimumLevel, setMinimumLevel] = React.useState(1);
  const [maximumLevel, setMaximumLevel] = React.useState(MAX_LEVEL);
  const [sortAscending, setSortAscending] = React.useState();
  const [showEligibleCharacters, setShowEligibleCharacters] =
    React.useState(false);
  const [showGuildNames, setShowGuildNames] = React.useState(false);
  const [showCompletionPercentage, setShowCompletionPercentage] =
    React.useState(false);
  const [showMemberCount, setShowMemberCount] = React.useState(true);
  const [showQuestGuesses, setShowQuestGuesses] = React.useState(true);
  const [showQuestTips, setShowQuestTips] = React.useState(true);
  const sortAscendingRef = React.useRef(sortAscending);
  sortAscendingRef.current = sortAscending;
  const [showRaidTimerIndicator, setShowRaidTimerIndicator] =
    React.useState(false);
  const [filterBasedOnMyLevel, setFilterBasedOnMyLevel] = React.useState(false);
  const [characterIds, setCharacterIds] = React.useState([]);
  const characterIdsRef = React.useRef(characterIds);
  characterIdsRef.current = characterIds;
  const [myCharacters, setMyCharacters] = React.useState(null);
  const [myCharactersWithRaidActivity, setMyCharactersWithRaidActivity] =
    React.useState(null);
  const [lastCharacterLookupTime, setLastCharacterLookupTime] =
    React.useState(0);
  const lastCharacterLookupTimeRef = React.useRef(lastCharacterLookupTime);
  lastCharacterLookupTimeRef.current = lastCharacterLookupTime;
  const [usingCachedCharacterData, setUsingCachedCharacterData] =
    React.useState(false);
  const usingCachedCharacterDataRef = React.useRef(usingCachedCharacterData);
  usingCachedCharacterDataRef.current = usingCachedCharacterData;
  const [hiddenTimerIds, setHiddenTimerIds] = React.useState([]);
  const [failedToFetchRaidActivity, setFailedToFetchRaidActivity] =
    React.useState(false);
  const [failedToFetchCharacters, setFailedToFetchCharacters] =
    React.useState(false);

  async function getLfmTableCount() {
    return Fetch("https://api.ddoaudit.com/grouptablecount", 5000)
      .then((val) => {
        if (val.Count != null) {
          return val.Count;
        } else {
          return -1;
        }
      })
      .catch((err) => {
        return -1;
      });
  }

  function getServerNamePossessive() {
    return `${props.server}${props.server === "Thelanis" ? "'" : "'s"}`;
  }

  async function appendMyRaidTimers() {
    let ret = new Promise((resolve, reject) => {
      if (myCharacters != null && myCharacters.length !== 0) {
        let lookups = [];
        let returnedCharacters = [];
        myCharacters.forEach((character) => {
          lookups.push(
            Post(
              "https://api.ddoaudit.com/players/raidactivity",
              { playerid: character.PlayerId },
              10000
            )
              .then((res) => {
                returnedCharacters.push({
                  ...character,
                  RaidActivity: res,
                });
                setTimeout(() => setFailedToFetchRaidActivity(false), 1000);
              })
              .catch(() => {
                setTimeout(() => setFailedToFetchRaidActivity(true), 1000);
                setMyCharactersWithRaidActivity(myCharacters);
                Log(
                  "Failed to fetch raid timers for LFM",
                  `Timeout for ${character.Name}`
                );
              })
          );
        });

        if (lookups.length !== 0) {
          Promise.all(lookups).then(() => {
            // remove raids that are off timer (negative)
            returnedCharacters.forEach((character) => {
              character.RaidActivity = character.RaidActivity.filter(
                (raid) => raid.remaining > 0
              );
            });

            // remove the first instance of duplicate raids
            returnedCharacters.forEach((character) => {
              character.RaidActivity.sort((a, b) => a.remaining - b.remaining);
              let raids = [];
              for (let i = character.RaidActivity.length - 1; i >= 0; i--) {
                if (raids.includes(character.RaidActivity[i].name)) {
                  character.RaidActivity = character.RaidActivity.filter(
                    (_, index) => i != index
                  );
                } else {
                  raids.push(character.RaidActivity[i].name);
                }
              }
            });

            // remove raids hidden by the user
            returnedCharacters.forEach((character) => {
              character.RaidActivity = character.RaidActivity.filter(
                (raid) => !hiddenTimerIds.includes(raid.id)
              );
            });

            returnedCharacters.sort(
              (a, b) => b.RaidActivity?.length - a.RaidActivity?.length
            );
            setMyCharactersWithRaidActivity(returnedCharacters);
            resolve();
          });
        }
      } else {
        setMyCharactersWithRaidActivity([]);
        resolve();
      }
    });
    return ret;
  }

  React.useEffect(() => {
    appendMyRaidTimers();
  }, [myCharacters]);

  async function getMyCharacters() {
    let ret = new Promise((resolve, reject) => {
      if (!characterIdsRef.current || characterIdsRef.current.length == 0) {
        setMyCharacters([]);
        resolve();
      } else {
        if (
          new Date().getTime() - lastCharacterLookupTimeRef.current >
            1000 * REFRESH_CHARACTER_LEVEL_INTERVAL ||
          usingCachedCharacterDataRef.current
        ) {
          setLastCharacterLookupTime(new Date().getTime());
          Post(
            "https://api.ddoaudit.com/players/lookup",
            { playerids: characterIdsRef.current },
            1000
          )
            .then((response) => {
              if (!response.error) {
                setUsingCachedCharacterData(false);
                setFailedToFetchCharacters(false);
                setMyCharacters(response);
                localStorage.setItem(
                  "last-successful-character-response",
                  JSON.stringify(response)
                );
              }
            })
            .catch(() => {
              const localstore = localStorage.getItem(
                "last-successful-character-response"
              );
              setUsingCachedCharacterData(true);
              setMyCharacters(JSON.parse(localstore || "[]"));
              setTimeout(() => setFailedToFetchCharacters(true), 1000);
              Log(
                "Failed to fetch character data for LFM",
                `${localstore ? "Fallback: " + localstore : "No fallback data"}`
              );
            })
            .finally(() => resolve());
        } else {
          resolve();
        }
      }
    });
    return ret;
  }

  let recheck;
  function RefreshLfms() {
    if (props.server === null) return;
    Fetch(
      "https://api.ddoaudit.com/gamestatus/serverstatus",
      5000 + failedAttemptRef.current * 500
    )
      .then((val) => {
        let serverstatus = false;
        if (val.hasOwnProperty("Worlds")) {
          val.Worlds.forEach((world) => {
            if (world.Name.toLowerCase() === props.server.toLowerCase()) {
              if (world.Status === 1) {
                serverstatus = true;
                setServerStatus(true);
              } else {
                serverstatus = false;
                setServerStatus(false);
              }
            }
          });
        } else {
          serverstatus = false;
          setServerStatus(false);
        }
        if (serverstatus === true || ignoreServerStatusRef.current) {
          getMyCharacters().finally(() => {
            Fetch(
              `${LFM_API}/${props.server.toLowerCase()}`,
              5000 + failedAttemptRef.current * 500
            )
              .then((val) => {
                if (VerifyServerLfmData(val)) {
                  props.triggerPopup(null);
                  failedAttemptRef.current = 0;
                  setFailedAttemptCount(failedAttemptRef.current);
                  setUnfilteredServerData(val);
                } else {
                  failedAttemptRef.current++;
                  setFailedAttemptCount(failedAttemptRef.current);
                  if (failedAttemptRef.current > 5) {
                    props.triggerPopup({
                      title: "Something went wrong",
                      message:
                        "Pretty descriptive, I know. First try refreshing the page. If the issue continues, please report it.",
                      icon: "warning",
                      fullscreen: false,
                      reportMessage: `GL127 Bad lfm data: ${
                        val ? JSON.stringify(val) : "null"
                      }`,
                    });
                  } else {
                    recheck = setTimeout(() => {
                      RefreshLfms();
                    }, 200);
                  }
                }
              })
              .catch((err) => {
                failedAttemptRef.current++;
                setFailedAttemptCount(failedAttemptRef.current);
                if (failedAttemptRef.current > 5) {
                  getLfmTableCount().then((result) => {
                    let title = "";
                    let message = "";
                    switch (result) {
                      case -1:
                        // Couldn't connect or errored
                        title = "Couldn't fetch lfm data";
                        message =
                          "First try refreshing the page. If the issue continues, please report it.";
                        break;
                      case 0:
                        // No lfms in table. Server offline?
                        title = "No lfm data found";
                        message =
                          "The server appears to be online, but we've lost connection. Please try again later.";
                        break;
                      default:
                        title = "Something went wrong";
                        message =
                          "Pretty descriptive, I know. First try refreshing the page. If the issue continues, please report it.";
                        break;
                    }
                    props.triggerPopup({
                      title: title,
                      message: message,
                      submessage: err && err.toString(),
                      icon: "warning",
                      fullscreen: false,
                      reportMessage: `GL171 Lfm data generic error (timeout?): ${
                        err && err.toString()
                      }`,
                    });
                  });
                } else {
                  recheck = setTimeout(() => {
                    RefreshLfms();
                  }, 250);
                }
              });
          });
        }
      })
      .catch((err) => {
        failedAttemptRef.current++;
        setFailedAttemptCount(failedAttemptRef.current);
        if (failedAttemptRef.current > 5) {
          props.triggerPopup({
            title: "Couldn't fetch server data",
            message:
              "First try refreshing the page. If the issue continues, please report it.",
            submessage: (err && err.toString()) || "Server status timeout",
            icon: "warning",
            fullscreen: false,
            reportMessage: `GL196 Server status generic errr (timeout?): ${
              err && err.toString()
            }`,
          });
        } else {
          recheck = setTimeout(() => {
            RefreshLfms();
          }, 250);
        }
      });
  }

  let refreshLfmsTimeout;
  React.useEffect(() => {
    clearInterval(refreshLfmsTimeout);
    RefreshLfms();
    refreshLfmsTimeout = setInterval(RefreshLfms, REFRESH_LFM_INTERVAL * 1000);

    return function cleanup() {
      clearInterval(refreshLfmsTimeout);
    };
  }, [props.server]);

  const lastManualLookupTimeRef = React.useRef(0);
  const refreshButtonAngleRef = React.useRef(null);
  function refreshButtonHandler() {
    if (Date.now() - lastManualLookupTimeRef.current > 1000) {
      setLastCharacterLookupTime(0);
      RefreshLfms();
      refreshButtonAngleRef.current += 360;
      $("#lfm-refresh-button").css({
        transform: `rotate(${refreshButtonAngleRef.current}deg)`,
      });
      if (failedToFetchRaidActivity) {
        Log("Manual LFM refresh", "After raid activity lookup failure");
      } else if (failedToFetchCharacters) {
        Log("Manual LFM refresh", "After character lookup failure");
      } else {
        Log("Manual LFM refresh", "");
      }
      lastManualLookupTimeRef.current = Date.now();
    }
  }

  // Helper function returns the character on timer for a raid
  function getTimers(lfm) {
    let characters = [];
    if (
      myCharactersWithRaidActivity &&
      myCharactersWithRaidActivity.length > 0 &&
      lfm.quest != null
    ) {
      myCharactersWithRaidActivity.forEach((character) => {
        if (character.raid_activity) {
          character.raid_activity.forEach((raid) => {
            if (
              (raid.quest_id === lfm.quest.dd ||
                raid.quest_id === lfm.quest.alt_id) &&
              raid.remaining &&
              character.server === props.server
            ) {
              characters.push(character);
            }
          });
        }
      });
    }
    return characters;
  }

  React.useEffect(() => {
    if (unfilteredServerData === null) return;
    let lfms = unfilteredServerData.lfms;
    let filtered_lfms = [];
    Object.entries(lfms).forEach(([lfm_id, lfm]) => {
      let levelpass = false;
      if (filterBasedOnMyLevel) {
        let eligible_characters = [];
        myCharacters.forEach((character) => {
          if (
            lfm.minimum_level <= character.total_level &&
            lfm.maximum_level >= character.total_level &&
            character.Server === props.server
          ) {
            eligible_characters.push(character.name);
          }
        });
        levelpass = eligible_characters.length > 0;
        lfm.eligible_characters = eligible_characters;
      } else {
        levelpass =
          (lfm.minimum_level >= minimumLevel &&
            lfm.minimum_level <= maximumLevel) ||
          (lfm.maximum_level >= minimumLevel &&
            lfm.maximum_level <= maximumLevel) ||
          (lfm.minimum_level <= minimumLevel &&
            lfm.maximum_level >= maximumLevel);
      }
      lfm.eligible = levelpass || lfm.leader?.name === "DDO Audit";
      if (lfm.eligible || showNotEligible) {
        filtered_lfms.push(lfm);
      }

      // check raid timers
      if (
        showRaidTimerIndicator &&
        myCharactersWithRaidActivity != null &&
        myCharactersWithRaidActivity.length > 0
      ) {
        const charactersOnTimer = getTimers(lfm);
        if (charactersOnTimer.length > 0) {
          lfm.character_on_timer = charactersOnTimer;
        }
      } else {
        lfm.character_on_timer = null;
      }
    });
    setFilteredServerData({
      ...unfilteredServerData,
      lfms: filtered_lfms.sort((a, b) =>
        sortAscending
          ? a.maximum_level - b.maximum_level
          : b.maximum_level - a.maximum_level
      ),
    });
  }, [
    unfilteredServerData,
    minimumLevel,
    maximumLevel,
    filterBasedOnMyLevel,
    sortAscending,
    showNotEligible,
    showEligibleCharacters,
    showRaidTimerIndicator,
    myCharactersWithRaidActivity,
  ]);

  function handleCanvasSort() {
    sortAscendingRef.current = !sortAscendingRef.current;
    if (!props.minimal) {
      localStorage.setItem("sort-order", sortAscendingRef.current);
    }
    setSortAscending((sortAscending) => !sortAscending);
  }

  function isExpanded(lfm) {
    let val = false;
    expandedLfms.forEach((g) => {
      if (g.leader.name === lfm.leader.name) val = true;
    });
    return val;
  }
  var [expandedLfms, setExpandedLfms] = React.useState([]);

  React.useEffect(() => {
    // Load local storage
    const THEME = localStorage.getItem("theme");
    setTheme(THEME);

    const MIN_LEVEL = localStorage.getItem("minimum-level");
    setMinimumLevel(MIN_LEVEL || 1);

    const MAX_LEVEL = localStorage.getItem("maximum-level");
    setMaximumLevel(MAX_LEVEL || MAX_LEVEL);

    const FILTER_BY_MY_LEVEL = localStorage.getItem("filter-by-my-level");
    setFilterBasedOnMyLevel(
      FILTER_BY_MY_LEVEL !== null ? FILTER_BY_MY_LEVEL === "true" : false
    );

    setCharacterIds(
      JSON.parse(localStorage.getItem("registered-characters") || "[]")
    );

    const SHOW_ELIGIBLE_CHARACTERS = localStorage.getItem(
      "show-eligible-characters"
    );
    setShowEligibleCharacters(
      SHOW_ELIGIBLE_CHARACTERS !== null
        ? SHOW_ELIGIBLE_CHARACTERS === "true"
        : false
    );

    const SHOW_GUILD_NAMES = localStorage.getItem("show-guild-names");
    setShowGuildNames(
      SHOW_GUILD_NAMES !== null ? SHOW_GUILD_NAMES === "true" : false
    );

    const SHOW_NOT_ELIGIBLE = localStorage.getItem("show-not-eligible");
    setShowNotEligible(
      SHOW_NOT_ELIGIBLE !== null ? SHOW_NOT_ELIGIBLE === "true" : true
    );

    const SORT_ASCENDING = localStorage.getItem("sort-order");
    setSortAscending(
      SORT_ASCENDING !== null ? SORT_ASCENDING === "true" : true
    );

    const ALTERNATIVE_LOOK = localStorage.getItem("alternative-lfm-look");
    setAlternativeLook(
      ALTERNATIVE_LOOK !== null ? ALTERNATIVE_LOOK === "true" : false
    );

    const HIGH_VISIBILITY = localStorage.getItem("high-visibility");
    setHighVisibility(
      HIGH_VISIBILITY !== null ? HIGH_VISIBILITY === "true" : false
    );

    const FONT_MODIFIER = localStorage.getItem("font-modifier");
    setFontModifier(FONT_MODIFIER !== null ? +FONT_MODIFIER : 0);

    const SHOW_COMPLETION_PERCENTAGE = localStorage.getItem(
      "completion-percentage"
    );
    setShowCompletionPercentage(
      SHOW_COMPLETION_PERCENTAGE !== null
        ? SHOW_COMPLETION_PERCENTAGE === "true"
        : false
    );

    const SHOW_MEMBER_COUNT = localStorage.getItem("member-count");
    setShowMemberCount(
      SHOW_MEMBER_COUNT !== null ? SHOW_MEMBER_COUNT === "true" : true
    );

    const SHOW_QUEST_GUESSES = localStorage.getItem("quest-guess");
    setShowQuestGuesses(
      SHOW_QUEST_GUESSES !== null ? SHOW_QUEST_GUESSES === "true" : true
    );

    const SHOW_QUEST_TIPS = localStorage.getItem("quest-tips");
    setShowQuestTips(
      SHOW_QUEST_TIPS !== null ? SHOW_QUEST_TIPS === "true" : true
    );

    const SHOW_RAID_TIMER_INDICATOR = localStorage.getItem(
      "show-raid-timer-indicator"
    );
    setShowRaidTimerIndicator(
      SHOW_RAID_TIMER_INDICATOR !== null
        ? SHOW_RAID_TIMER_INDICATOR === "true"
        : false
    );

    const HIDDEN_TIMER_IDS = JSON.parse(
      localStorage.getItem("hidden-raid-timer-ids") || "[]"
    );
    setHiddenTimerIds(HIDDEN_TIMER_IDS);

    $(document).on("keydown.handleEscape", function (e) {
      if (e.key === "Escape") {
        setFilterPanelVisible(false);
      }
    });

    return () => $(document).unbind("keydown.handleEscape");
  }, []);

  // Filter bar
  const [filterPanelVisible, setFilterPanelVisible] = React.useState(false);

  function toggleTheme() {
    let theme = localStorage.getItem("theme");
    if (theme === "light-theme") {
      theme = "dark";
      setTheme("dark");

      document.body.classList.replace("light-theme", "dark-theme");
      localStorage.setItem("theme", "dark-theme");
    } else {
      theme = "light";
      setTheme("light");

      document.body.classList.replace("dark-theme", "light-theme");
      localStorage.setItem("theme", "light-theme");
    }
  }

  return (
    <div
      className={
        "content-container" + `${props.minimal ? " hide-on-mobile" : ""}`
      }
      style={{ minHeight: "700px", width: "848px" }}
    >
      <FilterBar
        minimal={props.minimal}
        currentServer={props.server}
        showNotifications={false}
        showSave={true}
        showRefreshButton={true}
        maxWidth={848}
        returnTo="/grouping"
        handleFilterButton={() => setFilterPanelVisible(!filterPanelVisible)}
        handleSaveButton={() => download()}
        handleRefreshButton={() => refreshButtonHandler()}
        closePanel={() => props.closePanel()}
        permalink={props.permalink}
        failedToFetchRaidActivity={failedToFetchRaidActivity}
        failedToFetchCharacters={failedToFetchCharacters}
      />
      {filterPanelVisible && (
        <div
          className="clip-wrapper show-on-mobile"
          onClick={() => setFilterPanelVisible(false)}
        >
          <div className="mobile-corner-close">
            <CloseSVG className="nav-icon-large should-invert" />
          </div>
        </div>
      )}
      {filterPanelVisible && (
        <div
          style={{
            position: "fixed",
            top: "0px",
            left: "0px",
            width: "100%",
            height: "100%",
            zIndex: 99,
          }}
        >
          <div
            className="filter-panel-overlay"
            style={{
              display: "block",
            }}
            onClick={() => setFilterPanelVisible(false)}
          />
          <div
            className="filter-panel"
            style={{
              display: "block",
              padding: "10px",
            }}
          >
            <CloseSVG
              style={{
                position: "absolute",
                top: "5px",
                right: "5px",
                cursor: "pointer",
              }}
              className="nav-icon should-invert hide-on-mobile"
              onClick={() => setFilterPanelVisible(false)}
            />
            <div
              className="hide-on-mobile"
              style={{ width: "100%", height: "20px" }}
            />
            <ContentCluster title="Filter LFMs" smallBottomMargin noLink={true}>
              {filterBasedOnMyLevel ? (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "100%",
                    fontSize: "1.2rem",
                    marginTop: "-10px",
                  }}
                >
                  {myCharacters && myCharacters.length > 0 && (
                    <span style={{ fontSize: "1.3rem" }}>
                      Filtering LFMs based on your characters:
                    </span>
                  )}
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "center",
                      flexWrap: "wrap",
                      columnGap: "3px",
                      rowGap: "3px",
                      width: "100%",
                      padding: "5px 0px 10px 0px",
                    }}
                  >
                    {(!myCharacters || myCharacters.length === 0) && (
                      <div
                        style={{
                          width: "100%",
                        }}
                      >
                        <PageMessage
                          type="info"
                          title="No registered characters"
                          message={
                            <>
                              You need to{" "}
                              <Link to="/registration">
                                add some characters
                              </Link>{" "}
                              first.
                            </>
                          }
                          fontSize={1.1}
                        />
                      </div>
                    )}
                    {myCharacters &&
                      myCharacters.map((character) => (
                        <span
                          style={{
                            border: "1px solid green",
                            borderRadius: "3px",
                            padding: "0px 6px",
                          }}
                        >
                          {character.Name}{" "}
                          <span
                            style={{
                              color: "var(--text-faded)",
                            }}
                          >
                            {`- ${character.TotalLevel}, ${character.Server}`}
                          </span>
                        </span>
                      ))}
                  </div>
                </div>
              ) : (
                <div style={{ padding: "15px", width: "100%" }}>
                  <LevelRangeSlider
                    handleChange={(e) => {
                      if (e.length) {
                        if (!props.minimal) {
                          localStorage.setItem("minimum-level", e[0]);
                          localStorage.setItem("maximum-level", e[1]);
                        }
                        setMinimumLevel(e[0]);
                        setMaximumLevel(e[1]);
                      }
                    }}
                    minimumLevel={minimumLevel}
                    maximumLevel={maximumLevel}
                  />
                </div>
              )}
              <div
                style={{
                  display: "flex",
                  justifyContent: "left",
                  flexDirection: "column",
                  alignItems: "start",
                }}
              >
                <label
                  className="filter-panel-group-option"
                  style={{
                    marginBottom: "0px",
                  }}
                >
                  <input
                    className="input-radio"
                    name="mylevel"
                    type="checkbox"
                    checked={filterBasedOnMyLevel}
                    onChange={() => {
                      if (!props.minimal) {
                        localStorage.setItem(
                          "filter-by-my-level",
                          !filterBasedOnMyLevel
                        );
                      }
                      Log(
                        "Clicked filter based on my level",
                        !filterBasedOnMyLevel ? "true" : "false"
                      );
                      setFilterBasedOnMyLevel(!filterBasedOnMyLevel);
                    }}
                  />
                  Filter LFMs based on my current level
                </label>
                {filterBasedOnMyLevel && (
                  <label
                    className="filter-panel-group-option"
                    style={{
                      marginLeft: "40px",
                      marginBottom: "0px",
                    }}
                  >
                    <input
                      className="input-radio"
                      name="showeligiblecharacters"
                      type="checkbox"
                      checked={showEligibleCharacters}
                      onChange={() => {
                        if (!props.minimal) {
                          localStorage.setItem(
                            "show-eligible-characters",
                            !showEligibleCharacters
                          );
                        }
                        setShowEligibleCharacters(!showEligibleCharacters);
                      }}
                    />
                    Show my eligible characters
                  </label>
                )}
                <Link
                  to="/registration"
                  style={{
                    marginLeft: "40px",
                    fontSize: "1.1rem",
                  }}
                >
                  Add characters
                </Link>
                <label className="filter-panel-group-option">
                  <input
                    className="input-radio"
                    name="noteligible"
                    type="checkbox"
                    checked={showNotEligible}
                    onChange={() => {
                      if (!props.minimal) {
                        localStorage.setItem(
                          "show-not-eligible",
                          !showNotEligible
                        );
                      }
                      setShowNotEligible(!showNotEligible);
                    }}
                  />
                  Show LFMs I am not eligible for
                </label>
                <label className="filter-panel-group-option">
                  <input
                    className="input-radio"
                    name="setsortorder"
                    type="checkbox"
                    checked={sortAscending}
                    onChange={() => {
                      if (!props.minimal) {
                        localStorage.setItem("sort-order", !sortAscending);
                      }
                      setSortAscending(!sortAscending);
                    }}
                  />
                  Sort LFMs ascending
                </label>
              </div>
            </ContentCluster>
            <ContentCluster title="Accessibility" smallBottomMargin>
              <div
                style={{
                  display: "flex",
                  justifyContent: "left",
                  flexDirection: "column",
                  alignItems: "start",
                }}
              >
                <label className="filter-panel-group-option show-on-mobile">
                  <input
                    className="input-radio"
                    name="darktheme"
                    type="checkbox"
                    checked={theme === "dark-theme"}
                    onChange={() => {
                      toggleTheme();
                    }}
                  />
                  Dark theme
                </label>
                <label className="filter-panel-group-option">
                  <input
                    className="input-radio"
                    name="classiclook"
                    type="checkbox"
                    checked={alternativeLook}
                    onChange={() => {
                      if (!props.minimal) {
                        localStorage.setItem(
                          "alternative-lfm-look",
                          !alternativeLook
                        );
                      }
                      setAlternativeLook(!alternativeLook);
                    }}
                  />
                  Text-Based View
                </label>
                <label className="filter-panel-group-option">
                  <input
                    className="input-radio"
                    name="highvis"
                    type="checkbox"
                    checked={highVisibility}
                    onChange={() => {
                      if (!props.minimal) {
                        localStorage.setItem(
                          "high-visibility",
                          !highVisibility
                        );
                      }
                      setHighVisibility(!highVisibility);
                    }}
                  />
                  High Contrast
                </label>
                <label className="filter-panel-group-option">
                  <input
                    className="input-radio"
                    name="largefont"
                    type="checkbox"
                    checked={fontModifier === 5}
                    onChange={() => {
                      if (!props.minimal) {
                        localStorage.setItem(
                          "font-modifier",
                          fontModifier === 0 ? 5 : 0
                        );
                      }
                      setFontModifier(fontModifier === 0 ? 5 : 0);
                    }}
                  />
                  Large Font
                </label>
              </div>
            </ContentCluster>
            <ContentCluster title="Add-ons" smallBottomMargin>
              <div
                style={{
                  display: "flex",
                  justifyContent: "left",
                  flexDirection: "column",
                  alignItems: "start",
                }}
              >
                <label className="filter-panel-group-option">
                  <input
                    className="input-radio"
                    name="showraidtimerindicator"
                    type="checkbox"
                    checked={showRaidTimerIndicator}
                    onChange={() => {
                      if (!props.minimal) {
                        localStorage.setItem(
                          "show-raid-timer-indicator",
                          !showRaidTimerIndicator
                        );
                      }
                      Log(
                        "Clicked Show Raid Timer Indicator",
                        !showRaidTimerIndicator ? "true" : "false"
                      );
                      setShowRaidTimerIndicator(!showRaidTimerIndicator);
                    }}
                  />
                  Show Raid Timer Indicator
                </label>
                {showRaidTimerIndicator && myCharacters.length === 0 && (
                  <span
                    style={{
                      marginTop: "-7px",
                      marginBottom: "7px",
                      marginLeft: "40px",
                      fontSize: "1.1rem",
                    }}
                  >
                    You'll need to{" "}
                    <Link to="/registration">add a character</Link> first
                  </span>
                )}
                <label className="filter-panel-group-option">
                  <input
                    className="input-radio"
                    name="completionpercentage"
                    type="checkbox"
                    checked={showCompletionPercentage}
                    onChange={() => {
                      if (!props.minimal) {
                        localStorage.setItem(
                          "completion-percentage",
                          !showCompletionPercentage
                        );
                      }
                      Log(
                        "Clicked Show Completion Percentage",
                        !showCompletionPercentage ? "true" : "false"
                      );
                      setShowCompletionPercentage(!showCompletionPercentage);
                    }}
                  />
                  Show Completion Progress Bar
                </label>
                <label className="filter-panel-group-option">
                  <input
                    className="input-radio"
                    name="membercount"
                    type="checkbox"
                    checked={showMemberCount}
                    onChange={() => {
                      if (!props.minimal) {
                        localStorage.setItem("member-count", !showMemberCount);
                      }
                      setShowMemberCount(!showMemberCount);
                    }}
                  />
                  Show Member Count
                </label>
                <label className="filter-panel-group-option">
                  <input
                    className="input-radio"
                    name="questguess"
                    type="checkbox"
                    checked={showQuestGuesses}
                    onChange={() => {
                      if (!props.minimal) {
                        localStorage.setItem("quest-guess", !showQuestGuesses);
                      }
                      setShowQuestGuesses(!showQuestGuesses);
                    }}
                  />
                  Show Quest Guesses
                </label>
                <label className="filter-panel-group-option">
                  <input
                    className="input-radio"
                    name="questtips"
                    type="checkbox"
                    checked={showQuestTips}
                    onChange={() => {
                      if (!props.minimal) {
                        localStorage.setItem("quest-tips", !showQuestTips);
                      }
                      setShowQuestTips(!showQuestTips);
                    }}
                  />
                  Show Quest Tips
                </label>
                <label className="filter-panel-group-option">
                  <input
                    className="input-radio"
                    name="guildnames"
                    type="checkbox"
                    checked={showGuildNames}
                    onChange={() => {
                      if (!props.minimal) {
                        localStorage.setItem(
                          "show-guild-names",
                          !showGuildNames
                        );
                      }
                      setShowGuildNames(!showGuildNames);
                    }}
                  />
                  Show Character Guild Names
                </label>
              </div>
            </ContentCluster>
          </div>
        </div>
      )}
      <div className="sr-only">
        {`The image below is a live preview of ${getServerNamePossessive()} LFM panel where all LFMs are visible.`}
      </div>
      {serverStatus !== false || ignoreServerStatus ? (
        alternativeLook === false ? (
          <CanvasLfmPanel
            expandedInfo={false}
            data={filteredServerData}
            showNotEligible={showNotEligible}
            adjustedLfmCount={adjustedLfmCount}
            fontModifier={fontModifier}
            highVisibility={highVisibility}
            handleSort={() => handleCanvasSort()}
            showCompletionPercentage={showCompletionPercentage}
            showMemberCount={showMemberCount}
            showQuestGuesses={showQuestGuesses}
            showQuestTips={showQuestTips}
            sortAscending={sortAscending}
            showEligibleCharacters={showEligibleCharacters}
            showGuildNames={showGuildNames}
          />
        ) : (
          <div className="social-container">
            {filteredServerData && filteredServerData.lfms.length ? (
              Object.entries(filteredServerData.lfms).map(
                ([lfm_id, lfm]) =>
                  lfm.eligible && (
                    <Lfm
                      key={lfm_id}
                      handleClick={() => {
                        if (isExpanded(lfm)) {
                          setExpandedLfms(
                            expandedLfms.filter((this_lfm) => {
                              return this_lfm.leader.name !== lfm.leader.name;
                            })
                          );
                        } else {
                          setExpandedLfms([...expandedLfms, lfm]);
                        }
                      }}
                      lfm={lfm}
                      expanded={isExpanded(lfm)}
                    />
                  )
              )
            ) : (
              <span
                style={{
                  fontSize: "1.6rem",
                  width: "100%",
                  textAlign: "center",
                  color: "var(--text)",
                  marginTop: "20px",
                }}
              >
                {filteredServerData && filteredServerData.lfms.length === 0
                  ? "No LFMs meet your current filter settings"
                  : "Loading data..."}
              </span>
            )}
          </div>
        )
      ) : (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            marginTop: "20px",
            width: "100%",
            maxWidth: "848px",
          }}
        >
          <span
            style={{
              fontSize: "1.6rem",
              width: "100%",
              textAlign: "center",
              color: "var(--text)",
            }}
          >
            <p
              style={{
                marginBottom: "0px",
              }}
            >
              This server might be offline.
              <br />
              You may check server status on the{" "}
              <Link to="/live">Live page</Link>.
              <br />
              If you believe this to be an error,
            </p>
          </span>
          <div
            className="action-button-container"
            style={{
              width: "100%",
              padding: "0px 20px",
            }}
          >
            <div
              className="primary-button should-invert full-width-mobile"
              onClick={() => {
                setIgnoreServerStatus(true);
                RefreshLfms();
              }}
            >
              Load data anyways
            </div>
            <div
              className={
                "secondary-button should-invert full-width-mobile" +
                (reported || noReport ? " disabled" : "")
              }
              onClick={() => {
                if ((reported || noReport) === false) {
                  Submit(
                    "User reported issue from grouping/" + props.server,
                    "[Internal] Reported 'server offline' message"
                  );
                  setReported(true);
                }
              }}
            >
              {reported ? "Thanks!" : "Report Issue"}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Panel;
