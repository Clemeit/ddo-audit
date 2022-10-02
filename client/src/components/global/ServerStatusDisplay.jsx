import React from "react";
import { ReactComponent as OnlineSVG } from "../../assets/global/online.svg";
import { ReactComponent as OfflineSVG } from "../../assets/global/offline.svg";
import { ReactComponent as PendingSVG } from "../../assets/global/pending.svg";
import { ReactComponent as PumpkinOnlineSVG } from "../../assets/global/pumpkin_green.svg";
import { ReactComponent as PumpkinOfflineSVG } from "../../assets/global/pumpkin_red.svg";
import { ReactComponent as PumpkinPendingSVG } from "../../assets/global/pumpkin_blue.svg";
import ContentCluster from "./ContentCluster";

const ServerNames = [
    "Argonnessen",
    "Cannith",
    "Ghallanda",
    "Khyber",
    "Orien",
    "Sarlona",
    "Thelanis",
    "Wayfinder",
    "Hardcore",
];

const ServerStatusDisplay = (props) => {
    const EVENT_THEME = isSpookyTime();

    function isSpookyTime() {
        let dt = new Date();
        if (dt.getMonth() === 9 && dt.getDate() >= 5) {
            return "revels";
        }
        return "";
    }

    const PENDING =
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

    const ONLINE =
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

    const OFFLINE =
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

    function GetSVG(world) {
        if (!world.hasOwnProperty("Status")) return PENDING;
        switch (world.Status) {
            case 0:
                return (
                    <>
                        {OFFLINE}
                        <span className="sr-only">{world.Name} is offline</span>
                    </>
                );
            case 1:
                return (
                    <>
                        {ONLINE}
                        <span className="sr-only">{world.Name} is online</span>
                    </>
                );
            default:
                return (
                    <>
                        {PENDING}
                        <span className="sr-only">{world.Name} is loading</span>
                    </>
                );
        }
    }

    function PrettyTime(dt) {
        return new Date(dt).toLocaleTimeString();
    }

    return (
        <ContentCluster
            title="Server Status"
            description={
                props.data !== null &&
                props.data.hasOwnProperty("LastUpdateTime")
                    ? "Server status was last checked at " +
                      PrettyTime(props.data.LastUpdateTime)
                    : "Loading..."
            }
        >
            <div className="server-status-container">
                {props.data && props.data.Worlds
                    ? props.data.Worlds.map((world, i) => (
                          <div key={i} className="server-status-indicator">
                              {GetSVG(world)}
                              {world.Name}
                          </div>
                      ))
                    : ServerNames.map((world, i) => (
                          <div key={i} className="server-status-indicator">
                              <div>{props.data ? OFFLINE : PENDING}</div>
                              {world}
                          </div>
                      ))}
            </div>
        </ContentCluster>
    );
};

export default ServerStatusDisplay;
