import { IsIn, ValidateNested } from "class-validator";
import { DatabaseConfiguration } from "./database-configuration.model";

/**
 * Global app configuration model.
 */
export class KaikuAppConfiguration {
  @IsIn(["development", "production"])
  nodeEnv: "development" | "production";

  @ValidateNested()
  database = new DatabaseConfiguration();
}
