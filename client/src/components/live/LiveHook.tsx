import { useState, useEffect } from "react";

// model for the API call
interface ServerStatusModel {
    status: boolean;
    index: number;
    last_updated: number;
}

interface ServerStatusAggregateModel {
    argonnessen: ServerStatusModel;
    cannith: ServerStatusModel;
    ghallanda: ServerStatusModel;
    khyber: ServerStatusModel;
    orien: ServerStatusModel;
    sarlona: ServerStatusModel;
    thelanis: ServerStatusModel;
    wayfinder: ServerStatusModel;
    hardcore: ServerStatusModel;
}

interface LiveDataApiModel {
    server_status: ServerStatusAggregateModel;
}

function usePolling(options: {
    url: string;
    refreshInterval: number;
    callback?: (data: [any, number]) => void;
    onError?: (error: any) => void;
    // retries?: number;
}): void {
    const { url, refreshInterval, callback, onError } = options;
    useEffect(() => {
        let isMounted = true;
        let timeoutId: NodeJS.Timeout;

        const fetchData = async () => {
            try {
                const response = await fetch(url);
                const data = await response.json();
                if (isMounted) {
                    callback?.([data, Date.now()]);
                }
            } catch (error) {
                onError?.(error);
            }
            if (isMounted) {
                timeoutId = setTimeout(fetchData, refreshInterval);
            }
        };

        fetchData();

        return () => {
            isMounted = false;
            clearTimeout(timeoutId);
        };
    }, [url, refreshInterval]);
}

const LiveHook = () => {
    // There should only be a single API call for this page.
    // The backend can handle putting all of the appropriate data together.
    const HOST = process.env.REACT_APP_API_HOST;
    const API_VERSION = process.env.REACT_APP_API_VERSION;
    const SERVER_STATUS_URL = `${HOST}/${API_VERSION}/servers`;
    let refreshInterval = 1000;

    const [serverStatusData, setServerStatusData] = useState<
        [ServerStatusAggregateModel?, number?]
    >([undefined, undefined]);

    usePolling({
        url: SERVER_STATUS_URL,
        refreshInterval: refreshInterval,
        callback: setServerStatusData,
    });

    // Return the data:
    return {
        serverStatusData,
    };
};

export default LiveHook;
