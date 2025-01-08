import { forwardRef, Module } from "@nestjs/common";
import { AuthorizationModule } from "../../../../../authorization/authorization.module";
import { OfficeModule } from "../../../../../entities/office/office.module";
import { SettingsViewModule } from "../settings-view.module";
import { AddOfficeModal } from "./add-office.modal";
import { EditOfficeModal } from "./edit-office.modal";
import { OfficeManagementController } from "./office-management.controller";
import { OfficeManagementModal } from "./office-management.modal";

@Module({
  imports: [OfficeModule, AuthorizationModule, forwardRef(() => SettingsViewModule)],
  providers: [OfficeManagementModal, AddOfficeModal, EditOfficeModal],
  controllers: [OfficeManagementController],
})
export class OfficeManagementModule {}
