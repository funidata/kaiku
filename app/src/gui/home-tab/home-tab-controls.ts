import { Injectable } from "@nestjs/common";
import { Actions, Button, Divider, ViewBlockBuilder } from "slack-block-builder";
import { Appendable } from "slack-block-builder/dist/internal";
import Action from "../../bolt/enums/action.enum";
import { ConfigService } from "../../common/config/config.service";
import { UserSettingsService } from "../../entities/user-settings/user-settings.service";
import { DevUiBuilder } from "../dev/dev-ui.builder";

@Injectable()
export class HomeTabControls {
  constructor(
    private devToolsBuilder: DevUiBuilder,
    private configService: ConfigService,
    private userSettingsService: UserSettingsService,
  ) {}

  async build(userId: string): Promise<Appendable<ViewBlockBuilder>> {
    const { selectedView } = await this.userSettingsService.findForUser(userId);

    const devTools = this.configService.getConfig().hideDevTools
      ? []
      : this.devToolsBuilder.build();

    return [
      ...devTools,
      Actions().elements([
        Button({ text: "Ilmoittautuminen", actionId: Action.OPEN_REGISTRATION_VIEW }).primary(
          selectedView === "registration",
        ),
        Button({ text: "Läsnäolijat", actionId: Action.OPEN_PRESENCE_VIEW }).primary(
          selectedView === "presence",
        ),
        Button({ text: "Asetukset", actionId: Action.OPEN_SETTINGS_VIEW }).primary(
          selectedView === "settings",
        ),
      ]),
      Divider(),
    ];
  }
}
