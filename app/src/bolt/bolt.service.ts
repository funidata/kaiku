import { Injectable } from "@nestjs/common";
import { App, LogLevel } from "@slack/bolt";
import { StringIndexed } from "@slack/bolt/dist/types/helpers";
import { ConfigService } from "../common/config/config.service";
import { BoltLogger } from "./bolt-logger";

@Injectable()
export class BoltService {
  private bolt: App<StringIndexed>;

  constructor(private configService: ConfigService) {}

  async connect() {
    const { appToken, token, signingSecret } = this.configService.config.bolt;
    const logger = new BoltLogger();

    this.bolt = new App({
      appToken,
      token,
      signingSecret,
      socketMode: true,
      logger,
      logLevel: LogLevel.INFO,
    });

    await this.bolt.start();
  }

  async disconnect() {
    await this.bolt.stop();
  }

  getBolt(): App<StringIndexed> {
    return this.bolt;
  }
}
