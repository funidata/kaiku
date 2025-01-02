import { Module } from "@nestjs/common";
import { AuthorizationModule } from "../../authorization/authorization.module";
import { ConfigModule } from "../../common/config/config.module";
import { OfficeModule } from "../../entities/office/office.module";
import { UserSettingsModule } from "../../entities/user-settings/user-settings.module";
import { UserModule } from "../../entities/user/user.module";
import { DevUiModule } from "../dev/dev-ui.module";
import { HomeTabControls } from "./home-tab-controls";
import { HomeTabController } from "./home-tab.controller";
import { HomeTabService } from "./home-tab.service";
import { PresenceViewModule } from "./views/presence/presence-view.module";
import { RegistrationViewModule } from "./views/registration/registration-view.module";
import { SettingsViewModule } from "./views/settings/settings-view.module";
import { SettingsView } from "./views/settings/settings.view";

@Module({
  imports: [
    AuthorizationModule,
    ConfigModule,
    DevUiModule,
    OfficeModule,
    PresenceViewModule,
    RegistrationViewModule,
    SettingsViewModule,
    UserModule,
    UserSettingsModule,
  ],
  providers: [HomeTabService, HomeTabControls, SettingsView],
  controllers: [HomeTabController],
  exports: [HomeTabService, RegistrationViewModule],
})
export class HomeTabModule {}
