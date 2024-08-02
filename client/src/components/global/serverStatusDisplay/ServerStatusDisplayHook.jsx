import { ReactComponent as OnlineSVG } from "assets/global/online.svg";
import { ReactComponent as OfflineSVG } from "assets/global/offline.svg";
import { ReactComponent as PendingSVG } from "assets/global/pending.svg";
import { ReactComponent as PumpkinOnlineSVG } from "assets/global/pumpkin_green.svg";
import { ReactComponent as PumpkinOfflineSVG } from "assets/global/pumpkin_red.svg";
import { ReactComponent as PumpkinPendingSVG } from "assets/global/pumpkin_blue.svg";
import { SERVER_LIST } from "constants/Servers";

const ServerStatusDisplayHook = (serverData) => {
  const [SERVER_DATA, LAST_FETCH_TIMESTAMP] = serverData;
  const EVENT_THEME = getEventTheme();

  function getEventTheme() {
    let dt = new Date();
    if (dt.getMonth() === 9 && dt.getDate() >= 4) {
      return "revels";
    }
    return "";
  }

  const PENDING_SVG =
    EVENT_THEME === "revels" ? (
      <PumpkinPendingSVG
        style={{ marginRight: "5px" }}
        width="24px"
        height="24px"
        alt="unknown"
      />
    ) : (
      <PendingSVG style={{ marginRight: "5px" }} alt="unknown" />
    );

  const ONLINE_SVG =
    EVENT_THEME === "revels" ? (
      <PumpkinOnlineSVG
        style={{ marginRight: "5px" }}
        width="24px"
        height="24px"
        alt="online"
      />
    ) : (
      <OnlineSVG style={{ marginRight: "5px" }} alt="online" />
    );

  const OFFLINE_SVG =
    EVENT_THEME === "revels" ? (
      <PumpkinOfflineSVG
        style={{ marginRight: "5px" }}
        width="24px"
        height="24px"
        alt="offline"
      />
    ) : (
      <OfflineSVG style={{ marginRight: "5px" }} alt="offline" />
    );

  function getSVGForWorld(world) {
    if (!world.hasOwnProperty("status")) return PENDING_SVG;
    switch (world.status) {
      case false:
        return (
          <>
            {OFFLINE_SVG}
            <span className="sr-only">{world.Name} is offline</span>
          </>
        );
      case true:
        return (
          <>
            {ONLINE_SVG}
            <span className="sr-only">{world.Name} is online</span>
          </>
        );
      default:
        return (
          <>
            {PENDING_SVG}
            <span className="sr-only">{world.Name} is loading</span>
          </>
        );
    }
  }

  function prettyTime(dt) {
    return new Date(dt).toLocaleTimeString();
  }

  function isServerDataValid() {
    if (SERVER_DATA == null) return false;
    if (Object.keys(SERVER_DATA).length === 0) return false;
    if (!Object.values(SERVER_DATA)[0].hasOwnProperty("status")) return false;
    return true;
  }

  function getContentClusterDescription() {
    if (!LAST_FETCH_TIMESTAMP) return "Loading...";

    // get most recently updated server
    let mostRecentUpdateTime = 0;
    Object.entries(serverData).forEach(([serverName, serverData]) => {
      if (serverData.last_updated > mostRecentUpdateTime) {
        mostRecentUpdateTime = serverData.last_updated;
      }
    });
    return (
      "Server status was last checked at " + prettyTime(LAST_FETCH_TIMESTAMP)
    );
  }

  function toSentenceCase(str) {
    if (str === null) return "";
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  function getServerStatusDisplay() {
    if (!LAST_FETCH_TIMESTAMP)
      return SERVER_LIST.map((world, i) => (
        <div key={i} className="server-status-indicator">
          {PENDING_SVG}
          {world}
        </div>
      ));

    return Object.entries(SERVER_DATA).map(([serverName, serverData], i) => (
      <div key={i} className="server-status-indicator">
        {getSVGForWorld(serverData)}
        {toSentenceCase(serverName)}
      </div>
    ));
  }

  return {
    getContentClusterDescription,
    getServerStatusDisplay,
  };
};

export default ServerStatusDisplayHook;
