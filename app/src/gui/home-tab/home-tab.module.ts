import { CacheModule } from "@nestjs/cache-manager";
import { Module } from "@nestjs/common";
import { ConfigModule } from "../../common/config/config.module";
import { OfficeModule } from "../../entities/office/office.module";
import { PresenceModule } from "../../entities/presence/presence.module";
import { DevUiModule } from "../dev/dev-ui.module";
import { HomeTabControls } from "./home-tab-controls";
import { HomeTabController } from "./home-tab.controller";
import { HomeTabService } from "./home-tab.service";
import { ViewCache } from "./view.cache";
import { RegistrationViewModule } from "./views/registration/registration-view.module";

@Module({
  imports: [
    DevUiModule,
    OfficeModule,
    PresenceModule,
    RegistrationViewModule,
    ConfigModule,
    CacheModule.register({
      max: 1000,
      ttl: 0,
    }),
  ],
  providers: [HomeTabService, HomeTabControls, ViewCache],
  controllers: [HomeTabController],
  exports: [HomeTabService, RegistrationViewModule],
})
export class HomeTabModule {}
