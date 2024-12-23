import { Injectable } from "@nestjs/common";
import { Input, Modal, TextInput } from "slack-block-builder";
import { SlackModalDto } from "slack-block-builder/dist/internal";
import ViewAction from "../../../../../bolt/enums/view-action.enum";

@Injectable()
export class AddOfficeModal {
  async build(): Promise<Readonly<SlackModalDto>> {
    return Modal({
      title: "Lisää toimisto",
      submit: "Tallenna",
      close: "Eiku",
      callbackId: ViewAction.CREATE_OFFICE,
    })
      .blocks([
        Input({ blockId: "new_office" })
          .label("Nimi")
          .element(TextInput({ actionId: "name" })),
      ])
      .buildToObject();
  }
}
