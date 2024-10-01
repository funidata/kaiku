import { Controller } from "@nestjs/common";
import BoltEvent from "../../../bolt/decorators/bolt-event.decorator";
import Event from "../../../bolt/enums/event.enum";
import { AppHomeOpenedArgs } from "../../../bolt/types/app-home-opened.type";
import { HomeTabBuilder } from "./home-tab.builder";

@Controller()
export class HomeTabController {
  constructor(private homeTabBlocks: HomeTabBuilder) {}

  @BoltEvent(Event.APP_HOME_OPENED)
  async getView(args: AppHomeOpenedArgs) {
    await this.homeTabBlocks.publish(args);
  }
}
