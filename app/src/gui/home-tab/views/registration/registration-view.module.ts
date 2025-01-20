import { Module } from "@nestjs/common";
import { ConstantPresenceModule } from "../../../../entities/constant-presence/constant-presence.module";
import { OfficeModule } from "../../../../entities/office/office.module";
import { PresenceModule } from "../../../../entities/presence/presence.module";
import { DayList } from "./day-list";
import { DayListItem } from "./day-list-item";
import { RegistrationController } from "./registration.controller";
import { RegistrationView } from "./registration.view";

@Module({
  imports: [OfficeModule, PresenceModule, ConstantPresenceModule],
  providers: [DayList, DayListItem, RegistrationView],
  controllers: [RegistrationController],
  exports: [RegistrationView],
})
export class RegistrationViewModule {}
