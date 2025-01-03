import { Controller, InternalServerErrorException } from "@nestjs/common";
import { get, range } from "lodash";
import BoltAction from "../../../../../bolt/decorators/bolt-action.decorator";
import BoltViewAction from "../../../../../bolt/decorators/bolt-view-action.decorator";
import Action from "../../../../../bolt/enums/action.enum";
import ViewAction from "../../../../../bolt/enums/view-action.enum";
import { BoltActionArgs } from "../../../../../bolt/types/bolt-action-args.type";
import { BoltViewActionArgs } from "../../../../../bolt/types/bolt-view-action-args.type";
import { ConstantPresenceService } from "../../../../../entities/constant-presence/constant-presence.service";
import { CreateConstantPresence } from "../../../../../entities/constant-presence/dto/create-constant-presence.dto";
import { ConstantPresenceManagementModal } from "./constant-presence-management.modal";

@Controller()
export class ConstantPresenceManagementController {
  constructor(
    private modal: ConstantPresenceManagementModal,
    private cpService: ConstantPresenceService,
  ) {}

  @BoltAction(Action.OPEN_CONSTANT_PRESENCE_MANAGEMENT_MODAL)
  async openModal({ client, body }: BoltActionArgs) {
    await client.views.open({
      trigger_id: body.trigger_id,
      view: await this.modal.build(),
    });
  }

  @BoltViewAction(ViewAction.SAVE_CONSTANT_PRESENCES)
  async saveConstantPresences({ body, view }: BoltViewActionArgs) {
    const inserts = this.insertsFromModalStateValues(view.state.values);
    await this.cpService.closeOldAndCreateMany(body.user.id, inserts);
  }

  private presencePropsFromStaticSelectValue(value: unknown) {
    if (typeof value !== "string") {
      throw new InternalServerErrorException();
    }

    if (["REMOTE", "OFFICE"].includes(value)) {
      return {
        remote: value === "REMOTE",
        officeId: null,
      };
    }

    return { remote: false, officeId: value };
  }

  private insertsFromModalStateValues(stateValues: unknown): CreateConstantPresence[] {
    const valuesForAllDays = range(5).map((dayOfWeek) => ({
      dayOfWeek,
      value: get(stateValues, `day-${dayOfWeek}.presence.selected_option.value`),
    }));

    const selection = valuesForAllDays.filter((o) => o.value);

    return selection.map((selected) => ({
      dayOfWeek: selected.dayOfWeek,
      ...this.presencePropsFromStaticSelectValue(selected.value),
    }));
  }
}
