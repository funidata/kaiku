import { Controller, InternalServerErrorException } from "@nestjs/common";
import dayjs from "dayjs";
import BoltAction from "../../bolt/decorators/bolt-action.decorator";
import Action from "../../bolt/enums/action.enum";
import { BoltActionArgs } from "../../bolt/types/bolt-action-args.type";
import { HomeTabBuilder } from "../../gui/home-tab/home-tab.builder";
import { PresenceType } from "./presence.model";
import { PresenceService } from "./presence.service";

@Controller()
export class PresenceController {
  constructor(
    private presenceService: PresenceService,
    private homeTab: HomeTabBuilder,
  ) {}

  @BoltAction(Action.SET_OFFICE_PRESENCE)
  async setOfficePresence({ ack, body, payload, client }: BoltActionArgs) {
    await ack();
    const date = dayjs(payload["value"]).toDate();
    await this.presenceService.upsert({
      userId: body.user.id,
      type: PresenceType.OFFICE,
      date,
    });

    await this.homeTab.update(body, client);
  }

  @BoltAction(Action.SET_REMOTE_PRESENCE)
  async setRemotePresence({ ack, body, payload, client }: BoltActionArgs) {
    await ack();
    const date = dayjs(payload["value"]).toDate();
    await this.presenceService.upsert({
      userId: body.user.id,
      type: PresenceType.REMOTE,
      date,
    });

    await this.homeTab.update(body, client);
  }

  @BoltAction(Action.SELECT_OFFICE_FOR_DATE)
  async selectOfficeForDate({ ack, body, payload, client }: BoltActionArgs) {
    await ack();
    const { value, date } = JSON.parse(payload["selected_option"].value);
    await this.presenceService.setOffice({
      userId: body.user.id,
      date: dayjs(date).toDate(),
      officeId: value,
    });

    await this.homeTab.update(body, client);
  }

  // TODO: Should this be moved?
  @BoltAction(Action.DAY_LIST_ITEM_OVERFLOW)
  async dayListItemOverflow({ ack, body, payload, client }: BoltActionArgs) {
    await ack();
    const { type, date } = JSON.parse(payload["selected_option"].value);

    if (type !== "remove_presence") {
      throw new InternalServerErrorException("Not implemented.");
    }

    await this.presenceService.remove({
      userId: body.user.id,
      date: dayjs(date).toDate(),
    });

    await this.homeTab.update(body, client);
  }
}
