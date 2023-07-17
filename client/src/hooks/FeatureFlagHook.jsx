import React from "react";
import { getFeatureFlag } from "../constants/FeatureFlag";

const FeatureFlagHook = (flag, lifetime) => {
  const [result, setResult] = React.useState(null);

  React.useEffect(() => {
    async function waitForFlags() {
      let val = await getFeatureFlag(flag, lifetime);
      setResult(val);
    }
    waitForFlags();
  }, []);

  return result;
};

export default FeatureFlagHook;
