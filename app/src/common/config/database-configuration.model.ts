import { IsBoolean, IsPort, IsString } from "class-validator";

/**
 * Database configuration model.
 */
export class DatabaseConfiguration {
  @IsString()
  name = process.env.DATABASE_NAME;

  @IsString()
  host = process.env.DATABASE_HOST;

  @IsPort()
  port = parseInt(process.env.DATABASE_PORT);

  @IsString()
  username = process.env.DATABASE_USERNAME;

  @IsString()
  password = process.env.DATABASE_PASSWORD;

  @IsBoolean()
  sslEnabled = process.env.DATABASE_SSL_ENABLED === "true";
}
