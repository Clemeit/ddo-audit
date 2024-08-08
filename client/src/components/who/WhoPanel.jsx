import React from "react";
import {
  Fetch,
  VerifyCharacterData as verifyCharacterData,
} from "../../services/DataLoader";
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
  const MAX_LEVEL = 32;
  const PAGE_SIZE = 10;
  const REFRESH_LFM_INTERVAL = 5; //seconds
  const API_HOST = "https://api.hcnxsryjficudzazjxty.com";
  const API_VERSION = "v1";
  const API_URL = `${API_HOST}/${API_VERSION}`;
  const LFM_API = `${API_URL}/characters`;

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
  const [characterData, setCharacterData] = React.useState({
    timestamp: 0,
    data: null,
  });
  const [currentPopulation, setCurrentPopulation] = React.useState(null);
  const [currentAnonymous, setCurrentAnonymous] = React.useState(null);
  const [filteredCharacterData, setFilteredCharacterData] =
    React.useState(null);
  const [paginatedCharacterData, setPaginatedCharacterData] =
    React.useState(null);
  const [characterCount, setCharacterCount] = React.useState(null);
  const [adjustedCharacterCount, setAdjustedCharacterCount] =
    React.useState(null);
  const [lastFetchTime, setLastFetchTime] = React.useState(null);
  const [attemptedCharacterFetch, setAttemptedCharacterFetch] =
    React.useState(null);
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

  const [expandedCharacters, setExpandedCharacters] = React.useState([]);
  const [pinnedCharacters, setPinnedCharacters] = React.useState([]);

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

  function applyFilters(data) {
    // Apply sorting
    if (sortingMethod === "level") {
      if (sortingDirection === "ascending") {
        data.sort((a, b) => a.total_level - b.total_level);
      } else {
        data.sort((a, b) => b.total_level - a.total_level);
      }
    } else if (sortingMethod === "guild") {
      if (sortingDirection === "ascending") {
        data.sort((a, b) => a.guild.localeCompare(b.guild));
      } else {
        data.sort((a, b) => b.guild.localeCompare(a.guild));
      }
    } else if (sortingMethod === "location") {
      if (sortingDirection === "ascending") {
        data.sort((a, b) => {
          if (a.location.name == null || b.location.name == null) return 0;
          return a.location.name.localeCompare(b.location.name);
        });
      } else {
        data.sort((a, b) => {
          if (a.location.name == null || b.location.name == null) return 0;
          return b.location.name.localeCompare(a.location.name);
        });
      }
    } else if (sortingMethod === "inparty") {
      if (sortingDirection === "ascending") {
        data.sort((a, b) => a.is_in_party - b.is_in_party);
      } else {
        data.sort((a, b) => b.is_in_party - a.is_in_party);
      }
    } else if (sortingMethod === "groupid") {
      data.sort((a, b) => a.group_id.localeCompare(b.group_id));
    } else if (sortingMethod === "class") {
      if (sortingDirection === "ascending") {
        data.sort((a, b) => {
          let astring = "";
          a.classes.forEach((c) => {
            astring = astring + (c.name || "");
          });
          let bstring = "";
          b.classes.forEach((c) => {
            bstring = bstring + (c.name || "");
          });
          return astring.localeCompare(bstring);
        });
      } else {
        data.sort((a, b) => {
          let astring = "";
          a.classes.forEach((c) => {
            astring = astring + (c.name || "");
          });
          let bstring = "";
          b.classes.forEach((c) => {
            bstring = bstring + (c.name || "");
          });
          return bstring.localeCompare(astring);
        });
      }
    } else {
      if (sortingDirection === "ascending") {
        data.sort((a, b) => a.name.localeCompare(b.name));
      } else {
        data.sort((a, b) => b.name.localeCompare(a.name));
      }
    }

    // Apply filters
    data = data.filter(
      (character) => character.name !== "Anonymous" && character.name !== ""
    );

    // If sortingMethod === "groupid", we want to filter out all characters not
    // in a party, and all characters where their party is only themselves.
    if (sortingMethod === "groupid") {
      data = data.filter(
        (character) => character.group_id !== null && character.group_id !== "0"
      );

      data = data.filter((character) => {
        return (
          data.filter(
            (innerCharacter) => innerCharacter.group_id === character.group_id
          ).length > 1
        );
      });
    }

    // if (activeFilters !== null && activeFilters.length !== 0) {
    let passingGroupIds = [];
    const firstPassData = data.filter((character) => {
      let pass = false;

      // Global filters
      let splt = globalFilter.split(",");
      splt.forEach((f) => {
        const trimmedFilter = f.trim();
        let localmatch = false;
        if (exactMatch) {
          if (character.name === trimmedFilter) {
            localmatch = true;
          }
          if (
            character.location.name &&
            character.location.name === trimmedFilter
          ) {
            localmatch = true;
          }
          if (includeRegion) {
            if (
              character.location.name &&
              character.location.region === trimmedFilter
            ) {
              localmatch = true;
            }
          }
          if (character.guild === trimmedFilter) {
            localmatch = true;
          }
        } else {
          if (
            character.name.toLowerCase().includes(trimmedFilter.toLowerCase())
          ) {
            localmatch = true;
          }
          if (
            character.location.name &&
            character.location.name
              .toLowerCase()
              .includes(trimmedFilter.toLowerCase())
          ) {
            localmatch = true;
          }
          if (includeRegion) {
            if (
              character.location.name &&
              character.location.region
                .toLowerCase()
                .includes(trimmedFilter.toLowerCase())
            ) {
              localmatch = true;
            }
          }
          if (
            character.guild.toLowerCase().includes(trimmedFilter.toLowerCase())
          ) {
            localmatch = true;
          }
        }
        pass = pass || localmatch;
      });

      if (character.total_level < minimumLevelFilter) pass = false;
      if (character.total_level > maximumLevelFilter) pass = false;

      let classresult = false;
      classFilterStates.forEach((cls, index) => {
        if (cls === true) {
          let result = false;
          character.classes.forEach((cls) => {
            if (cls.name !== null) {
              if (cls.name.toLowerCase() === CLASS_NAMES[index].toLowerCase()) {
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
          !passingGroupIds.includes(character.group_id) &&
          character.group_id !== "0"
        ) {
          passingGroupIds.push(character.group_id);
        }
      }

      return pass;
    });
    console.log(passingGroupIds);
    if (sortingMethod === "groupid") {
      data = data.filter((character) =>
        passingGroupIds.includes(character.group_id)
      );
      data = data.sort((a, b) => {
        if (a.group_id === b.group_id) {
          if (a.total_level === b.total_level) {
            return a.name.localeCompare(b.name);
          } else {
            return a.total_level - b.total_level;
          }
        } else {
          return a.group_id.localeCompare(b.group_id);
        }
      });
    } else {
      data = firstPassData;
    }
    // } else {
    //     // Pull out starred cahracters to be inserted at the top later
    //     let starredcahracters = data.filter((p) => IsStarred(p));
    //     data = data.filter((p) => !IsStarred(p));
    //     data = [...starredcahracters, ...data];
    // }

    // Pull out starred cahracters to be inserted at the top later
    let starredCharacters = data.filter((p) => isStarred(p));
    data = data.filter((p) => !isStarred(p));
    data = [...starredCharacters, ...data];

    return data;
  }

  function isExpanded(character) {
    let val = false;
    expandedCharacters.forEach((p) => {
      if (p.Name === character.name) val = true;
    });
    return val;
  }

  function isStarred(character) {
    let val = false;
    pinnedCharacters.forEach((p) => {
      if (p.name === character.name && p.server === currentServer) val = true;
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
    if (characterCount === 0) {
      return "Maybe they're all anonymous.";
    } else {
      return "Are you one of them?";
    }
  }

  // Apply filter after filter change
  React.useEffect(() => {
    if (characterData == null || characterData.data == null) return;
    setFilteredCharacterData({
      last_updated: characterData.data.last_updated,
      characters: applyFilters(characterData.data.characters),
    });
  }, [
    globalFilter,
    minimumLevelFilter,
    maximumLevelFilter,
    activeFilters,
    characterData,
    sortingMethod,
    sortingDirection,
    pinnedCharacters,
    classFilterStates,
    includeRegion,
    exactMatch,
  ]);

  React.useEffect(() => {
    if (filteredCharacterData == null) return;
    setPaginatedCharacterData(
      filteredCharacterData.characters.slice(
        Math.max(0, pageNumber * PAGE_SIZE),
        Math.min(
          pageNumber * PAGE_SIZE + PAGE_SIZE,
          filteredCharacterData.characters.length
        )
      )
    );
  }, [filteredCharacterData, pageNumber]);

  const lastManualLookupTimeRef = React.useRef(0);
  const refreshButtonAngleRef = React.useRef(null);
  function refreshButtonHandler() {
    if (Date.now() - lastManualLookupTimeRef.current > 3000) {
      fetchCharacterData();
      refreshButtonAngleRef.current += 360;
      $("#who-refresh-button").css({
        transform: `rotate(${refreshButtonAngleRef.current}deg)`,
      });
      Log("Manual character refresh", "");
      lastManualLookupTimeRef.current = Date.now();
    }
  }

  // Let's get some data
  let recheck; // TODO: Clearing this timeout doesn't work
  let refreshdata;
  React.useEffect(() => {
    clearTimeout(recheck); // TODO: Clearing this timeout doesn't work
    setFilteredCharacterData(null);
    if (!props.server) return;

    fetchCharacterData();

    refreshdata = setInterval(() => {
      fetchCharacterData();
    }, REFRESH_LFM_INTERVAL * 1000);
    return () => {
      clearInterval(refreshdata);
      clearTimeout(recheck);
    };
  }, [props.server]);

  function fetchCharacterData(timeout = 5000) {
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
                setCurrentPopulation(server.character_count);
              }
            });
          });
          Fetch(
            LFM_API +
              "/" +
              (SERVER_LIST_LOWERCASE.includes(props.server.toLowerCase())
                ? props.server.toLowerCase()
                : ""),
            timeout
          )
            .then((val) => {
              setLastFetchTime(Date.now());
              setAttemptedCharacterFetch(true);
              if (verifyCharacterData(val)) {
                props.triggerPopup(null);
                failedAttemptRef.current = 0;
                setFailedAttemptCount(failedAttemptRef.current);
                // Convert val.characters to array:
                let characters = [];
                Object.entries(val.characters).forEach(([_, character]) => {
                  characters.push(character);
                });
                val.characters = characters;
                setCharacterData({
                  timestamp: Date.now(),
                  data: val,
                });
                setCurrentPopulation(val.character_count);
                let anon = 0;
                Object.entries(val.characters).forEach(([_, character]) => {
                  if (character.name === "Anonymous") anon++;
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
                        ? "Character data returned null"
                        : "Character data verification failed",
                  });
                  clearTimeout(recheck);
                  clearInterval(refreshdata);
                } else {
                  recheck = setTimeout(() => {
                    fetchCharacterData(10000);
                  }, 200);
                }
              }
            })
            .catch((err) => {
              failedAttemptRef.current++;
              setFailedAttemptCount(failedAttemptRef.current);
              setLastFetchTime(Date.now());
              setAttemptedCharacterFetch(true);
              if (failedAttemptRef.current > 3) {
                props.triggerPopup({
                  title: "Couldn't fetch character data",
                  message:
                    "Try refreshing the page. If the issue continues, please report it.",
                  submessage: err && err.toString(),
                  icon: "warning",
                  fullscreen: false,
                  reportMessage:
                    (err && err.toString()) ||
                    "Character data generic error (timeout?)",
                });
              } else {
                recheck = setTimeout(() => {
                  fetchCharacterData(10000);
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
            fetchCharacterData(10000);
          }, 250);
        }
      });
  }

  React.useEffect(() => {
    if (characterData.data === undefined || characterData.data === null) return;
    setCharacterCount(characterData.data.character_count);
  }, [characterData]);

  React.useEffect(() => {
    let pinnedCharacters = JSON.parse(localStorage.getItem("pinned-players"));
    if (pinnedCharacters) {
      setPinnedCharacters(pinnedCharacters);
    } else {
      setPinnedCharacters([]);
    }
  }, []);

  React.useEffect(() => {
    localStorage.setItem("pinned-players", JSON.stringify(pinnedCharacters));
  }, [pinnedCharacters]);

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
              title="Filter Characters"
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
                  The Group View feature organizes characters by the group
                  they're in. Groups are distinguished by different colors.
                  Characters who are not in a group (or that are in a group with
                  only hirelings or offline characters) are not shown. Searching
                  by name, guild, or location will show any character that meets
                  those criteria as well as all characters in their group.
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
        paginatedCharacterData && filteredCharacterData ? (
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
                {`The image below is a live preview of ${getServerNamePossessive()} Who panel where all online characters are visible.`}
              </div>
              <CanvasWhoPanel
                minimal={props.minimal}
                data={filteredCharacterData}
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
              ? `Loading character data. Attempt ${failedAttemptCount + 1}...`
              : "Loading character data..."}
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
                fetchCharacterData();
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
