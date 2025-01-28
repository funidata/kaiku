import { Injectable } from "@nestjs/common";
import { Actions, Button, ConfirmationDialog, Modal, Section } from "slack-block-builder";
import { SlackModalDto } from "slack-block-builder/dist/internal";
import Action from "../../../../../bolt/enums/action.enum";
import ViewCloseAction from "../../../../../bolt/enums/view-close-action.enum";
import { OfficeService } from "../../../../../entities/office/office.service";

@Injectable()
export class OfficeManagementModal {
  constructor(private officeService: OfficeService) {}

  async build(): Promise<Readonly<SlackModalDto>> {
    return Modal({ title: "Toimistojen hallinta" })
      .notifyOnClose()
      .callbackId(ViewCloseAction.OFFICE_MANAGEMENT_MODAL)
      .blocks([
        ...(await this.buildOfficeList()),
        Actions().elements(
          Button({ text: "Lisää uusi toimisto", actionId: Action.OPEN_ADD_OFFICE_MODAL }),
        ),
      ])
      .buildToObject();
  }

  private async buildOfficeList() {
    const offices = await this.officeService.findAll();

    if (offices.length === 0) {
      return [Section({ text: "Yhtään toimistoa ei ole lisätty Kaikuun." })];
    }

    return offices
      .toSorted((a, b) => a.name.localeCompare(b.name, "fi", { sensitivity: "base" }))
      .map((office) => [
        Section({ text: office.name }),
        Actions().elements(
          Button({ text: "Muokkaa", actionId: Action.OPEN_EDIT_OFFICE_MODAL, value: office.id }),
          Button({ text: "Poista", actionId: Action.DELETE_OFFICE, value: office.id })
            .danger()
            .confirm(
              ConfirmationDialog({
                confirm: "Poista",
                deny: "Eiku",
                text: `Haluatko varmasti poistaa toimiston "${office.name}"?`,
              }).danger(),
            ),
        ),
      ])
      .flat();
  }
}
