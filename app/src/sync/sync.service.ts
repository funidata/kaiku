import { Injectable, OnApplicationBootstrap } from "@nestjs/common";
import { ConfigService } from "../common/config/config.service";
import { devEnvActive } from "../common/config/env-utils";
import { UserSyncService } from "./user-sync.service";

@Injectable()
export class SyncService implements OnApplicationBootstrap {
  constructor(
    private userSyncService: UserSyncService,
    private configService: ConfigService,
  ) {}

  async onApplicationBootstrap() {
    if (devEnvActive(this.configService.getConfig())) {
      // Hot-reload in dev env would cause syncing on every file change.
      return;
    }

    await this.userSyncService.syncUsers();
  }
}
