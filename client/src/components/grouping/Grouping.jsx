import React from "react";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import Banner from "../global/Banner";
import { Fetch, VerifyPlayerAndLfmOverview } from "../../services/DataLoader";
import { ReactComponent as OnlineSVG } from "../../assets/global/online.svg";
import { ReactComponent as OfflineSVG } from "../../assets/global/offline.svg";
import { ReactComponent as PendingSVG } from "../../assets/global/pending.svg";
import { ReactComponent as PumpkinOnlineSVG } from "../../assets/global/pumpkin_green.svg";
import { ReactComponent as PumpkinOfflineSVG } from "../../assets/global/pumpkin_red.svg";
import { ReactComponent as PumpkinPendingSVG } from "../../assets/global/pumpkin_blue.svg";
import { ReactComponent as RegisterSVG } from "../../assets/global/register.svg";
import { ReactComponent as TimerSVG } from "../../assets/global/timer.svg";
import BannerMessage from "../global/BannerMessage";
import PopupMessage from "../global/PopupMessage";
import ContentCluster from "../global/ContentCluster";
import { Log } from "../../services/CommunicationService";
import RaidGroupCluster from "./RaidGroupCluster";
import ServerHook from "../../hooks/ServerHook";
import DataClassification from "../global/DataClassification";

const Grouping = () => {
  const TITLE = "DDO Live LFM Viewer";
  const SERVERS = ServerHook();

  const API_HOST = "http://137.184.2.181";
  const API_VERSION = "v1";
  const API_URL = `${API_HOST}/${API_VERSION}`;
  const LFM_API = `${API_URL}/lfms`;

  const [serverStatusData, setServerStatusData] = React.useState(null);
  const [notificationRuleCount, setNotificationRuleCount] = React.useState(0);
  const [allLfmData, setAllLfmData] = React.useState(null);

  // Popup message
  var [popupMessage, setPopupMessage] = React.useState(null);

  const EVENT_THEME = isSpookyTime();

  function isSpookyTime() {
    let dt = new Date();
    if (dt.getMonth() === 9 && dt.getDate() >= 4) {
      return "revels";
    }
    return "";
  }

  const PENDING =
    EVENT_THEME === "revels" ? (
      <PumpkinPendingSVG width="24px" height="24px" alt="unknown" />
    ) : (
      <PendingSVG alt="unknown" />
    );

  const ONLINE =
    EVENT_THEME === "revels" ? (
      <PumpkinOnlineSVG width="24px" height="24px" alt="online" />
    ) : (
      <OnlineSVG alt="online" />
    );

  const OFFLINE =
    EVENT_THEME === "revels" ? (
      <PumpkinOfflineSVG width="24px" height="24px" alt="offline" />
    ) : (
      <OfflineSVG alt="offline" />
    );

  function GetSVG(world) {
    if (world === undefined || world === null) return PENDING;
    if (!world.hasOwnProperty("Status")) return PENDING;
    switch (world.Status) {
      case 0:
        return OFFLINE;
      case 1:
        return ONLINE;
      default:
        return PENDING;
    }
  }

  function getMegaServerDescription() {
    if (allLfmData == null) {
      return (
        <p
          className="content-option-description"
          style={{ fontSize: "1.4rem" }}
        >
          Loading...
        </p>
      );
    }
    let lfmcount = 0;
    Object.entries(allLfmData).forEach(([server_name, server]) => {
      lfmcount += server.lfm_count;
    });

    let raidcount = 0;
    Object.entries(allLfmData).forEach(([server_name, server]) => {
      server.lfms.forEach((lfm) => {
        if (lfm.quest && lfm.quest.group_size === "Raid") raidcount++;
      });
    });

    return (
      <p className="content-option-description" style={{ fontSize: "1.4rem" }}>
        <span style={{ color: "var(--text-lfm-number)" }}>
          {`${lfmcount} LFM${lfmcount !== 1 ? "s" : ""}`}{" "}
        </span>
        {raidcount > 0 && `| ${raidcount} raid${raidcount !== 1 ? "s" : ""}`}
      </p>
    );
  }

  function GetServerDescription(name) {
    if (allLfmData == null) {
      return (
        <p
          className="content-option-description"
          style={{ fontSize: "1.4rem" }}
        >
          Loading...
        </p>
      );
    }
    if (!allLfmData)
      return (
        <p
          className="content-option-description"
          style={{ fontSize: "1.4rem" }}
        >
          <span style={{ color: "var(--text-lfm-number)" }}>0 LFMs </span>
        </p>
      );
    let lfmCount = Object.entries(allLfmData).filter(
      ([server_name, server]) => server_name === name.toLowerCase()
    )[0][1].lfm_count;

    let raidCount = 0;
    Object.entries(allLfmData).forEach(([server_name, server]) => {
      if (server_name === name.toLowerCase()) {
        Object.entries(server.lfms).forEach(([lfm_id, lfm]) => {
          if (lfm.quest && lfm.quest.group_size === "Raid") raidCount++;
        });
      }
    });

    return (
      <p className="content-option-description" style={{ fontSize: "1.4rem" }}>
        <span style={{ color: "var(--text-lfm-number)" }}>
          {`${lfmCount} LFM${lfmCount !== 1 ? "s" : ""}`}{" "}
        </span>
        {raidCount > 0 && `| ${raidCount} raid${raidCount !== 1 ? "s" : ""}`}
      </p>
    );
  }

  function refreshLfmData() {
    Fetch("https://api.ddoaudit.com/gamestatus/serverstatus", 5000)
      .then((val) => {
        setPopupMessage(null);
        setServerStatusData(val);
      })
      .catch((err) => {
        setPopupMessage({
          title: "Couldn't get server status",
          message:
            "We failed to look up server staus. Try refreshing the page. If the issue continues, please report it.",
          icon: "warning",
          fullscreen: false,
          reportMessage: (err && err.toString()) || "Server status error",
          submessage: (err && err.toString()) || "Server status error",
        });
        setServerStatusData(null);
      });

    Fetch(`${LFM_API}`, 5000)
      .then((val) => {
        setAllLfmData(val);
      })
      .catch((err) => {
        setPopupMessage({
          title: "Couldn't get LFM data",
          message:
            "We were unable to get LFM data. Try refreshing the page. If the issue continues, please report it.",
          icon: "warning",
          fullscreen: false,
          reportMessage: (err && err.toString()) || "LFM data error",
          submessage: (err && err.toString()) || "LFM data error",
        });
        setAllLfmData(null);
      });
  }

  React.useEffect(() => {
    refreshLfmData();
    const interval = setInterval(() => refreshLfmData(), 60000);

    setNotificationRuleCount(
      localStorage.getItem("notification-rules")
        ? JSON.parse(localStorage.getItem("notification-rules")).length
        : 0
    );

    return () => clearInterval(interval);
  }, []);

  function getRaidLfms() {
    if (allLfmData == null) return null;
    let raidLfms = [];
    allLfmData.forEach((server) => {
      server.lfms.forEach((lfm) => {
        if (lfm.quest) {
          if (lfm.quest.group_size === "Raid") {
            lfm.server_name = server.name;
            raidLfms.push(lfm);
          }
        }
      });
    });
    if (raidLfms.length !== 0) {
      return raidLfms.map((lfm, i) => (
        <Link
          to={"/grouping/" + lfm.server_name}
          key={i}
          className="nav-box shrinkable"
          onClick={() => {
            Log("Clicked raid LFM link", "Grouping");
          }}
        >
          <div className="nav-box-title">
            <h2 className="content-option-title">{lfm.quest.name}</h2>
          </div>
          <p
            className="content-option-description"
            style={{ fontSize: "1.5rem" }}
          >
            <span className="lfm-number">{lfm.server_name}</span> |{" "}
            {lfm.leader.name} |{" "}
            <span style={{ whiteSpace: "nowrap" }}>
              {`${lfm.members.length + 1} member${
                lfm.members.length + 1 !== 1 ? "s" : ""
              }`}
            </span>
          </p>
        </Link>
      ));
    }
    return null;
  }

  return (
    <div>
      <Helmet>
        <title>{TITLE}</title>
        <meta
          name="description"
          content="View a live LFM panel to find public LFMs - before you even log in! See which groups are currently looking for more players and what content is currently being run."
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
        title="Grouping"
        subtitle="Live LFM Viewer"
      />
      <PopupMessage
        page="grouping"
        messages={popupMessage}
        popMessage={() => {
          setPopupMessage(null);
        }}
      />
      <div className="content-container">
        <BannerMessage page="grouping" />
        <DataClassification classification="observed" />
        <div className="top-content-padding-small shrink-on-mobile" />
        <ContentCluster title="Select a Server">
          <div className="content-cluster-options">
            {SERVERS.map((name, i) => (
              <Link
                to={"/grouping/" + name.toLowerCase()}
                key={i}
                className="nav-box shrinkable server"
              >
                <div className="nav-box-title">
                  {serverStatusData
                    ? GetSVG(
                        serverStatusData.Worlds.filter(
                          (server) => server.Name === name
                        )[0]
                      )
                    : GetSVG()}
                  <h2 className="content-option-title">{name}</h2>
                </div>
                {GetServerDescription(name)}
              </Link>
            ))}
          </div>
        </ContentCluster>
        <ContentCluster title="Current Raids">
          <div className="content-cluster-options">
            {allLfmData ? (
              <RaidGroupCluster data={allLfmData} />
            ) : (
              <span className="content-cluster-description">
                Loading LFMs...
              </span>
            )}
          </div>
        </ContentCluster>
        <ContentCluster
          title={
            <>
              Notifications
              <div className="soon-tag" style={{ marginLeft: "1rem" }}>
                COMING SOON
              </div>
            </>
          }
          altTitle="Notifications"
          description={
            <div
              className="no-interact"
              style={{ textDecoration: "line-through" }}
            >
              You currently have{" "}
              <span style={{ color: "var(--text-lfm-number)" }}>
                {notificationRuleCount}
              </span>{" "}
              notification rule
              {notificationRuleCount !== 1 ? "s" : ""} setup. Configure
              notifications in the{" "}
              <Link to="/notifications">notification settings</Link>.
            </div>
          }
          noFade={true}
        />
        <ContentCluster title="See Also...">
          <div className="content-cluster-options">
            <Link
              to="/registration"
              className="nav-box shrinkable"
              style={{
                height: "auto",
                minHeight: "150px",
              }}
            >
              <div className="nav-box-title">
                <RegisterSVG className="nav-icon should-invert" />
                <h2 className="content-option-title">Register Characters</h2>
              </div>
              <p className="content-option-description">
                Add your characters for automatic LFM filtering and raid timer
                tracking.
              </p>
            </Link>
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

export default Grouping;
