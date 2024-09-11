import { Module } from "@nestjs/common";
import { BoltModule } from "./bolt/bolt.module";
import { ConfigModule } from "./common/config/config.module";
import { DatabaseModule } from "./database/database.module";
import { OfficeModule } from "./entities/office/office.module";
import { UserSettingsModule } from "./entities/user-settings/user-settings.module";

@Module({
  imports: [ConfigModule, DatabaseModule, BoltModule, OfficeModule, UserSettingsModule],
})
export class AppModule {}
