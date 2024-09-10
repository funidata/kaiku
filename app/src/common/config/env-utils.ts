import { KaikuAppConfiguration } from "./models/kaiku-app-configuration.model";

export const devEnvActive = (config: KaikuAppConfiguration) => config.nodeEnv === "development";
