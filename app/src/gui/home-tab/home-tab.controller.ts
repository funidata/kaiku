import { Controller, Logger } from "@nestjs/common";
import { SlackEventMiddlewareArgs } from "@slack/bolt";
import { Actions, Button, Header, HomeTab, Section } from "slack-block-builder";
import { Appendable, ViewBlockBuilder } from "slack-block-builder/dist/internal";
import { BoltService } from "../../bolt/bolt.service";
import BoltAction from "../../bolt/decorators/bolt-action.decorator";
import BoltEvent from "../../bolt/decorators/bolt-event.decorator";
import Action from "../../bolt/enums/action.enum";
import Event from "../../bolt/enums/event.enum";
import { BoltActionArgs } from "../../bolt/types/bolt-action-args.type";
import { UserSettingsService } from "../../entities/user-settings/user-settings.service";
import { UserService } from "../../entities/user/user.service";
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
    private userService: UserService,
    private boltService: BoltService,
  ) {}

  @BoltEvent(Event.APP_HOME_OPENED)
  async getView({ body }: SlackEventMiddlewareArgs<"app_home_opened">) {
    this.logger.debug(Event.APP_HOME_OPENED);

    const userId = body.event.user;

    if (!(await this.userService.findPopulatedBySlackId(userId))) {
      return this.showUserNotFoundView(userId);
    }

    const { selectedView } = await this.userSettingsService.findForUser(userId);
    let content: Appendable<ViewBlockBuilder> = [];

    if (selectedView === "presence") {
      content = await this.presenceView.build(userId);
    } else if (selectedView === "settings") {
      content = await this.settingsView.build(userId);
    } else {
      content = await this.registrationView.build(userId);
    }

    await this.homeTabService.publish({ content, userId });
  }

  @BoltAction(Action.OPEN_PRESENCE_VIEW)
  async openPresenceView(actionArgs: BoltActionArgs) {
    await this.openView({
      actionArgs,
      contentFactory: async () => this.presenceView.build(actionArgs.body.user.id),
      name: "presence",
    });
  }

  @BoltAction(Action.OPEN_REGISTRATION_VIEW)
  async openRegistrationView(actionArgs: BoltActionArgs) {
    await this.openView({
      actionArgs,
      contentFactory: async () => this.registrationView.build(actionArgs.body.user.id),
      name: "registration",
    });
  }

  @BoltAction(Action.OPEN_SETTINGS_VIEW)
  async openSettingsView(actionArgs: BoltActionArgs) {
    await this.openView({
      actionArgs,
      contentFactory: async () => this.settingsView.build(actionArgs.body.user.id),
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
    await this.userSettingsService.update(actionArgs.body.user.id, { officeFilter });
    await this.openPresenceView(actionArgs);
  }

  @BoltAction(Action.SET_DATE_FILTER_VALUE)
  async setDateFilterValue(actionArgs: BoltActionArgs) {
    const dateFilter = actionArgs.payload["selected_date"];
    await this.userSettingsService.update(actionArgs.body.user.id, { dateFilter });
    await this.openPresenceView(actionArgs);
  }

  @BoltAction(Action.SET_USER_GROUP_FILTER_VALUE)
  async setUserGroupFilterValue(actionArgs: BoltActionArgs) {
    const receivedValue = actionArgs.payload["selected_option"]?.value;
    const userGroupFilter = !receivedValue || receivedValue == "ALL_GROUPS" ? null : receivedValue;
    await this.userSettingsService.update(actionArgs.body.user.id, { userGroupFilter });
    await this.openPresenceView(actionArgs);
  }

  /**
   * Abstract helper to show home tab views with less boilerplate.
   *
   * According to Bolt docs, `ack()` should be called ASAP. To comply with this,
   * we take a content factory instead of prebuild content as an argument.
   */
  private async openView({ actionArgs, contentFactory, name }: ViewProps) {
    await this.userSettingsService.update(actionArgs.body.user.id, { selectedView: name });
    const content = await contentFactory();
    this.homeTabService.update(actionArgs, content);
  }

  private async showUserNotFoundView(userId: string) {
    const { client } = this.boltService.getBolt();

    await client.views.publish({
      user_id: userId,
      view: HomeTab()
        .blocks(
          Header({ text: ":sos: Käyttäjää ei löytynyt!" }),
          Section({
            text:
              "Käyttäjääsi ei löydy Kaikun tietokannasta. Mikäli olet tuotantoympäristössä, " +
              "tämä viittaa vakavaan virheeseen, koska käyttäjien synkronoinnin pitäisi tapahtua " +
              "automaattisesti. Kehitysympäristössä synkronointia ei tehdä automaattisesti " +
              "API-rajoitusten vuoksi. Voit synkronoida käyttäjät klikkaamalla alla olevaa nappia " +
              "ja lataamalla tämän näkymän uudelleen.",
          }),
          Actions().elements(
            Button({
              text: ":recycle:  Sync Users",
              actionId: Action.SYNC_USERS,
            }),
          ),
        )
        .buildToObject(),
    });
  }
}
