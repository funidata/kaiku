import { Module } from "@nestjs/common";
import { OfficeModule } from "../../../../entities/office/office.module";
import { PresenceModule } from "../../../../entities/presence/presence.module";
import { DayList } from "./day-list";
import { DayListItem } from "./day-list-item";
import { RegistrationView } from "./registration.view";

@Module({
  imports: [OfficeModule, PresenceModule],
  providers: [DayList, DayListItem, RegistrationView],
  exports: [RegistrationView],
})
export class RegistrationViewModule {}
