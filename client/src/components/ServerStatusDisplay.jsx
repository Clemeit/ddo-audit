import React from "react";
import { ReactComponent as OnlineSVG } from "../assets/global/online.svg";
import { ReactComponent as OfflineSVG } from "../assets/global/offline.svg";
import { ReactComponent as PendingSVG } from "../assets/global/pending.svg";

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

function GetSVG(world) {
    if (!world.hasOwnProperty("Status")) return <PendingSVG />;
    switch (world.Status) {
        case 0:
            return <OfflineSVG />;
        case 1:
            return <OnlineSVG />;
        default:
            return <PendingSVG />;
    }
}

const ServerStatusDisplay = (props) => {
    function PrettyTime(dt) {
        return new Date(dt).toLocaleTimeString();
    }

    return (
        <div>
            <center>
                <h5 style={{ fontWeight: "bold" }}>
                    {"Server status " +
                        (props.data !== null &&
                        props.data.hasOwnProperty("LastUpdateTime")
                            ? "last updated " +
                              PrettyTime(props.data.LastUpdateTime)
                            : "loading...")}
                </h5>
            </center>
            <div
                style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "center",
                    flexWrap: "wrap",
                }}
            >
                {props.data && props.data.Worlds
                    ? props.data.Worlds.map((world, i) => (
                          <div key={i} className="server-status-indicator">
                              <div style={{ paddingRight: "5px" }}>
                                  {GetSVG(world)}
                              </div>
                              {world.Name}
                          </div>
                      ))
                    : ServerNames.map((world, i) => (
                          <div key={i} className="server-status-indicator">
                              <div style={{ paddingRight: "5px" }}>
                                  <PendingSVG />
                              </div>
                              {world}
                          </div>
                      ))}
            </div>
        </div>
    );
};

export default ServerStatusDisplay;
