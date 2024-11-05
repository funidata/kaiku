import { Module } from "@nestjs/common";
import { OfficeModule } from "../../../../entities/office/office.module";
import { PresenceModule } from "../../../../entities/presence/presence.module";
import { UserSettingsModule } from "../../../../entities/user-settings/user-settings.module";
import { OfficeFilter } from "./office-filter";
import { PresenceList } from "./presence-list";
import { PresenceView } from "./presence.view";

@Module({
  imports: [OfficeModule, PresenceModule, UserSettingsModule],
  providers: [PresenceView, OfficeFilter, PresenceList],
  exports: [PresenceView],
})
export class PresenceViewModule {}
