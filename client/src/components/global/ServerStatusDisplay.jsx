import React from "react";
import { ReactComponent as OnlineSVG } from "../../assets/global/online.svg";
import { ReactComponent as OfflineSVG } from "../../assets/global/offline.svg";
import { ReactComponent as PendingSVG } from "../../assets/global/pending.svg";
import ContentCluster from "./ContentCluster";
import { IsTheBigDay } from "../../services/TheBigDay";

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
            return (
                <>
                    <OfflineSVG style={{ marginRight: "5px" }} alt="offline" />
                    <span className="sr-only">{world.Name} is offline</span>
                </>
            );
        case 1:
            return (
                <>
                    <OnlineSVG style={{ marginRight: "5px" }} alt="online" />
                    <span className="sr-only">{world.Name} is online</span>
                </>
            );
        default:
            return (
                <>
                    <PendingSVG style={{ marginRight: "5px" }} alt="unknown" />
                    <span className="sr-only">{world.Name} is loading</span>
                </>
            );
    }
}

const ServerStatusDisplay = (props) => {
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
                {IsTheBigDay() ? (
                    <div className="server-status-indicator">
                        <OnlineSVG
                            style={{ marginRight: "5px" }}
                            alt="online"
                        />
                        <span className="sr-only">
                            Eberron Mega-Server is online
                        </span>
                        Eberron Mega-Server
                    </div>
                ) : props.data && props.data.Worlds ? (
                    props.data.Worlds.map((world, i) => (
                        <div key={i} className="server-status-indicator">
                            {GetSVG(world)}
                            {world.Name}
                        </div>
                    ))
                ) : (
                    ServerNames.map((world, i) => (
                        <div key={i} className="server-status-indicator">
                            <div style={{ paddingRight: "5px" }}>
                                {props.data ? (
                                    <OfflineSVG alt="offline" />
                                ) : (
                                    <PendingSVG alt="unknown" />
                                )}
                            </div>
                            {world}
                        </div>
                    ))
                )}
            </div>
        </ContentCluster>
    );
};

export default ServerStatusDisplay;
