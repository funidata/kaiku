import { Injectable } from "@nestjs/common";
import { Actions, Button, ViewBlockBuilder } from "slack-block-builder";
import { Appendable } from "slack-block-builder/dist/internal";
import Action from "../../bolt/enums/action.enum";
import { ConfigService } from "../../common/config/config.service";
import { DevUiBuilder } from "../dev/dev-ui.builder";

@Injectable()
export class HomeTabControls {
  constructor(
    private devToolsBuilder: DevUiBuilder,
    private configService: ConfigService,
  ) {}

  build(): Appendable<ViewBlockBuilder> {
    const devTools = this.configService.getConfig().hideDevTools
      ? []
      : this.devToolsBuilder.buildBlocks();

    return [
      ...devTools,
      Actions().elements([
        Button({ text: "Ilmoittautuminen", actionId: Action.OPEN_REGISTRATION_VIEW }),
        Button({ text: "Läsnäolijat", actionId: Action.OPEN_PRESENCE_VIEW }),
        Button({ text: "Asetukset", actionId: Action.OPEN_SETTINGS_VIEW }),
      ]),
    ];
  }
}
