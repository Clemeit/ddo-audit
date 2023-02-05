import React from "react";
import { getFeatureFlag } from "../constants/FeatureFlag";

const FeatureFlagHook = (flag) => {
    const [result, setResult] = React.useState(false);

    React.useEffect(() => {
        async function waitForFlags() {
            let val = await getFeatureFlag(flag);
            setResult(val);
        }
        waitForFlags();
    }, []);

    return result;
};

export default FeatureFlagHook;
