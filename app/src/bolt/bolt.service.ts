import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { Inject, Injectable, Logger } from "@nestjs/common";
import { App, LogLevel } from "@slack/bolt";
import { Cache } from "cache-manager";
import { CacheKeys } from "../common/cache-keys.enum";
import { ConfigService } from "../common/config/config.service";
import { BoltLogger } from "./bolt-logger";

@Injectable()
export class BoltService {
  private bolt: App;
  private logger = new Logger(BoltService.name);

  constructor(
    private configService: ConfigService,
    @Inject(CACHE_MANAGER) private cache: Cache,
  ) {}

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

  getBolt(): App {
    return this.bolt;
  }

  /**
   * Get user groups from Slack (cached).
   */
  async getUserGroups() {
    return this.cache.wrap(
      CacheKeys.USER_GROUPS,
      async () => {
        const res = await this.bolt.client.usergroups.list({ include_users: true });
        return res.usergroups || [];
      },
      10 * 1000, // 10 seconds
    );
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
