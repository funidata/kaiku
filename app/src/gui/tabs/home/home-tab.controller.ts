import { Controller } from "@nestjs/common";
import { HomeTab } from "slack-block-builder";
import BoltEvent from "../../../bolt/decorators/bolt-event.decorator";
import Event from "../../../bolt/enums/event.enum";
import { AppHomeOpenedArgs } from "../../../bolt/types/app-home-opened.type";
import { HomeTabBuilder } from "./home-tab.builder";

@Controller()
export class HomeTabController {
  constructor(private homeTabBlocks: HomeTabBuilder) {}

  @BoltEvent(Event.APP_HOME_OPENED)
  async getView({ event, client, logger }: AppHomeOpenedArgs) {
    const blocks = await this.homeTabBlocks.build();
    const view = HomeTab()
      .blocks(...blocks)
      .buildToObject();

    try {
      const result = await client.views.publish({
        user_id: event.user,
        view,
      });

      logger.debug(result);
    } catch (error) {
      logger.error(error);
    }
  }
}
