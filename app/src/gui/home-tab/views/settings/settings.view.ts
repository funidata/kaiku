import { Injectable } from "@nestjs/common";
import { Actions, Button, Header } from "slack-block-builder";
import { Appendable, ViewBlockBuilder } from "slack-block-builder/dist/internal";
import Action from "../../../../bolt/enums/action.enum";

@Injectable()
export class SettingsView {
  async build(): Promise<Appendable<ViewBlockBuilder>> {
    return [
      Header({ text: "Asetukset" }),
      Actions().elements([
        Button({ text: "Toimistojen hallinta", actionId: Action.OPEN_OFFICE_MANAGEMENT_MODAL }),
      ]),
    ];
  }
}
