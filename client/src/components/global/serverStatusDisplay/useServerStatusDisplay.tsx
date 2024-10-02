import { useEffect, useState } from "react";
import { ReactComponent as OnlineSVG } from "assets/global/online.svg";
import { ReactComponent as OfflineSVG } from "assets/global/offline.svg";
import { ReactComponent as PendingSVG } from "assets/global/pending.svg";
import { ReactComponent as PumpkinOnlineSVG } from "assets/global/pumpkin_green.svg";
import { ReactComponent as PumpkinOfflineSVG } from "assets/global/pumpkin_red.svg";
import { ReactComponent as PumpkinPendingSVG } from "assets/global/pumpkin_blue.svg";
import { SERVER_LIST } from "constants/Servers";
import { GameStatusModel, ServerStatusModel } from "models/GameModel";

const useServerStatusDisplay = (
    gameStatusData: GameStatusModel,
    isLoaded: boolean,
    isError: boolean
) => {
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
                title="unknown"
            />
        ) : (
            <PendingSVG style={{ marginRight: "5px" }} title="unknown" />
        );

    const ONLINE_SVG =
        EVENT_THEME === "revels" ? (
            <PumpkinOnlineSVG
                style={{ marginRight: "5px" }}
                width="24px"
                height="24px"
                title="online"
            />
        ) : (
            <OnlineSVG style={{ marginRight: "5px" }} title="online" />
        );

    const OFFLINE_SVG =
        EVENT_THEME === "revels" ? (
            <PumpkinOfflineSVG
                style={{ marginRight: "5px" }}
                width="24px"
                height="24px"
                title="offline"
            />
        ) : (
            <OfflineSVG style={{ marginRight: "5px" }} title="offline" />
        );

    function getSVGForWorld(serverName: string, serverData: ServerStatusModel) {
        const updateTime = new Date(serverData.last_status_check * 1000);
        const elapsedSeconds =
            (new Date().getTime() - updateTime.getTime()) / 1000;
        const notRecent = elapsedSeconds > 120;

        if (notRecent) {
            return (
                <>
                    {PENDING_SVG}
                    <span className="sr-only">{serverName} is loading</span>
                </>
            );
        }

        switch (serverData.is_online) {
            case false:
                return (
                    <>
                        {OFFLINE_SVG}
                        <span className="sr-only">{serverName} is offline</span>
                    </>
                );
            case true:
                return (
                    <>
                        {ONLINE_SVG}
                        <span className="sr-only">{serverName} is online</span>
                    </>
                );
            default:
                return (
                    <>
                        {PENDING_SVG}
                        <span className="sr-only">{serverName} is loading</span>
                    </>
                );
        }
    }

    function prettyTime(timestamp: number) {
        return new Date(timestamp).toLocaleTimeString();
    }

    function getMostRecentUpdateTime() {
        // get most recently updated server
        let mostRecentUpdateTime = new Date(0);
        if (!gameStatusData || !gameStatusData.servers)
            return mostRecentUpdateTime;
        Object.values(gameStatusData.servers).forEach(
            (serverData: ServerStatusModel) => {
                let newDate = new Date(serverData.last_status_check * 1000);
                if (newDate.getTime() > mostRecentUpdateTime.getTime()) {
                    mostRecentUpdateTime = newDate;
                }
            }
        );
        return mostRecentUpdateTime;
    }

    function getContentClusterDescription() {
        if (!gameStatusData) return "Loading...";
        const mostRecentUpdateTime = getMostRecentUpdateTime();
        const elapsedSeconds =
            (new Date().getTime() - mostRecentUpdateTime.getTime()) / 1000;
        const notRecent = elapsedSeconds > 120;
        return (
            <span>
                Server status was last checked at{" "}
                <span style={notRecent ? { color: "red" } : {}}>
                    {prettyTime(mostRecentUpdateTime.getTime())}
                </span>
            </span>
        );
    }

    function toSentenceCase(str: string) {
        if (str === null) return "";
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    function getServerStatusDisplay() {
        if (!gameStatusData || !isLoaded)
            return SERVER_LIST.map((world, i) => (
                <div key={i} className="server-status-indicator">
                    {PENDING_SVG}
                    {world}
                </div>
            ));

        return Object.entries(gameStatusData.servers)
            .sort(([serverNameA], [serverNameB]) => {
                if (serverNameA === "hardcore") return 1;
                return serverNameA.localeCompare(serverNameB);
            })
            .map(([serverName, serverData], i) => (
                <div key={i} className="server-status-indicator">
                    {getSVGForWorld(serverName, serverData)}
                    {toSentenceCase(serverName)}
                </div>
            ));
    }

    return {
        getContentClusterDescription,
        getServerStatusDisplay,
    };
};

export default useServerStatusDisplay;
