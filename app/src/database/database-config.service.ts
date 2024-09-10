import { Injectable } from "@nestjs/common";
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from "@nestjs/typeorm";
import { ConfigService } from "../common/config/config.service";
import { devEnvActive } from "../common/config/env-utils";

@Injectable()
export class DatabaseConfigService implements TypeOrmOptionsFactory {
  constructor(private configService: ConfigService) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    const { config } = this.configService;
    const { database } = config;
    const { host, name, password, port, username, sslEnabled } = database;

    return {
      type: "postgres",
      host,
      port,
      username,
      password,
      database: name,
      autoLoadEntities: true,
      synchronize: devEnvActive(config),
      /**
       * If SSL is enabled, use sslmode=no-verify. Other SSL modes are
       * not supported.
       * See https://github.com/brianc/node-postgres/tree/master/packages/pg-connection-string#tcp-connections
       */
      ssl: sslEnabled ? { rejectUnauthorized: false } : false,
    };
  }
}
