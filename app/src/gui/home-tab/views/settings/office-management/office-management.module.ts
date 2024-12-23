import { Module } from "@nestjs/common";
import { OfficeModule } from "../../../../../entities/office/office.module";
import { AddOfficeModal } from "./add-office.modal";
import { OfficeManagementController } from "./office-management.controller";
import { OfficeManagementModal } from "./office-management.modal";

@Module({
  imports: [OfficeModule],
  providers: [OfficeManagementModal, AddOfficeModal],
  controllers: [OfficeManagementController],
})
export class OfficeManagementModule {}
