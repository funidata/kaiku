import { Module } from "@nestjs/common";
import { BoltModule } from "./bolt/bolt.module";
import { ConfigModule } from "./common/config/config.module";
import { DatabaseModule } from "./database/database.module";

@Module({
  imports: [ConfigModule, DatabaseModule, BoltModule],
})
export class AppModule {}
