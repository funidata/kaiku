import { Module } from "@nestjs/common";
import { BoltModule } from "./bolt/bolt.module";
import { ConfigModule } from "./common/config/config.module";
import { DatabaseModule } from "./database/database.module";
import { OfficeModule } from "./entities/office/office.module";
import { PresenceModule } from "./entities/presence/presence.module";
import { UserSettingsModule } from "./entities/user-settings/user-settings.module";
import { UserModule } from "./entities/user/user.module";

@Module({
  imports: [
    ConfigModule,
    DatabaseModule,
    BoltModule,
    OfficeModule,
    UserSettingsModule,
    UserModule,
    PresenceModule,
  ],
})
export class AppModule {}
