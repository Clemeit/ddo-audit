import React from "react";
import { getServers, SERVER_LIST } from "../constants/Servers";

const ServerHook = () => {
  const [servers, setServers] = React.useState(SERVER_LIST);

  React.useEffect(() => {
    async function waitForServers() {
      let updatedServers = await getServers();
      setServers(updatedServers);
    }
    waitForServers();
  }, []);

  return servers;
};

export default ServerHook;
