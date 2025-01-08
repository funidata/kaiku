import { Injectable } from "@nestjs/common";
import { Input, Modal, TextInput } from "slack-block-builder";
import { SlackModalDto } from "slack-block-builder/dist/internal";
import ViewAction from "../../../../../bolt/enums/view-action.enum";
import { Office } from "../../../../../entities/office/office.model";

@Injectable()
export class EditOfficeModal {
  async build(office: Office): Promise<Readonly<SlackModalDto>> {
    return Modal({
      title: "Muokkaa toimistoa",
      submit: "Tallenna",
      close: "Eiku",
      callbackId: ViewAction.EDIT_OFFICE,
      privateMetaData: office.id,
    })
      .blocks([
        Input({ blockId: "edit_office" })
          .label("Nimi")
          .element(TextInput({ actionId: "name", initialValue: office.name })),
      ])
      .buildToObject();
  }
}
