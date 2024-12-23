import { Module } from "@nestjs/common";
import { OfficeManagementModule } from "./office-management/office-management.module";
import { SettingsViewController } from "./settings-view.controller";
import { SettingsView } from "./settings.view";

@Module({
  imports: [OfficeManagementModule],
  providers: [SettingsView],
  controllers: [SettingsViewController],
})
export class SettingsViewModule {}
