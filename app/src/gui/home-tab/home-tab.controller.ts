import { Controller } from "@nestjs/common";
import { Appendable, ViewBlockBuilder } from "slack-block-builder/dist/internal";
import BoltAction from "../../bolt/decorators/bolt-action.decorator";
import BoltEvent from "../../bolt/decorators/bolt-event.decorator";
import Action from "../../bolt/enums/action.enum";
import Event from "../../bolt/enums/event.enum";
import { AppHomeOpenedArgs } from "../../bolt/types/app-home-opened.type";
import { BoltActionArgs } from "../../bolt/types/bolt-action-args.type";
import { UserSettingsService } from "../../entities/user-settings/user-settings.service";
import { HomeTabService } from "./home-tab.service";
import { PresenceView } from "./views/presence/presence.view";
import { RegistrationView } from "./views/registration/registration.view";
import { SettingsView } from "./views/settings.view";

type ViewProps = {
  actionArgs: BoltActionArgs;
  name: "presence" | "registration" | "settings";
  contentFactory: () => Promise<Appendable<ViewBlockBuilder>>;
};

@Controller()
export class HomeTabController {
  constructor(
    private homeTabBuilder: HomeTabService,
    private presenceView: PresenceView,
    private registrationView: RegistrationView,
    private settingsView: SettingsView,
    private userSettingsService: UserSettingsService,
  ) {}

  @BoltEvent(Event.APP_HOME_OPENED)
  async getView(args: AppHomeOpenedArgs) {
    const { selectedView } = await this.userSettingsService.findForUser(args.context.userId);
    let content: Appendable<ViewBlockBuilder> = [];

    if (selectedView === "presence") {
      content = await this.presenceView.build();
    } else if (selectedView === "settings") {
      content = await this.settingsView.build();
    } else {
      content = await this.registrationView.build(args.event.user);
    }

    await this.homeTabBuilder.publish(args, content);
  }

  @BoltAction(Action.OPEN_PRESENCE_VIEW)
  async openPresenceView(actionArgs: BoltActionArgs) {
    await this.openView({
      actionArgs,
      contentFactory: async () => this.presenceView.build(),
      name: "presence",
    });
  }

  @BoltAction(Action.OPEN_REGISTRATION_VIEW)
  async openRegistrationView(actionArgs: BoltActionArgs) {
    await this.openView({
      actionArgs,
      contentFactory: async () => this.registrationView.build(actionArgs.context.userId),
      name: "registration",
    });
  }

  @BoltAction(Action.OPEN_SETTINGS_VIEW)
  async openSettingsView(actionArgs: BoltActionArgs) {
    await this.openView({
      actionArgs,
      contentFactory: async () => this.settingsView.build(),
      name: "settings",
    });
  }

  /**
   * Abstract helper to show home tab views with less boilerplate.
   *
   * According to Bolt docs, `ack()` should be called ASAP. To comply with this,
   * we take a content factory instead of prebuild content as an argument.
   */
  private async openView({ actionArgs, contentFactory, name }: ViewProps) {
    await actionArgs.ack();
    await this.userSettingsService.update(actionArgs.context.userId, { selectedView: name });
    const content = await contentFactory();
    this.homeTabBuilder.update(actionArgs, content);
  }
}
