import ContentCluster from "components/global/ContentCluster";
import ServerStatusDisplayHook from "components/global/serverStatusDisplay/ServerStatusDisplayHook";

const ServerStatusDisplay = (props) => {
  const { getContentClusterDescription, getServerStatusDisplay } =
    ServerStatusDisplayHook(props.serverStatusData);

  return (
    <ContentCluster
      title="Server Status"
      description={getContentClusterDescription()}
    >
      <div className="server-status-container">{getServerStatusDisplay()}</div>
    </ContentCluster>
  );
};

export default ServerStatusDisplay;
