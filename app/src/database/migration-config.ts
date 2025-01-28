import { DataSource } from "typeorm";

export default new DataSource({
  type: "postgres",
  host: process.env.DATABASE_HOST || "localhost",
  port: Number(process.env.DATABASE_PORT) || 5432,
  username: process.env.DATABASE_USERNAME || "postgres",
  password: process.env.DATABASE_PASSWORD || "postgres",
  database: process.env.DATABASE_NAME || "kaiku_dev",
  /**
   * If DATABASE_SSL_ENABLED env var is true, use sslmode=no-verify. Other SSL
   * modes are not supported. See
   * https://github.com/brianc/node-postgres/tree/master/packages/pg-connection-string#tcp-connections
   */
  ssl: process.env.DATABASE_SSL_ENABLED === "true" ? { rejectUnauthorized: false } : false,
  /**
   * Glob pattern is used to make this work both locally and in CI as it appears
   * that using no wildcards resolves to different paths between the two. This
   * is arguably a little iffy but perhaps sufficient.
   */
  migrations: ["**/migrations/*.{js,ts}"],
});
