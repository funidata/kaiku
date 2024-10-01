import { Injectable } from "@nestjs/common";
import { Option, Section, StaticSelect, ViewBlockBuilder } from "slack-block-builder";
import Action from "../../../bolt/enums/action.enum";
import { OfficeService } from "../../../entities/office/office.service";
import { BlockBuilder } from "../../block-builder.interface";

@Injectable()
export class VisibleOfficeSelectBuilder implements BlockBuilder<ViewBlockBuilder> {
  constructor(private officeService: OfficeService) {}

  async buildBlocks() {
    const offices = await this.officeService.findAll();

    // This avoids StaticSelect throwing an error for empty options list.
    if (offices.length === 0) {
      return [];
    }

    const Options = offices.map(({ id, name }) =>
      Option({
        text: name,
        value: id.toString(),
      }),
    );

    return [
      Section({
        text: "Valitse, minkä toimipisteen paikallaolijat näytetään:",
      }).accessory(
        StaticSelect({
          placeholder: "Valitse toimipiste",
          actionId: Action.SET_VISIBLE_OFFICE,
        })
          // TODO: Use user's selected office as initial value.
          .initialOption(Options[0])
          .options(Options),
      ),
    ];
  }
}
