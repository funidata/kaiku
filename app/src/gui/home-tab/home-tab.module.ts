import { Module } from "@nestjs/common";
import { OfficeModule } from "../../entities/office/office.module";
import { PresenceModule } from "../../entities/presence/presence.module";
import { DevUiModule } from "../dev/dev-ui.module";
import { HomeTabControls } from "./home-tab-controls";
import { HomeTabController } from "./home-tab.controller";
import { HomeTabService } from "./home-tab.service";
import { DayList } from "./views/registration/day-list";
import { DayListItem } from "./views/registration/day-list-item";
import { RegistrationView } from "./views/registration/registration.view";
import { VisibleOfficeSelect } from "./views/registration/visible-office-select";

@Module({
  imports: [DevUiModule, OfficeModule, PresenceModule],
  providers: [
    HomeTabService,
    DayList,
    DayListItem,
    VisibleOfficeSelect,
    HomeTabControls,
    RegistrationView,
  ],
  controllers: [HomeTabController],
  exports: [HomeTabService, RegistrationView],
})
export class HomeTabModule {}
