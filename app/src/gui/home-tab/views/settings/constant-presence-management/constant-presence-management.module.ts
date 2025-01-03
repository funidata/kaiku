import { Module } from "@nestjs/common";
import { OfficeModule } from "../../../../../entities/office/office.module";
import { ConstantPresenceManagementController } from "./constant-presence-management.controller";
import { ConstantPresenceManagementModal } from "./constant-presence-management.modal";

@Module({
  imports: [OfficeModule],
  providers: [ConstantPresenceManagementModal],
  controllers: [ConstantPresenceManagementController],
})
export class ConstantPresenceManagementModule {}
