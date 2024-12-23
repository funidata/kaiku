import { Injectable } from "@nestjs/common";
import { Header, Modal } from "slack-block-builder";
import { SlackModalDto } from "slack-block-builder/dist/internal";

@Injectable()
export class OfficeManagementModal {
  async build(): Promise<Readonly<SlackModalDto>> {
    return Modal({ title: "Toimistojen hallinta" })
      .blocks([Header({ text: "asd" })])
      .buildToObject();
  }
}
