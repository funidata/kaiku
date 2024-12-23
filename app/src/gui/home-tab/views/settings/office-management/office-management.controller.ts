import { Controller } from "@nestjs/common";
import BoltAction from "../../../../../bolt/decorators/bolt-action.decorator";
import Action from "../../../../../bolt/enums/action.enum";
import { BoltActionArgs } from "../../../../../bolt/types/bolt-action-args.type";
import { AddOfficeModal } from "./add-office.modal";
import { OfficeManagementModal } from "./office-management.modal";

@Controller()
export class OfficeManagementController {
  constructor(
    private officeMgmtModal: OfficeManagementModal,
    private addOfficeModal: AddOfficeModal,
  ) {}

  @BoltAction(Action.OPEN_OFFICE_MANAGEMENT_MODAL)
  async openOfficeManagementModal(actionArgs: BoltActionArgs) {
    const modal = await this.officeMgmtModal.build();

    actionArgs.client.views.open({
      trigger_id: actionArgs.body.trigger_id,
      view: modal,
    });
  }

  @BoltAction(Action.OPEN_ADD_OFFICE_MODAL)
  async openAddOfficeModal(actionArgs: BoltActionArgs) {
    const modal = await this.addOfficeModal.build();

    actionArgs.client.views.push({
      trigger_id: actionArgs.body.trigger_id,
      view: modal,
    });
  }
}
