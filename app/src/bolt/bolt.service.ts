import { Injectable, Logger } from "@nestjs/common";
import { App, LogLevel } from "@slack/bolt";
import { StringIndexed } from "@slack/bolt/dist/types/helpers";
import { ConfigService } from "../common/config/config.service";
import { BoltLogger } from "./bolt-logger";

@Injectable()
export class BoltService {
  private bolt: App<StringIndexed>;
  private logger = new Logger(BoltService.name);

  constructor(private configService: ConfigService) {}

  async connect() {
    const { appToken, token, signingSecret } = this.configService.getConfig().bolt;
    const boltLogger = new BoltLogger();

    this.bolt = new App({
      appToken,
      token,
      signingSecret,
      socketMode: true,
      logger: boltLogger,
      logLevel: LogLevel.INFO,
    });

    await this.connectWithRetry();
  }

  async disconnect() {
    await this.bolt.stop();
  }

  getBolt(): App<StringIndexed> {
    return this.bolt;
  }

  private async connectWithRetry(): Promise<void> {
    // eslint-disable-next-line no-constant-condition
    while (true) {
      try {
        await this.bolt.start();
        return;
      } catch (error) {
        this.logger.error("Failed to initialize a connection to Slack.", error);
        this.logger.log("Trying to connect again to Slack.");

        await new Promise((resolve) => setTimeout(resolve, 2000));
      }
    }
  }
}
