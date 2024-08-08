import ContentCluster from "components/global/ContentCluster";
import useServerStatusDisplay from "components/global/serverStatusDisplay/useServerStatusDisplay";
import { GameStatusModel } from "models/GameModel";

interface ServerStatusDisplayProps {
    gameStatusData: GameStatusModel;
    isLoaded: boolean;
    isError: boolean;
}

const ServerStatusDisplay: React.FC<ServerStatusDisplayProps> = ({
    gameStatusData,
    isLoaded,
    isError,
}) => {
    const { getContentClusterDescription, getServerStatusDisplay } =
        useServerStatusDisplay(gameStatusData, isLoaded, isError);

    return (
        <ContentCluster
            title="Server Status"
            description={getContentClusterDescription()}
        >
            <div className="server-status-container">
                {getServerStatusDisplay()}
            </div>
        </ContentCluster>
    );
};

export default ServerStatusDisplay;
