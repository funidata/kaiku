import { Module } from "@nestjs/common";
import { OfficeManagementController } from "./office-management.controller";
import { OfficeManagementModal } from "./office-management.modal";

@Module({
  providers: [OfficeManagementModal],
  controllers: [OfficeManagementController],
})
export class OfficeManagementModule {}
