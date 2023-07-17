import { getConfig, getValueFromLabel } from "../services/CaaS";

async function getFeatureFlag(flag, lifetime) {
  const caas = await getConfig(lifetime);
  return getValueFromLabel(caas, flag) === "true";
}

export { getFeatureFlag };
