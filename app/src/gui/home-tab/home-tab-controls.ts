import { Injectable } from "@nestjs/common";
import { Actions, Button, ViewBlockBuilder } from "slack-block-builder";
import { Appendable } from "slack-block-builder/dist/internal";
import Action from "../../bolt/enums/action.enum";
import { DevUiBuilder } from "../dev/dev-ui.builder";

@Injectable()
export class HomeTabControls {
  constructor(private devToolsBuilder: DevUiBuilder) {}

  build(): Appendable<ViewBlockBuilder> {
    const devTools = this.devToolsBuilder.buildBlocks();
    return [
      ...devTools,
      Actions().elements([
        Button({ text: "Ilmoittautuminen" }),
        Button({ text: "Läsnäolijat", actionId: Action.OPEN_PRESENCE_VIEW }),
        Button({ text: "Asetukset" }),
      ]),
    ];
  }
}
