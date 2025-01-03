import { Injectable } from "@nestjs/common";
import { capitalize, range } from "lodash";
import { Actions, Button, Header, Modal, Option, Section, StaticSelect } from "slack-block-builder";
import { SlackModalDto } from "slack-block-builder/dist/internal";
import dayjs from "../../../../../common/dayjs";
import { Office } from "../../../../../entities/office/office.model";
import { OfficeService } from "../../../../../entities/office/office.service";

@Injectable()
export class ConstantPresenceManagementModal {
  constructor(private officeService: OfficeService) {}

  async build(): Promise<Readonly<SlackModalDto>> {
    const offices = await this.officeService.findAll();
    const selectBlocks = range(5).map((dayOfWeek) =>
      this.constantPresenceSelect(offices, dayOfWeek),
    );

    return Modal({ title: "Vakioilmoittautumiset", submit: "Tallenna", close: "Eiku" })
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

  private constantPresenceSelect(offices: Office[], dayOfWeek: number) {
    const options = offices.map((office) => Option({ text: office.name, value: office.id }));

    if (!options.length) {
      options.push(Option({ text: "Toimistolla", value: "OFFICE" }));
    }

    options.push(Option({ text: "Etänä", value: "REMOTE" }));

    const dayOfWeekName = dayjs().weekday(dayOfWeek).format("dddd");

    return [
      Header({ text: capitalize(dayOfWeekName) }),
      Actions().elements(
        StaticSelect().options(options),
        Button({ text: "Poista ilmoittautuminen" }).danger(),
      ),
    ];
  }
}
