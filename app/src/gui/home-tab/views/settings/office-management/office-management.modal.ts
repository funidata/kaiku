import { Injectable } from "@nestjs/common";
import { Actions, Button, Modal, Section } from "slack-block-builder";
import { SlackModalDto } from "slack-block-builder/dist/internal";
import Action from "../../../../../bolt/enums/action.enum";
import { Office } from "../../../../../entities/office/office.model";
import { OfficeService } from "../../../../../entities/office/office.service";

@Injectable()
export class OfficeManagementModal {
  constructor(private officeService: OfficeService) {}

  async build(): Promise<Readonly<SlackModalDto>> {
    const offices = await this.officeService.findAll();

    return Modal({ title: "Toimistojen hallinta" })
      .blocks([
        ...this.buildOfficeList(offices),
        Actions().elements(
          Button({ text: "Lisää uusi toimisto", actionId: Action.OPEN_ADD_OFFICE_MODAL }),
        ),
      ])
      .buildToObject();
  }

  private buildOfficeList(offices: Office[]) {
    if (offices.length === 0) {
      return [Section({ text: "Yhtään toimistoa ei ole lisätty Kaikuun." })];
    }

    return offices.map((office) =>
      Section({ text: office.name }).accessory(Button({ text: "Muokkaa" })),
    );
  }
}
