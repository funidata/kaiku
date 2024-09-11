import { Module } from "@nestjs/common";
import { OfficeModule } from "./office/office.module";
import { PresenceModule } from "./presence/presence.module";
import { UserSettingsModule } from "./user-settings/user-settings.module";
import { UserModule } from "./user/user.module";

@Module({
  imports: [OfficeModule, UserSettingsModule, UserModule, PresenceModule],
  exports: [OfficeModule, UserSettingsModule, UserModule, PresenceModule],
})
export class EntitiesModule {}
