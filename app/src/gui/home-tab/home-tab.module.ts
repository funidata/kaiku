import { Module } from "@nestjs/common";
import { ConfigModule } from "../../common/config/config.module";
import { UserSettingsModule } from "../../entities/user-settings/user-settings.module";
import { DevUiModule } from "../dev/dev-ui.module";
import { HomeTabControls } from "./home-tab-controls";
import { HomeTabController } from "./home-tab.controller";
import { HomeTabService } from "./home-tab.service";
import { PresenceViewModule } from "./views/presence/presence-view.module";
import { RegistrationViewModule } from "./views/registration/registration-view.module";
import { SettingsView } from "./views/settings.view";

@Module({
  imports: [
    DevUiModule,
    RegistrationViewModule,
    PresenceViewModule,
    ConfigModule,
    UserSettingsModule,
  ],
  providers: [HomeTabService, HomeTabControls, SettingsView],
  controllers: [HomeTabController],
  exports: [HomeTabService, RegistrationViewModule],
})
export class HomeTabModule {}
