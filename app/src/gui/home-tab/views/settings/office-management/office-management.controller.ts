import { Controller } from "@nestjs/common";
import { BoltService } from "../../../../../bolt/bolt.service";
import BoltAction from "../../../../../bolt/decorators/bolt-action.decorator";
import Action from "../../../../../bolt/enums/action.enum";
import { BoltActionArgs } from "../../../../../bolt/types/bolt-action-args.type";
import { OfficeManagementModal } from "./office-management.modal";

@Controller()
export class OfficeManagementController {
  constructor(
    private boltService: BoltService,
    private officeMgmtModal: OfficeManagementModal,
  ) {}

  @BoltAction(Action.OPEN_OFFICE_MANAGEMENT_MODAL)
  async openOfficeManagementModal(actionsArgs: BoltActionArgs) {
    const bolt = this.boltService.getBolt();
    const modal = await this.officeMgmtModal.build();

    bolt.client.views.open({
      trigger_id: actionsArgs.body.trigger_id,
      view: modal,
    });
  }
}
