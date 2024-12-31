import { Controller, InternalServerErrorException } from "@nestjs/common";
import BoltAction from "../../bolt/decorators/bolt-action.decorator";
import Action from "../../bolt/enums/action.enum";
import { BoltActionArgs } from "../../bolt/types/bolt-action-args.type";
import { HomeTabService } from "../../gui/home-tab/home-tab.service";
import { RegistrationView } from "../../gui/home-tab/views/registration/registration.view";
import { PresenceType } from "./presence.model";
import { PresenceService } from "./presence.service";

@Controller()
export class PresenceController {
  constructor(
    private presenceService: PresenceService,
    private homeTab: HomeTabService,
    private registrationView: RegistrationView,
  ) {}

  @BoltAction(Action.SET_OFFICE_PRESENCE)
  async setOfficePresence(args: BoltActionArgs) {
    await args.ack();
    const date = args.payload["value"];
    await this.presenceService.upsert({
      userId: args.body.user.id,
      type: PresenceType.OFFICE,
      date,
    });

    await this.updateViewAfterAction(args);
  }

  @BoltAction(Action.SET_REMOTE_PRESENCE)
  async setRemotePresence(args: BoltActionArgs) {
    await args.ack();
    const date = args.payload["value"];
    await this.presenceService.upsert({
      userId: args.body.user.id,
      type: PresenceType.REMOTE,
      date,
    });

    await this.updateViewAfterAction(args);
  }

  @BoltAction(Action.SELECT_OFFICE_FOR_DATE)
  async selectOfficeForDate(args: BoltActionArgs) {
    await args.ack();
    const { value, date } = JSON.parse(args.payload["selected_option"].value);
    await this.presenceService.setOffice({
      userId: args.body.user.id,
      date,
      officeId: value,
    });

    await this.updateViewAfterAction(args);
  }

  // TODO: Should this be moved?
  @BoltAction(Action.DAY_LIST_ITEM_OVERFLOW)
  async dayListItemOverflow(args: BoltActionArgs) {
    await args.ack();
    const { type, date } = JSON.parse(args.payload["selected_option"].value);

    if (type !== "remove_presence") {
      throw new InternalServerErrorException("Not implemented.");
    }

    await this.presenceService.remove({
      userId: args.body.user.id,
      date,
    });

    await this.updateViewAfterAction(args);
  }

  private async updateViewAfterAction(args: BoltActionArgs) {
    const content = await this.registrationView.build(args.body.user.id);
    await this.homeTab.update(args, content);
  }
}
