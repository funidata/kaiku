import { Injectable } from "@nestjs/common";
import { Option, Section, StaticSelect } from "slack-block-builder";
import Action from "../../../../bolt/enums/action.enum";
import { OfficeService } from "../../../../entities/office/office.service";

@Injectable()
export class OfficeFilter {
  constructor(private officeService: OfficeService) {}

  async build() {
    const offices = await this.officeService.findAll();

    const OfficeOptions = offices
      .toSorted((a, b) => a.name.localeCompare(b.name, "fi", { sensitivity: "base" }))
      .map(({ id, name }) =>
        Option({
          text: name,
          value: id.toString(),
        }),
      );

    const AllOfficesOption = Option({ text: "Kaikki toimistot", value: "ALL_OFFICES" });
    const RemoteOption = Option({ text: "Etänä", value: "REMOTE" });

    return [
      Section({
        text: "Työskentelypaikka:",
      }).accessory(
        StaticSelect({
          placeholder: "Valitse paikka",
          actionId: Action.SET_OFFICE_FILTER_VALUE,
        })
          // TODO: Use user's selected office as initial value.
          .initialOption(AllOfficesOption)
          .options(AllOfficesOption, ...OfficeOptions, RemoteOption),
      ),
    ];
  }
}
