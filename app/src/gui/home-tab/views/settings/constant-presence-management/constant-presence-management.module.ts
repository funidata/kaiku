import { Module } from "@nestjs/common";
import { ConstantPresenceManagementController } from "./constant-presence-management.controller";
import { ConstantPresenceManagementModal } from "./constant-presence-management.modal";

@Module({
  providers: [ConstantPresenceManagementModal],
  controllers: [ConstantPresenceManagementController],
})
export class ConstantPresenceManagementModule {}
