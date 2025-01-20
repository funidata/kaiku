import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { OfficeModule } from "../office/office.module";
import { Presence } from "./presence.model";
import { PresenceService } from "./presence.service";

@Module({
  imports: [TypeOrmModule.forFeature([Presence]), OfficeModule],
  providers: [PresenceService],
  exports: [TypeOrmModule, PresenceService],
})
export class PresenceModule {}
