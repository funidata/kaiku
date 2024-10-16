import { IsBoolean, IsIn, ValidateNested } from "class-validator";
import { BoltConfiguration } from "./bolt-configuration.model";
import { DatabaseConfiguration } from "./database-configuration.model";

/**
 * Global app configuration model.
 */
export class KaikuAppConfiguration {
  @IsIn(["development", "production"])
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  nodeEnv: "development" | "production" = process.env.NODE_ENV as any;

  @ValidateNested()
  database = new DatabaseConfiguration();

  @ValidateNested()
  bolt = new BoltConfiguration();

  @IsBoolean()
  hideDevTools = process.env.HIDE_DEV_TOOLS === "true";
}
