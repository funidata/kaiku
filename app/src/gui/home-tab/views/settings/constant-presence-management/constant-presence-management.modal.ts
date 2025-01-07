import { Injectable } from "@nestjs/common";
import { randomUUID } from "crypto";
import { capitalize, range } from "lodash";
import {
  Actions,
  Button,
  Header,
  Modal,
  Option,
  OptionBuilder,
  Section,
  StaticSelect,
} from "slack-block-builder";
import { SlackModalDto } from "slack-block-builder/dist/internal";
import Action from "../../../../../bolt/enums/action.enum";
import ViewAction from "../../../../../bolt/enums/view-action.enum";
import dayjs from "../../../../../common/dayjs";
import { ConstantPresence } from "../../../../../entities/constant-presence/constant-presence.model";
import { ConstantPresenceService } from "../../../../../entities/constant-presence/constant-presence.service";
import { Office } from "../../../../../entities/office/office.model";
import { OfficeService } from "../../../../../entities/office/office.service";

@Injectable()
export class ConstantPresenceManagementModal {
  constructor(
    private officeService: OfficeService,
    private cpService: ConstantPresenceService,
  ) {}

  async build(userId: string): Promise<Readonly<SlackModalDto>> {
    const offices = await this.officeService.findAll();
    const presences = await this.cpService.findEffectiveByUserId(userId);

    const selectBlocks = range(5).map((dayOfWeek) =>
      this.constantPresenceSelect(offices, presences, dayOfWeek),
    );

    return Modal({
      title: "Vakioilmoittautumiset",
      submit: "Tallenna",
      close: "Eiku",
      callbackId: ViewAction.SAVE_CONSTANT_PRESENCES,
    })
      .blocks(
        Section({
          text:
            "Voit asettaa joka viikko toistuvia ilmoittautumisia. Kaiku näyttää " +
            "vakioilmoittautumisesi kunakin päivänä, mikäli et tee käsin toista ilmoittautumista.",
        }),
        ...selectBlocks,
      )
      .buildToObject();
  }

  private constantPresenceSelect(
    offices: Office[],
    presences: ConstantPresence[],
    dayOfWeek: number,
  ) {
    const existing = presences.find((presence) => presence.dayOfWeek === dayOfWeek);

    const options = offices.map((office) => Option({ text: office.name, value: office.id }));

    if (!options.length) {
      options.push(Option({ text: "Toimistolla", value: "OFFICE" }));
    }

    options.push(Option({ text: "Etänä", value: "REMOTE" }));
    const initialOption = this.getInitialOption(existing, options);
    const dayOfWeekName = dayjs().weekday(dayOfWeek).format("dddd");

    return [
      Header({ text: capitalize(dayOfWeekName) }),
      Actions({ blockId: `day-${dayOfWeek}` }).elements(
        StaticSelect({ actionId: randomUUID() }).options(options).initialOption(initialOption),
        Button({
          text: "Poista ilmoittautuminen",
          actionId: Action.DELETE_CONSTANT_PRESENCE,
          value: dayOfWeek.toString(),
        }).danger(),
      ),
    ];
  }

  private getInitialOption(
    existingPresence: ConstantPresence,
    options: OptionBuilder[],
  ): OptionBuilder | undefined {
    if (!existingPresence) {
      return undefined;
    }

    if (existingPresence.remote) {
      return Option({ text: "Etänä", value: "REMOTE" });
    }

    const initialOption = existingPresence.office
      ? Option({ text: existingPresence.office.name, value: existingPresence.office.id })
      : Option({ text: "Toimistolla", value: "OFFICE" });

    // Ensure the created option exists to avoid Bolt errors.
    if (!options.find((opt) => opt.value === initialOption.value)) {
      return undefined;
    }

    return initialOption;
  }
}
