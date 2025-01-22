import { Injectable } from "@nestjs/common";
import { Dayjs } from "dayjs";
import { Actions, Button, Header, Option, OverflowMenu, StaticSelect } from "slack-block-builder";
import Action from "../../../../bolt/enums/action.enum";
import { ConstantPresence } from "../../../../entities/constant-presence/constant-presence.model";
import { Office } from "../../../../entities/office/office.model";
import { Presence } from "../../../../entities/presence/presence.model";

type DayListItemProps = {
  date: Dayjs;
  offices: Office[];
  presence: Presence | undefined;
  constantPresence: ConstantPresence | undefined;
};

@Injectable()
export class DayListItem {
  build({ date, offices, presence, constantPresence }: DayListItemProps) {
    const dateString = date.toISOString();
    const effectivePresence = this.workOutEffectivePresence(presence, constantPresence);

    return [
      Header({ text: date.format("dd D.M.") }),
      Actions().elements(
        Button({
          text: "Toimistolla",
          actionId: Action.SET_OFFICE_PRESENCE,
          value: dateString,
        }).primary(effectivePresence?.remote === false),
        Button({
          text: "Etänä",
          actionId: Action.SET_REMOTE_PRESENCE,
          value: dateString,
        }).primary(effectivePresence?.remote === true),
        this.getOfficeBlocks(date, offices),
        OverflowMenu({ actionId: Action.DAY_LIST_ITEM_OVERFLOW }).options(
          Option({
            text: "Poista ilmoittautuminen",
            value: JSON.stringify({
              type: "remove_presence",
              date,
            }),
          }),
        ),
      ),
    ];
  }

  private getOfficeBlocks(date: Dayjs, offices: Office[]) {
    // Don't show office select at all if no offices exist.
    if (offices.length === 0) {
      return undefined;
    }

    const Options = offices.map(({ id, name }) =>
      Option({
        text: name,
        value: JSON.stringify({ value: id, date }),
      }),
    );

    return StaticSelect({
      placeholder: "Valitse toimipiste",
      actionId: Action.SELECT_OFFICE_FOR_DATE,
    })
      .initialOption(Options[0])
      .options(Options);
  }

  /**
   * Work out effective presence to show from manual registration and constant
   * presence, both of which are optional.
   */
  private workOutEffectivePresence(
    manual?: Presence,
    constant?: ConstantPresence,
  ):
    | {
        // This is simple now but the point is to support offices later on...
        remote: boolean;
      }
    | undefined {
    let remote: boolean | undefined = constant?.remote;
    remote = manual ? manual.remote : remote;

    if (remote !== undefined) {
      return { remote };
    }

    return undefined;
  }
}
