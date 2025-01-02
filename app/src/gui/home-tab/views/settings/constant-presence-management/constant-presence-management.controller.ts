import { Controller } from "@nestjs/common";
import BoltAction from "../../../../../bolt/decorators/bolt-action.decorator";
import Action from "../../../../../bolt/enums/action.enum";
import { BoltActionArgs } from "../../../../../bolt/types/bolt-action-args.type";
import { ConstantPresenceManagementModal } from "./constant-presence-management.modal";

@Controller()
export class ConstantPresenceManagementController {
  constructor(private modal: ConstantPresenceManagementModal) {}

  @BoltAction(Action.OPEN_CONSTANT_PRESENCE_MANAGEMENT_MODAL)
  async openModal({ client, body }: BoltActionArgs) {
    await client.views.open({
      trigger_id: body.trigger_id,
      view: await this.modal.build(),
    });
  }
}
