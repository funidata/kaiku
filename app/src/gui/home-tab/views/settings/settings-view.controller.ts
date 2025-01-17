import { Controller } from "@nestjs/common";
import { get } from "lodash";
import BoltAction from "../../../../bolt/decorators/bolt-action.decorator";
import Action from "../../../../bolt/enums/action.enum";
import { BoltActionArgs } from "../../../../bolt/types/bolt-action-args.type";
import { UserSettingsService } from "../../../../entities/user-settings/user-settings.service";

@Controller()
export class SettingsViewController {
  constructor(private userSettingsService: UserSettingsService) {}

  @BoltAction(Action.SET_HOME_OFFICE)
  async setHomeOffice({ payload, body }: BoltActionArgs) {
    const officeId = get(payload, "selected_option.value");
    await this.userSettingsService.update(body.user.id, { homeOffice: { id: officeId } });
  }
}
