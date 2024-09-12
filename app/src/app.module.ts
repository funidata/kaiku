import { Module } from "@nestjs/common";
import { BoltModule } from "./bolt/bolt.module";
import { ConfigModule } from "./common/config/config.module";
import { DatabaseModule } from "./database/database.module";
import { EntitiesModule } from "./entities/entities.module";
import { SyncModule } from "./sync/sync.module";

@Module({
  imports: [ConfigModule, DatabaseModule, BoltModule, EntitiesModule, SyncModule],
})
export class AppModule {}
