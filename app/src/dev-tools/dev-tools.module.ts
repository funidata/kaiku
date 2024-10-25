import { Module } from "@nestjs/common";
import { OfficeModule } from "../entities/office/office.module";
import { PresenceModule } from "../entities/presence/presence.module";
import { SyncModule } from "../sync/sync.module";
import { DevToolsController } from "./dev-tools.controller";

@Module({ imports: [SyncModule, PresenceModule, OfficeModule], controllers: [DevToolsController] })
export class DevToolsModule {}
