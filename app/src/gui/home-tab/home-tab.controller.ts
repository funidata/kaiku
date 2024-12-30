import { Controller, Logger } from "@nestjs/common";
import { AllMiddlewareArgs, StringIndexed } from "@slack/bolt";
import { Appendable, ViewBlockBuilder } from "slack-block-builder/dist/internal";
import BoltAction from "../../bolt/decorators/bolt-action.decorator";
import BoltEvent from "../../bolt/decorators/bolt-event.decorator";
import Action from "../../bolt/enums/action.enum";
import Event from "../../bolt/enums/event.enum";
import { BoltActionArgs } from "../../bolt/types/bolt-action-args.type";
import { UserSettingsService } from "../../entities/user-settings/user-settings.service";
import { HomeTabService } from "./home-tab.service";
import { PresenceView } from "./views/presence/presence.view";
import { RegistrationView } from "./views/registration/registration.view";
import { SettingsView } from "./views/settings/settings.view";

type ViewProps = {
  actionArgs: BoltActionArgs;
  name: "presence" | "registration" | "settings";
  contentFactory: () => Promise<Appendable<ViewBlockBuilder>>;
};

@Controller()
export class HomeTabController {
  private readonly logger = new Logger(HomeTabController.name);

  constructor(
    private homeTabService: HomeTabService,
    private presenceView: PresenceView,
    private registrationView: RegistrationView,
    private settingsView: SettingsView,
    private userSettingsService: UserSettingsService,
  ) {}

  @BoltEvent(Event.APP_HOME_OPENED)
  async getView({ client, context }: AllMiddlewareArgs<StringIndexed>) {
    const { userId } = context;
    const { selectedView } = await this.userSettingsService.findForUser(userId);
    let content: Appendable<ViewBlockBuilder> = [];

    if (selectedView === "presence") {
      content = await this.presenceView.build(userId);
    } else if (selectedView === "settings") {
      content = await this.settingsView.build(userId);
    } else {
      content = await this.registrationView.build(userId);
    }

    await this.homeTabService.publish({ client, content, userId });
  }

  @BoltAction(Action.OPEN_PRESENCE_VIEW)
  async openPresenceView(actionArgs: BoltActionArgs) {
    await this.openView({
      actionArgs,
      contentFactory: async () => this.presenceView.build(actionArgs.context.userId),
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
      contentFactory: async () => this.settingsView.build(actionArgs.context.userId),
      name: "settings",
    });
  }

  @BoltAction(Action.SET_OFFICE_FILTER_VALUE)
  async setOfficeFilterValue(actionArgs: BoltActionArgs) {
    const officeFilter = actionArgs.payload["selected_option"]?.value || "ALL_OFFICES";
    this.logger.debug(
      `SET_OFFICE_FILTER_VALUE received selected option: ${actionArgs.payload["selected_option"]?.value}`,
    );
    this.logger.debug(`Update office filter value to ${officeFilter}`);
    await this.userSettingsService.update(actionArgs.context.userId, { officeFilter });
    await this.openPresenceView(actionArgs);
  }

  @BoltAction(Action.SET_DATE_FILTER_VALUE)
  async setDateFilterValue(actionArgs: BoltActionArgs) {
    const dateFilter = actionArgs.payload["selected_date"];
    await this.userSettingsService.update(actionArgs.context.userId, { dateFilter });
    await this.openPresenceView(actionArgs);
  }

  @BoltAction(Action.SET_USER_GROUP_FILTER_VALUE)
  async setUserGroupFilterValue(actionArgs: BoltActionArgs) {
    const receivedValue = actionArgs.payload["selected_option"]?.value;
    const userGroupFilter = !receivedValue || receivedValue == "ALL_GROUPS" ? null : receivedValue;
    await this.userSettingsService.update(actionArgs.context.userId, { userGroupFilter });
    await this.openPresenceView(actionArgs);
  }

  /**
   * Abstract helper to show home tab views with less boilerplate.
   *
   * According to Bolt docs, `ack()` should be called ASAP. To comply with this,
   * we take a content factory instead of prebuild content as an argument.
   */
  private async openView({ actionArgs, contentFactory, name }: ViewProps) {
    await this.userSettingsService.update(actionArgs.context.userId, { selectedView: name });
    const content = await contentFactory();
    this.homeTabService.update(actionArgs, content);
  }
}
