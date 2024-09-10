import { IsIn } from "class-validator";

/**
 * Global app configuration model.
 */
export class KaikuAppConfiguration {
  @IsIn(["development", "production"])
  nodeEnv: "development" | "production";
}
