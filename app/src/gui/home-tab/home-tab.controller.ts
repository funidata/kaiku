import { Controller } from "@nestjs/common";
import BoltAction from "../../bolt/decorators/bolt-action.decorator";
import BoltEvent from "../../bolt/decorators/bolt-event.decorator";
import Action from "../../bolt/enums/action.enum";
import Event from "../../bolt/enums/event.enum";
import { AppHomeOpenedArgs } from "../../bolt/types/app-home-opened.type";
import { BoltActionArgs } from "../../bolt/types/bolt-action-args.type";
import { HomeTabBuilder } from "./home-tab.builder";
import { PresenceView } from "./views/presence-view";

@Controller()
export class HomeTabController {
  constructor(
    private homeTabBuilder: HomeTabBuilder,
    private presenceView: PresenceView,
  ) {}

  @BoltEvent(Event.APP_HOME_OPENED)
  async getView(args: AppHomeOpenedArgs) {
    const view = await this.homeTabBuilder.buildView(args.event.user);
    await this.homeTabBuilder.publish(args, view);
  }

  @BoltAction(Action.OPEN_PRESENCE_VIEW)
  async openPresenceView(args: BoltActionArgs) {
    await args.ack();
    const content = await this.presenceView.build();
    this.homeTabBuilder.update(args, content);
  }
}
