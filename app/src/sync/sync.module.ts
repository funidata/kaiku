import { Module } from "@nestjs/common";
import { ConfigModule } from "../common/config/config.module";
import { UserModule } from "../entities/user/user.module";
import { UserService } from "../entities/user/user.service";
import { SyncController } from "./sync.controller";
import { SyncService } from "./sync.service";
import { UserSyncService } from "./user-sync.service";

/**
 * Data synchronization between Kaiku and Slack.
 *
 * Synchronizes all user data from Slack when the application is started. Also
 * listens to user profile change events and updates local data as necessary.
 */
@Module({
  imports: [UserModule, ConfigModule],
  providers: [SyncService, UserSyncService, UserService],
  controllers: [SyncController],
  exports: [SyncService, UserSyncService],
})
export class SyncModule {}
