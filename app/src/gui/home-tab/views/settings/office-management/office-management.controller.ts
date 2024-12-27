import {
  Controller,
  ForbiddenException,
  InternalServerErrorException,
  Logger,
} from "@nestjs/common";
import { get } from "lodash";
import BoltAction from "../../../../../bolt/decorators/bolt-action.decorator";
import BoltViewAction from "../../../../../bolt/decorators/bolt-view-action.decorator";
import Action from "../../../../../bolt/enums/action.enum";
import ViewAction from "../../../../../bolt/enums/view-action.enum";
import { BoltActionArgs } from "../../../../../bolt/types/bolt-action-args.type";
import { BoltViewActionArgs } from "../../../../../bolt/types/bolt-view-action-args.type";
import { OfficeService } from "../../../../../entities/office/office.service";
import { AddOfficeModal } from "./add-office.modal";
import { OfficeManagementModal } from "./office-management.modal";

@Controller()
export class OfficeManagementController {
  logger = new Logger(OfficeManagementController.name);

  constructor(
    private officeMgmtModal: OfficeManagementModal,
    private addOfficeModal: AddOfficeModal,
    private officeService: OfficeService,
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

  @BoltViewAction(ViewAction.CREATE_OFFICE)
  async createOffice({ view, client, body }: BoltViewActionArgs) {
    const { user } = await client.users.info({ user: body.user.id });
    if (!user.is_owner) {
      throw new ForbiddenException();
    }

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
