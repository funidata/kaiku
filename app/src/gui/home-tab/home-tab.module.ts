import { Module } from "@nestjs/common";
import { OfficeModule } from "../../entities/office/office.module";
import { PresenceModule } from "../../entities/presence/presence.module";
import { DevUiModule } from "../dev/dev-ui.module";
import { HomeTabControls } from "./home-tab-controls";
import { HomeTabController } from "./home-tab.controller";
import { HomeTabService } from "./home-tab.service";
import { RegistrationViewModule } from "./views/registration/registration-view.module";

@Module({
  imports: [DevUiModule, OfficeModule, PresenceModule, RegistrationViewModule],
  providers: [HomeTabService, HomeTabControls],
  controllers: [HomeTabController],
  exports: [HomeTabService, RegistrationViewModule],
})
export class HomeTabModule {}
