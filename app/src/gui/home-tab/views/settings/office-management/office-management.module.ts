import { Module } from "@nestjs/common";
import { AuthorizationModule } from "../../../../../authorization/authorization.module";
import { OfficeModule } from "../../../../../entities/office/office.module";
import { AddOfficeModal } from "./add-office.modal";
import { OfficeManagementController } from "./office-management.controller";
import { OfficeManagementModal } from "./office-management.modal";

@Module({
  imports: [OfficeModule, AuthorizationModule],
  providers: [OfficeManagementModal, AddOfficeModal],
  controllers: [OfficeManagementController],
})
export class OfficeManagementModule {}
