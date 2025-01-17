import { Controller, InternalServerErrorException, Logger } from "@nestjs/common";
import { get, isObject, range } from "lodash";
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
  private logger = new Logger(ConstantPresenceManagementController.name);

  constructor(
    private modal: ConstantPresenceManagementModal,
    private cpService: ConstantPresenceService,
  ) {}

  @BoltAction(Action.OPEN_CONSTANT_PRESENCE_MANAGEMENT_MODAL)
  async openModal({ client, body }: BoltActionArgs) {
    await client.views.open({
      trigger_id: body.trigger_id,
      view: await this.modal.build(body.user.id),
    });
  }

  @BoltAction(Action.DELETE_CONSTANT_PRESENCE)
  async deleteConstantPresence({ payload, body, client }: BoltActionArgs) {
    const dayOfWeek = Number(get(payload, "value"));
    await this.cpService.closeEffectiveCpsByUserIdAndDayOfWeek(body.user.id, dayOfWeek);

    if (!body.view?.root_view_id) {
      this.logger.error("Payload did not include root view ID.");
      throw new InternalServerErrorException();
    }

    client.views.update({
      view_id: body.view.root_view_id,
      view: await this.modal.build(body.user.id),
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
        officeId: undefined,
      };
    }

    return { remote: false, officeId: value };
  }

  private insertsFromModalStateValues(stateValues: unknown): CreateConstantPresence[] {
    const valuesForAllDays = range(5).map((dayOfWeek) => ({
      dayOfWeek,
      value: this.getSelectedValue(get(stateValues, `day-${dayOfWeek}`)),
    }));

    const selection = valuesForAllDays.filter((o) => o.value);

    return selection.map((selected) => ({
      dayOfWeek: selected.dayOfWeek,
      ...this.presencePropsFromStaticSelectValue(selected.value),
    }));
  }

  /**
   * Get selected value from object with single randomly named field.
   *
   * Naming the fields randomly is necessary because otherwise Slack will not
   * update the fields' initial values if they change from defined to undefined
   * (i.e., the field is cleared).
   *
   * This is super convoluted but unfortunately there is no way around it with
   * the current Bolt implementation.
   */
  private getSelectedValue(stateValue: unknown): string | undefined {
    if (!isObject(stateValue)) {
      return undefined;
    }
    const randomKey = Object.keys(stateValue)[0];
    return get(stateValue, `${randomKey}.selected_option.value`);
  }
}
