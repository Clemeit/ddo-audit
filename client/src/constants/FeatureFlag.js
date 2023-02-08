import { getConfig, getValueFromLabel } from "../services/CaaS";

async function getFeatureFlag(flag) {
  const caas = await getConfig();
  return getValueFromLabel(caas, flag) === "true";
}

export { getFeatureFlag };
