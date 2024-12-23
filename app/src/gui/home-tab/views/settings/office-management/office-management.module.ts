import { Module } from "@nestjs/common";
import { OfficeModule } from "../../../../../entities/office/office.module";
import { OfficeManagementController } from "./office-management.controller";
import { OfficeManagementModal } from "./office-management.modal";

@Module({
  imports: [OfficeModule],
  providers: [OfficeManagementModal],
  controllers: [OfficeManagementController],
})
export class OfficeManagementModule {}
