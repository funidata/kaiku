import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PresenceView } from "../../gui/home-tab/views/presence.view";
import { OfficeModule } from "../office/office.module";
import { PresenceController } from "./presence.controller";
import { Presence } from "./presence.model";
import { PresenceService } from "./presence.service";

@Module({
  imports: [TypeOrmModule.forFeature([Presence]), OfficeModule],
  providers: [PresenceService, PresenceView],
  controllers: [PresenceController],
  exports: [TypeOrmModule, PresenceService, PresenceView],
})
export class PresenceModule {}
