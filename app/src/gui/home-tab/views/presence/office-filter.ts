import { Injectable } from "@nestjs/common";
import { Input, Option, StaticSelect } from "slack-block-builder";
import Action from "../../../../bolt/enums/action.enum";
import { OfficeService } from "../../../../entities/office/office.service";

@Injectable()
export class OfficeFilter {
  constructor(private officeService: OfficeService) {}

  async build(selectedValue?: string) {
    const offices = await this.officeService.findAll();

    const officeOptions = offices
      .toSorted((a, b) => a.name.localeCompare(b.name, "fi", { sensitivity: "base" }))
      .map(({ id, name }) => ({
        text: name,
        value: id.toString(),
      }));

    const options = [
      { text: "Kaikki toimistot", value: "ALL_OFFICES" },
      ...officeOptions,
      { text: "Etänä", value: "REMOTE" },
    ];

    const initialOption = options.find((opt) => opt.value === selectedValue) || options[0];

    return [
      Input()
        .element(
          StaticSelect()
            .placeholder("Valitse paikka")
            .actionId(Action.SET_OFFICE_FILTER_VALUE)
            .initialOption(Option(initialOption))
            .options(options.map((opt) => Option(opt))),
        )
        .label("Työskentelypaikka:")
        .dispatchAction(true),
    ];
  }
}
