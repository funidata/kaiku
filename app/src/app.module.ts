import { Module } from "@nestjs/common";
import { BoltModule } from "./bolt/bolt.module";
import { ConfigModule } from "./common/config/config.module";
import { DatabaseModule } from "./database/database.module";
import { DevToolsModule } from "./dev-tools/dev-tools.module";
import { EntitiesModule } from "./entities/entities.module";
import { GuiModule } from "./gui/gui.module";
import { SyncModule } from "./sync/sync.module";

@Module({
  imports: [
    ConfigModule,
    DatabaseModule,
    BoltModule,
    EntitiesModule,
    SyncModule,
    GuiModule,
    // Non-production modules.
    ...(process.env.NODE_ENV === "development" ? [DevToolsModule] : []),
  ],
})
export class AppModule {}
