import { KaikuAppConfiguration } from "./kaiku-app-configuration.model";

export const devEnvActive = (config: KaikuAppConfiguration) => config.nodeEnv === "development";
