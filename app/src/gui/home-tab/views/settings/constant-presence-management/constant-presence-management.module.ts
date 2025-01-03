import { Module } from "@nestjs/common";
import { ConstantPresenceModule } from "../../../../../entities/constant-presence/constant-presence.module";
import { OfficeModule } from "../../../../../entities/office/office.module";
import { ConstantPresenceManagementController } from "./constant-presence-management.controller";
import { ConstantPresenceManagementModal } from "./constant-presence-management.modal";

@Module({
  imports: [OfficeModule, ConstantPresenceModule],
  providers: [ConstantPresenceManagementModal],
  controllers: [ConstantPresenceManagementController],
})
export class ConstantPresenceManagementModule {}
