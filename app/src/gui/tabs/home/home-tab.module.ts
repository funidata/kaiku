import { Module } from "@nestjs/common";
import { OfficeModule } from "../../../entities/office/office.module";
import { PresenceModule } from "../../../entities/presence/presence.module";
import { DevUiModule } from "../../dev/dev-ui.module";
import { DayListItemBuilder } from "./day-list-item.builder";
import { DayListBuilder } from "./day-list.builder";
import { HomeTabBuilder } from "./home-tab.builder";
import { HomeTabController } from "./home-tab.controller";
import { VisibleOfficeSelectBuilder } from "./visible-office-select.builder";

@Module({
  imports: [DevUiModule, OfficeModule, PresenceModule],
  providers: [HomeTabBuilder, DayListBuilder, DayListItemBuilder, VisibleOfficeSelectBuilder],
  controllers: [HomeTabController],
  exports: [HomeTabBuilder],
})
export class HomeTabModule {}
