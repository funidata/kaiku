import { Module } from "@nestjs/common";
import { OfficeModule } from "../../../../entities/office/office.module";
import { PresenceModule } from "../../../../entities/presence/presence.module";
import { PresenceView } from "./presence.view";
import { OfficeFilter } from "./visible-office-select";

@Module({
  imports: [OfficeModule, PresenceModule],
  providers: [PresenceView, OfficeFilter],
  exports: [PresenceView],
})
export class PresenceViewModule {}
