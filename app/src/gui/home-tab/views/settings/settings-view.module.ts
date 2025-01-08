import { Module } from "@nestjs/common";
import { AuthorizationModule } from "../../../../authorization/authorization.module";
import { OfficeModule } from "../../../../entities/office/office.module";
import { UserSettingsModule } from "../../../../entities/user-settings/user-settings.module";
import { OfficeManagementModule } from "./office-management/office-management.module";
import { SettingsViewController } from "./settings-view.controller";
import { SettingsView } from "./settings.view";

@Module({
  imports: [OfficeManagementModule, OfficeModule, UserSettingsModule, AuthorizationModule],
  providers: [SettingsView],
  controllers: [SettingsViewController],
  exports: [SettingsView],
})
export class SettingsViewModule {}
