import { Module } from "@nestjs/common";
import { BoltModule } from "./bolt/bolt.module";
import { ConfigModule } from "./common/config/config.module";
import { DatabaseModule } from "./database/database.module";
import { OfficeModule } from "./entities/office/office.module";

@Module({
  imports: [ConfigModule, DatabaseModule, BoltModule, OfficeModule],
})
export class AppModule {}
