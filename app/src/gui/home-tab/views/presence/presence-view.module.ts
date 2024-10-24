import { Module } from "@nestjs/common";
import { OfficeModule } from "../../../../entities/office/office.module";
import { PresenceModule } from "../../../../entities/presence/presence.module";
import { OfficeFilter } from "./office-filter";
import { PresenceView } from "./presence.view";

@Module({
  imports: [OfficeModule, PresenceModule],
  providers: [PresenceView, OfficeFilter],
  exports: [PresenceView],
})
export class PresenceViewModule {}
