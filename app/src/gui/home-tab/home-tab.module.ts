import { Module } from "@nestjs/common";
import { OfficeModule } from "../../entities/office/office.module";
import { PresenceModule } from "../../entities/presence/presence.module";
import { DevUiModule } from "../dev/dev-ui.module";
import { HomeTabControls } from "./home-tab-controls";
import { HomeTabBuilder } from "./home-tab.builder";
import { HomeTabController } from "./home-tab.controller";
import { DayListItem } from "./views/registration/day-list-item.builder";
import { DayList } from "./views/registration/day-list.builder";
import { RegistrationView } from "./views/registration/registration-view";
import { VisibleOfficeSelect } from "./views/registration/visible-office-select.builder";

@Module({
  imports: [DevUiModule, OfficeModule, PresenceModule],
  providers: [
    HomeTabBuilder,
    DayList,
    DayListItem,
    VisibleOfficeSelect,
    HomeTabControls,
    RegistrationView,
  ],
  controllers: [HomeTabController],
  exports: [HomeTabBuilder],
})
export class HomeTabModule {}
