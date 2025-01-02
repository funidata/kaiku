import { Injectable } from "@nestjs/common";
import { Header, Modal } from "slack-block-builder";
import { SlackModalDto } from "slack-block-builder/dist/internal";

@Injectable()
export class ConstantPresenceManagementModal {
  async build(): Promise<Readonly<SlackModalDto>> {
    return Modal({ title: "Vakioilmoittautumiset" })
      .blocks(Header({ text: "hehe" }))
      .buildToObject();
  }
}
