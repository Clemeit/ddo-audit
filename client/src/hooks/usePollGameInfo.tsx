import { useState, useEffect } from "react";
import { GameStatusModel } from "models/GameModel";
import usePolling from "hooks/usePolling";

/**
 * Fetch the game status data from the server.
 * @returns The game status data and error state.
 */
const useGameInfo = () => {
    const HOST = process.env.REACT_APP_API_HOST;
    const API_VERSION = process.env.REACT_APP_API_VERSION;
    const GAME_STATUS_URL = `${HOST}/${API_VERSION}/game`;
    let refreshInterval = 5000;

    const [gameStatusData, setGameStatusData] = useState<
        GameStatusModel | undefined
    >(undefined);
    const [isError, setIsError] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);

    usePolling({
        url: GAME_STATUS_URL,
        refreshInterval: refreshInterval,
        ceaseOnError: false,
        callback: (data: GameStatusModel) => {
            setGameStatusData(data);
            setIsLoaded(true);
        },
        onError: () => setIsError(true),
    });

    // Return the data:
    return {
        gameStatusData,
        isError,
        isLoaded,
    };
};

export default useGameInfo;
