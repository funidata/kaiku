import { Injectable } from "@nestjs/common";
import { Input, Modal, TextInput } from "slack-block-builder";
import { SlackModalDto } from "slack-block-builder/dist/internal";

@Injectable()
export class AddOfficeModal {
  async build(): Promise<Readonly<SlackModalDto>> {
    return Modal({ title: "Lisää toimisto", submit: "Tallenna", close: "Eiku" })
      .blocks([Input().label("Nimi").element(TextInput())])
      .buildToObject();
  }
}
