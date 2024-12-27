import { Controller, InternalServerErrorException, Logger } from "@nestjs/common";
import { get } from "lodash";
import { AuthorizationService } from "../../../../../authorization/authorization.service";
import BoltAction from "../../../../../bolt/decorators/bolt-action.decorator";
import BoltViewAction from "../../../../../bolt/decorators/bolt-view-action.decorator";
import Action from "../../../../../bolt/enums/action.enum";
import ViewAction from "../../../../../bolt/enums/view-action.enum";
import { BoltActionArgs } from "../../../../../bolt/types/bolt-action-args.type";
import { BoltViewActionArgs } from "../../../../../bolt/types/bolt-view-action-args.type";
import { OfficeService } from "../../../../../entities/office/office.service";
import { AddOfficeModal } from "./add-office.modal";
import { EditOfficeModal } from "./edit-office.modal";
import { OfficeManagementModal } from "./office-management.modal";

@Controller()
export class OfficeManagementController {
  logger = new Logger(OfficeManagementController.name);

  constructor(
    private officeMgmtModal: OfficeManagementModal,
    private addOfficeModal: AddOfficeModal,
    private editOfficeModal: EditOfficeModal,
    private officeService: OfficeService,
    private authService: AuthorizationService,
  ) {}

  @BoltAction(Action.OPEN_OFFICE_MANAGEMENT_MODAL)
  async openOfficeManagementModal(actionArgs: BoltActionArgs) {
    await actionArgs.client.views.open({
      trigger_id: actionArgs.body.trigger_id,
      view: await this.officeMgmtModal.build(),
    });
  }

  @BoltAction(Action.OPEN_ADD_OFFICE_MODAL)
  async openAddOfficeModal(actionArgs: BoltActionArgs) {
    await actionArgs.client.views.push({
      trigger_id: actionArgs.body.trigger_id,
      view: await this.addOfficeModal.build(),
    });
  }

  @BoltAction(Action.OPEN_EDIT_OFFICE_MODAL)
  async openEditOfficeModal(actionArgs: BoltActionArgs) {
    const officeId = get(actionArgs, "payload.value");
    const office = await this.officeService.findById(officeId);

    await actionArgs.client.views.push({
      trigger_id: actionArgs.body.trigger_id,
      view: await this.editOfficeModal.build(office),
    });
  }

  @BoltViewAction(ViewAction.CREATE_OFFICE)
  async createOffice({ view, client, body }: BoltViewActionArgs) {
    await this.authService.requireOwnerRole(body.user.id);

    const officeName = get(view, "state.values.new_office.name.value");

    if (!officeName) {
      this.logger.error("Could not read office name from view submission payload.");
      throw new InternalServerErrorException();
    }

    await this.officeService.create(officeName);

    await client.views.update({
      view_id: view.root_view_id,
      view: await this.officeMgmtModal.build(),
    });
  }
}
