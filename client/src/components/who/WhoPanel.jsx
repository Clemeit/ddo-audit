import React from "react";
import { Fetch, VerifyPlayerData } from "../../services/DataLoader";
import { ReactComponent as CloseSVG } from "../../assets/global/close.svg";
import FilterBar from "../global/FilterBar";
import CanvasWhoPanel from "./CanvasWhoPanel";
import { Submit } from "../../services/CommunicationService";
import ContentCluster from "../global/ContentCluster";
import { Link } from "react-router-dom";
import { SERVER_LIST_LOWERCASE } from "../../constants/Servers";
import { Log } from "../../services/CommunicationService";
import FeatureFlagHook from "../../hooks/FeatureFlagHook";
import $ from "jquery";

const WhoPanel = (props) => {
  const MAX_LEVEL = 34;
  const PAGE_SIZE = 10;

  const noReport = FeatureFlagHook("no-report", 1000 * 60 * 60);

  // Download canvas
  var download = function () {
    // Redraw panel without names
    var link = document.createElement("a");
    link.download = `ddo-who-panel.png`;
    link.href = document.getElementById("who-canvas").toDataURL();
    link.click();
  };

  // Data
  // const [currentServer, setCurrentServer] = React.useState(null);
  const [playerData, setPlayerData] = React.useState({
    timestamp: 0,
    data: null,
  });
  const [currentPopulation, setCurrentPopulation] = React.useState(null);
  const [currentAnonymous, setCurrentAnonymous] = React.useState(null);
  const [filteredPlayerData, setFilteredPlayerData] = React.useState(null);
  const [paginatedPlayerData, setPaginatedPlayerData] = React.useState(null);
  const [playerCount, setPlayerCount] = React.useState(null);
  const [adjustedPlayerCount, setAdjustedPlayerCount] = React.useState(null);
  const [lastFetchTime, setLastFetchTime] = React.useState(null);
  const [attemptedPlayerFetch, setAttemptedPlayerFetch] = React.useState(null);
  const [classFilterStates, setClassFilterStates] = React.useState([
    true,
    true,
    true,
    true,
    true,
    true,
    true,
    true,
    true,
    true,
    true,
    true,
    true,
    true,
    true,
  ]);
  const classFilterStatesRef = React.useRef(classFilterStates);
  classFilterStatesRef.current = classFilterStates;
  const CLASS_NAMES = [
    "fighter",
    "paladin",
    "barbarian",
    "rogue",
    "ranger",
    "cleric",
    "wizard",
    "sorcerer",
    "bard",
    "monk",
    "favored soul",
    "artificer",
    "druid",
    "warlock",
    "alchemist",
  ];
  const [includeRegion, setIncludeRegion] = React.useState(false);
  const [exactMatch, setExactMatch] = React.useState(false);

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

  // Settings
  const [alternativeLook, setAlternativeLook] = React.useState(true);
  const [activeFilters, setActiveFilter] = React.useState([]);
  const [sortingMethod, setSortingMethod] = React.useState("level");
  const sortingMethodRef = React.useRef(sortingMethod);
  const [sortingDirection, setSortingDirection] = React.useState("ascending");
  const sortingDirectionRef = React.useRef(sortingDirection);

  const [pageNumber, setPageNumber] = React.useState(0);

  const [expandedPlayers, setExpandedPlayers] = React.useState([]);
  const [pinnedPlayers, setPinnedPlayers] = React.useState([]);

  const [filterPanelVisible, setFilterPanelVisible] = React.useState(false);

  const [theme, setTheme] = React.useState(true);
  function toggleTheme() {
    let theme = localStorage.getItem("theme");
    if (theme === "light-theme") {
      setTheme("dark");

      document.body.classList.replace("light-theme", "dark-theme");
      localStorage.setItem("theme", "dark-theme");
    } else {
      setTheme("light");

      document.body.classList.replace("dark-theme", "light-theme");
      localStorage.setItem("theme", "light-theme");
    }
  }

  const [globalFilter, setGlobalFilter] = React.useState("");
  const [minimumLevelFilter, setMinimumLevelFilter] = React.useState(1);
  const [maximumLevelFilter, setMaximumLevelFilter] = React.useState(MAX_LEVEL);

  const globalFilterRef = React.useRef(globalFilter);
  globalFilterRef.current = globalFilter;

  React.useEffect(() => {
    props.bubbleFilter(globalFilter);
  }, [globalFilter]);

  function getLink() {
    let params = "";
    if (globalFilter) {
      if (!params) {
        params += "?";
      } else {
        params += "&";
      }
      params += "filter=" + globalFilter;
    }
    if (minimumLevelFilter != 1) {
      if (!params) {
        params += "?";
      } else {
        params += "&";
      }
      params += "minlevel=" + minimumLevelFilter;
    }
    if (maximumLevelFilter != MAX_LEVEL) {
      if (!params) {
        params += "?";
      } else {
        params += "&";
      }
      params += "maxlevel=" + maximumLevelFilter;
    }

    return `https://www.ddoaudit.com/who/${props.server.toLowerCase()}${params}`;
  }

  function handleClassFilter(index) {
    setClassFilterStates((classFilterStates) =>
      classFilterStates.map((r, i) =>
        i === index ? (r === true ? false : true) : r
      )
    );
  }

  function isEveryClassChecked() {
    let result = true;
    classFilterStatesRef.current.forEach((state) => {
      if (!state) result = false;
    });
    return result;
  }

  function handleAnyClass() {
    if (isEveryClassChecked()) {
      setClassFilterStates(Array(15).fill(false));
    } else {
      setClassFilterStates(Array(15).fill(true));
    }
  }

  function handleIncludeRegion() {
    setIncludeRegion((includeRegion) => !includeRegion);
  }

  function handleExactMatch() {
    setExactMatch((exactMatch) => !exactMatch);
  }

  function handleCanvasSort(type) {
    if (sortingMethodRef.current == type) {
      setSortingDirection((sortingDirection) =>
        sortingDirection === "ascending" ? "descending" : "ascending"
      );
    } else {
      setSortingDirection("ascending");
      setSortingMethod(type);
      sortingMethodRef.current = type;
      if (type === "groupid") {
        Log("Group View", "Enabled");
      }
    }
  }

  function ApplyFilters(data) {
    // Apply sorting
    if (sortingMethod === "level") {
      if (sortingDirection === "ascending") {
        data.sort((a, b) => a.TotalLevel - b.TotalLevel);
      } else {
        data.sort((a, b) => b.TotalLevel - a.TotalLevel);
      }
    } else if (sortingMethod === "guild") {
      if (sortingDirection === "ascending") {
        data.sort((a, b) => a.Guild.localeCompare(b.Guild));
      } else {
        data.sort((a, b) => b.Guild.localeCompare(a.Guild));
      }
    } else if (sortingMethod === "location") {
      if (sortingDirection === "ascending") {
        data.sort((a, b) => {
          if (a.Location.Name == null || b.Location.Name == null) return 0;
          return a.Location.Name.localeCompare(b.Location.Name);
        });
      } else {
        data.sort((a, b) => {
          if (a.Location.Name == null || b.Location.Name == null) return 0;
          return b.Location.Name.localeCompare(a.Location.Name);
        });
      }
    } else if (sortingMethod === "inparty") {
      if (sortingDirection === "ascending") {
        data.sort((a, b) => a.InParty - b.InParty);
      } else {
        data.sort((a, b) => b.InParty - a.InParty);
      }
    } else if (sortingMethod === "groupid") {
      data.sort((a, b) => a.GroupId.localeCompare(b.GroupId));
    } else if (sortingMethod === "class") {
      if (sortingDirection === "ascending") {
        data.sort((a, b) => {
          let astring = "";
          a.Classes.forEach((c) => {
            astring = astring + (c.Name || "");
          });
          let bstring = "";
          b.Classes.forEach((c) => {
            bstring = bstring + (c.Name || "");
          });
          return astring.localeCompare(bstring);
        });
      } else {
        data.sort((a, b) => {
          let astring = "";
          a.Classes.forEach((c) => {
            astring = astring + (c.Name || "");
          });
          let bstring = "";
          b.Classes.forEach((c) => {
            bstring = bstring + (c.Name || "");
          });
          return bstring.localeCompare(astring);
        });
      }
    } else {
      if (sortingDirection === "ascending") {
        data.sort((a, b) => a.Name.localeCompare(b.Name));
      } else {
        data.sort((a, b) => b.Name.localeCompare(a.Name));
      }
    }

    // Apply filters
    data = data.filter(
      (player) => player.Name !== "Anonymous" && player.Name !== ""
    );

    // If sortingMethod === "groupid", we want to filter out all players not
    // in a party, and all players where their party is only themselves.
    if (sortingMethod === "groupid") {
      data = data.filter(
        (player) => player.GroupId !== null && player.GroupId !== "0"
      );

      data = data.filter((player) => {
        return (
          data.filter((inner_player) => inner_player.GroupId === player.GroupId)
            .length > 1
        );
      });
    }

    // if (activeFilters !== null && activeFilters.length !== 0) {
    let passingGroupIds = [];
    const firstPassData = data.filter((player) => {
      let pass = false;

      // Global filters
      let splt = globalFilter.split(",");
      splt.forEach((f) => {
        const trimmedFilter = f.trim();
        let localmatch = false;
        if (exactMatch) {
          if (player.Name === trimmedFilter) {
            localmatch = true;
          }
          if (player.Location.Name && player.Location.Name === trimmedFilter) {
            localmatch = true;
          }
          if (includeRegion) {
            if (
              player.Location.Name &&
              player.Location.Region === trimmedFilter
            ) {
              localmatch = true;
            }
          }
          if (player.Guild === trimmedFilter) {
            localmatch = true;
          }
        } else {
          if (player.Name.toLowerCase().includes(trimmedFilter.toLowerCase())) {
            localmatch = true;
          }
          if (
            player.Location.Name &&
            player.Location.Name.toLowerCase().includes(
              trimmedFilter.toLowerCase()
            )
          ) {
            localmatch = true;
          }
          if (includeRegion) {
            if (
              player.Location.Name &&
              player.Location.Region.toLowerCase().includes(
                trimmedFilter.toLowerCase()
              )
            ) {
              localmatch = true;
            }
          }
          if (
            player.Guild.toLowerCase().includes(trimmedFilter.toLowerCase())
          ) {
            localmatch = true;
          }
        }
        pass = pass || localmatch;
      });

      if (player.TotalLevel < minimumLevelFilter) pass = false;
      if (player.TotalLevel > maximumLevelFilter) pass = false;

      let classresult = false;
      classFilterStates.forEach((cls, index) => {
        if (cls === true) {
          let result = false;
          player.Classes.forEach((playercls) => {
            if (playercls.Name !== null) {
              if (
                playercls.Name.toLowerCase() ===
                CLASS_NAMES[index].toLowerCase()
              ) {
                result = true;
              }
            }
          });
          if (result === true) classresult = true;
        }
      });
      if (classresult === false) pass = false;

      if (pass) {
        if (
          !passingGroupIds.includes(player.GroupId) &&
          player.GroupId !== "0"
        ) {
          passingGroupIds.push(player.GroupId);
        }
      }

      return pass;
    });
    console.log(passingGroupIds);
    if (sortingMethod === "groupid") {
      data = data.filter((player) => passingGroupIds.includes(player.GroupId));
      data = data.sort((a, b) => {
        if (a.GroupId === b.GroupId) {
          if (a.TotalLevel === b.TotalLevel) {
            return a.Name.localeCompare(b.Name);
          } else {
            return a.TotalLevel - b.TotalLevel;
          }
        } else {
          return a.GroupId.localeCompare(b.GroupId);
        }
      });
    } else {
      data = firstPassData;
    }
    // } else {
    //     // Pull out starred players to be inserted at the top later
    //     let starredplayers = data.filter((p) => IsStarred(p));
    //     data = data.filter((p) => !IsStarred(p));
    //     data = [...starredplayers, ...data];
    // }

    // Pull out starred players to be inserted at the top later
    let starredplayers = data.filter((p) => IsStarred(p));
    data = data.filter((p) => !IsStarred(p));
    data = [...starredplayers, ...data];

    return data;
  }

  function IsExpanded(player) {
    let val = false;
    expandedPlayers.forEach((p) => {
      if (p.Name === player.Name) val = true;
    });
    return val;
  }

  function IsStarred(player) {
    let val = false;
    pinnedPlayers.forEach((p) => {
      if (p.name === player.Name && p.server === currentServer) val = true;
    });
    return val;
  }

  React.useEffect(() => {
    // Load local storage
    let theme = localStorage.getItem("theme");
    setTheme(theme);

    let alternativelook = localStorage.getItem("alternative-who-look");
    setAlternativeLook(
      alternativelook !== null ? alternativelook === "true" : false
    );

    // Load filters from URL
    let urlfilters = new URLSearchParams(window.location.search);
    let urlfilter = urlfilters.get("filter");
    // Legacy:
    let urlname = urlfilters.get("name");
    let urlguild = urlfilters.get("guild");
    let urllocation = urlfilters.get("location");
    let urlminlevel = urlfilters.get("minlevel");
    let urlmaxlevel = urlfilters.get("maxlevel");

    let activefilterarray = [];
    let globalfilter = [];
    if (urlfilter) {
      globalfilter.push(urlfilter);
    }
    if (urlminlevel) {
      setMinimumLevelFilter(urlminlevel);
    }
    if (urlmaxlevel) {
      setMaximumLevelFilter(urlmaxlevel);
    }
    // Legacy:
    if (urlname) {
      globalfilter.push(urlname);
    }
    if (urlguild) {
      globalfilter.push(urlguild);
    }
    if (urllocation) {
      globalfilter.push(urllocation);
    }
    setGlobalFilter(globalfilter.join(","));

    // setActiveFilter(activefilterarray);
  }, []);

  function GetSnarkyMessage() {
    if (playerCount === 0) {
      return "Maybe they're all anonymous.";
    } else {
      return "Are you one of them?";
    }
  }

  // Apply filter after filter change
  React.useEffect(() => {
    if (playerData === null || playerData.data === null) return;
    setFilteredPlayerData(ApplyFilters(playerData.data.Players));
  }, [
    globalFilter,
    minimumLevelFilter,
    maximumLevelFilter,
    activeFilters,
    playerData,
    sortingMethod,
    sortingDirection,
    pinnedPlayers,
    classFilterStates,
    includeRegion,
    exactMatch,
  ]);

  React.useEffect(() => {
    if (filteredPlayerData === null) return;
    setPaginatedPlayerData(
      filteredPlayerData.slice(
        Math.max(0, pageNumber * PAGE_SIZE),
        Math.min(pageNumber * PAGE_SIZE + PAGE_SIZE, filteredPlayerData.length)
      )
    );
  }, [filteredPlayerData, pageNumber]);

  const lastManualLookupTimeRef = React.useRef(0);
  const refreshButtonAngleRef = React.useRef(null);
  function refreshButtonHandler() {
    if (Date.now() - lastManualLookupTimeRef.current > 3000) {
      FetchPlayerData();
      refreshButtonAngleRef.current += 360;
      $("#who-refresh-button").css({
        transform: `rotate(${refreshButtonAngleRef.current}deg)`,
      });
      Log("Manual player refresh", "");
      lastManualLookupTimeRef.current = Date.now();
    }
  }

  // Let's get some data
  let recheck; // TODO: Clearing this timeout doesn't work
  let refreshdata;
  React.useEffect(() => {
    clearTimeout(recheck); // TODO: Clearing this timeout doesn't work
    setFilteredPlayerData(null);
    if (!props.server) return;

    FetchPlayerData();

    refreshdata = setInterval(() => {
      FetchPlayerData();
    }, 30000);
    return () => {
      clearInterval(refreshdata);
      clearTimeout(recheck);
    };
  }, [props.server]);

  function FetchPlayerData(timeout = 5000) {
    if (failedAttemptRef.current > 6) {
      return;
    }
    Fetch("https://api.ddoaudit.com/gamestatus/serverstatus", 5000)
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
          Fetch(
            "https://api.ddoaudit.com/gamestatus/populationoverview",
            timeout
          ).then((val) => {
            val.forEach((server) => {
              if (server.ServerName === props.server) {
                setCurrentPopulation(server.PlayerCount);
              }
            });
          });
          Fetch(
            "https://api.ddoaudit.com/players/" +
              (SERVER_LIST_LOWERCASE.includes(props.server.toLowerCase())
                ? props.server
                : ""),
            timeout
          )
            .then((val) => {
              setLastFetchTime(Date.now());
              setAttemptedPlayerFetch(true);
              if (VerifyPlayerData(val)) {
                props.triggerPopup(null);
                failedAttemptRef.current = 0;
                setFailedAttemptCount(failedAttemptRef.current);
                setPlayerData({
                  timestamp: Date.now(),
                  data: val,
                });
                setCurrentPopulation(val.Population);
                let anon = 0;
                val.Players.forEach((player) => {
                  if (player.Name === "Anonymous") anon++;
                });
                setCurrentAnonymous(anon);
              } else {
                failedAttemptRef.current++;
                setFailedAttemptCount(failedAttemptRef.current);
                if (failedAttemptRef.current > 5) {
                  props.triggerPopup({
                    title: "Something went wrong",
                    message:
                      "Pretty descriptive, I know. Try refreshing the page. If the issue continues, please report it.",
                    icon: "warning",
                    fullscreen: false,
                    reportMessage:
                      val === null
                        ? "Player data returned null"
                        : "Player data verification failed",
                  });
                  clearTimeout(recheck);
                  clearInterval(refreshdata);
                } else {
                  recheck = setTimeout(() => {
                    FetchPlayerData(10000);
                  }, 200);
                }
              }
            })
            .catch((err) => {
              failedAttemptRef.current++;
              setFailedAttemptCount(failedAttemptRef.current);
              setLastFetchTime(Date.now());
              setAttemptedPlayerFetch(true);
              if (failedAttemptRef.current > 3) {
                props.triggerPopup({
                  title: "Couldn't fetch player data",
                  message:
                    "Try refreshing the page. If the issue continues, please report it.",
                  submessage: err && err.toString(),
                  icon: "warning",
                  fullscreen: false,
                  reportMessage:
                    (err && err.toString()) ||
                    "Player data generic error (timeout?)",
                });
              } else {
                recheck = setTimeout(() => {
                  FetchPlayerData(10000);
                }, 250);
              }
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
              "Try refreshing the page. If the issue continues, please report it.",
            submessage: (err && err.toString()) || "Server status timeout",
            icon: "warning",
            fullscreen: false,
            reportMessage: (err && err.toString()) || "Server status timeout",
          });
        } else {
          recheck = setTimeout(() => {
            FetchPlayerData(10000);
          }, 250);
        }
      });
  }

  React.useEffect(() => {
    if (playerData.data === undefined || playerData.data === null) return;
    setPlayerCount(playerData.data.Players.length);
  }, [playerData]);

  React.useEffect(() => {
    let pinnedplayers = JSON.parse(localStorage.getItem("pinned-players"));
    if (pinnedplayers) {
      setPinnedPlayers(pinnedplayers);
    } else {
      setPinnedPlayers([]);
    }
  }, []);

  React.useEffect(() => {
    localStorage.setItem("pinned-players", JSON.stringify(pinnedPlayers));
  }, [pinnedPlayers]);

  function getServerNamePossessive() {
    return `${props.server}${props.server === "Thelanis" ? "'" : "'s"}`;
  }

  return (
    <div
      className={
        "content-container" + `${props.minimal ? " hide-on-mobile" : ""}`
      }
      style={{ minHeight: "700px", width: "706px" }}
    >
      <FilterBar
        minimal={props.minimal}
        currentServer={props.server}
        showNotifications={false}
        showSave={true}
        maxWidth={706}
        returnTo="/who"
        handleFilterButton={() => setFilterPanelVisible(!filterPanelVisible)}
        handleSaveButton={() => download()}
        closePanel={() => props.closePanel()}
        permalink={
          props.permalink +
          (globalFilterRef.current ? "&filter=" + globalFilterRef.current : "")
        }
        showRefreshButton={true}
        handleRefreshButton={() => refreshButtonHandler()}
      />
      {filterPanelVisible && (
        <div
          style={{
            zIndex: 99,
          }}
        >
          <div
            className="filter-panel-overlay"
            style={{
              display: filterPanelVisible ? "block" : "none",
            }}
            onClick={() => setFilterPanelVisible(false)}
          />
          <div
            className="filter-panel"
            style={{
              display: filterPanelVisible ? "block" : "none",
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
              className="nav-icon should-invert"
              onClick={() => setFilterPanelVisible(false)}
            />
            <div
              className="hide-on-mobile"
              style={{ width: "100%", height: "20px" }}
            />
            <ContentCluster
              title="Filter Players"
              smallBottomMargin
              noLink={true}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "left",
                  flexDirection: "column",
                  alignItems: "start",
                  gap: "10px",
                }}
              >
                <p style={{ fontSize: "1.3rem" }}>
                  The Group View feature organizes players by the group they're
                  in. Groups are distinguished by different colors. Players who
                  are not in a group (or that are in a group with only hirelings
                  or offline players) are not shown. Searching by name, guild,
                  or location will show any player that meets those criteria as
                  well as all players in their group.
                </p>
                <p style={{ fontSize: "1.3rem" }}>
                  When searching by name, guild, or location, you can separate
                  multiple queries with commas (,). For example: "
                  <span className="lfm-number">
                    Best Guild Ever,The Marketplace
                  </span>
                  " will show characters who are from the guild "Best Guild
                  Ever" or who are currently in "The Marketplace"
                </p>
                <a
                  className="faux-link"
                  style={{
                    fontSize: "1.2rem",
                    display: "flex",
                    flexDirection: "row",
                    flexWrap: "wrap",
                    gap: "10px",
                  }}
                  href={getLink()}
                  target="_blank"
                >
                  Link directly to this page with these filters
                </a>
              </div>
            </ContentCluster>
          </div>
        </div>
      )}
      {serverStatus !== false || ignoreServerStatus ? (
        paginatedPlayerData && filteredPlayerData ? (
          <div
            style={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <div>
              <div className="sr-only">
                {`The image below is a live preview of ${getServerNamePossessive()} Who panel where all online players are visible.`}
              </div>
              <CanvasWhoPanel
                minimal={props.minimal}
                data={filteredPlayerData}
                currentPopulation={currentPopulation}
                currentAnonymous={currentAnonymous}
                filters={activeFilters}
                classFilterStates={classFilterStates}
                includeRegion={includeRegion}
                exactMatch={exactMatch}
                globalFilter={globalFilter}
                minimumLevelFilter={minimumLevelFilter}
                maximumLevelFilter={maximumLevelFilter}
                handleGlobalFilter={(filter) => setGlobalFilter(filter)}
                handleMinimumLevelFilter={(val) => {
                  setMinimumLevelFilter(val);
                }}
                handleMaximumLevelFilter={(val) => {
                  setMaximumLevelFilter(val);
                }}
                handleClassFilter={(i) => {
                  handleClassFilter(i);
                }}
                handleAnyClass={() => {
                  handleAnyClass();
                }}
                handleIncludeRegion={() => {
                  handleIncludeRegion();
                }}
                handleExactMatch={() => {
                  handleExactMatch();
                }}
                handleOpenSettings={() =>
                  setFilterPanelVisible(!filterPanelVisible)
                }
                handleSort={(type) => {
                  handleCanvasSort(type);
                }}
              />
              <div className="top-content-padding hide-on-mobile" />
            </div>
          </div>
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
            {failedAttemptCount
              ? `Loading player data. Attempt ${failedAttemptCount + 1}...`
              : "Loading player data..."}
          </span>
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
                FetchPlayerData();
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
                    "User reported issue from who/" + props.server,
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

export default WhoPanel;
