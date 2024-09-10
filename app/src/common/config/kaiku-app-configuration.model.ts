import { IsIn, ValidateNested } from "class-validator";
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
}
