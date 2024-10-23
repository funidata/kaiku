import { Controller } from "@nestjs/common";
import BoltAction from "../../bolt/decorators/bolt-action.decorator";
import Action from "../../bolt/enums/action.enum";
import { BoltActionArgs } from "../../bolt/types/bolt-action-args.type";
import { UserSettingsService } from "./user-settings.service";

@Controller()
export class UserSettingsController {
  constructor(private userSettingsService: UserSettingsService) {}

  // FIXME: Remove.
  @BoltAction(Action.SET_VISIBLE_OFFICE)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async setVisibleOffice({ ack, payload, body }: BoltActionArgs) {
    await ack();
  }
}
