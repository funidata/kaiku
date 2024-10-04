import { Module } from "@nestjs/common";
import { OfficeModule } from "../../entities/office/office.module";
import { PresenceModule } from "../../entities/presence/presence.module";
import { DevUiModule } from "../dev/dev-ui.module";
import { HomeTabControls } from "./home-tab-controls";
import { HomeTabBuilder } from "./home-tab.builder";
import { HomeTabController } from "./home-tab.controller";
import { DayListItem } from "./views/day-list-item.builder";
import { DayList } from "./views/day-list.builder";
import { VisibleOfficeSelect } from "./views/visible-office-select.builder";

@Module({
  imports: [DevUiModule, OfficeModule, PresenceModule],
  providers: [HomeTabBuilder, DayList, DayListItem, VisibleOfficeSelect, HomeTabControls],
  controllers: [HomeTabController],
  exports: [HomeTabBuilder],
})
export class HomeTabModule {}
