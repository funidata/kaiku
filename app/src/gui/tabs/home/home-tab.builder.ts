import { Injectable } from "@nestjs/common";
import { BlockAction } from "@slack/bolt";
import { Header, HomeTab, ViewBlockBuilder } from "slack-block-builder";
import { Appendable, SlackHomeTabDto } from "slack-block-builder/dist/internal";
import { AppHomeOpenedArgs } from "../../../bolt/types/app-home-opened.type";
import { ViewsPublishResponse } from "../../../bolt/types/views-publish-response.type";
import { WebClient } from "../../../bolt/types/web-client.type";
import { BlockBuilder } from "../../block-builder.interface";
import { DevUiBuilder } from "../../dev/dev-ui.builder";
import { DayListBuilder } from "./day-list.builder";
import { VisibleOfficeSelectBuilder } from "./visible-office-select.builder";

@Injectable()
export class HomeTabBuilder implements BlockBuilder<ViewBlockBuilder> {
  constructor(
    private dayListBlocks: DayListBuilder,
    private devToolsBuilder: DevUiBuilder,
    private visibleOfficeSelectBuilder: VisibleOfficeSelectBuilder,
  ) {}

  async buildBlocks(userId: string): Promise<Appendable<ViewBlockBuilder>> {
    const devTools = this.devToolsBuilder.buildBlocks();
    const officeSelect = await this.visibleOfficeSelectBuilder.buildBlocks();
    const dayList = await this.dayListBlocks.buildBlocks(userId);
    return [...devTools, Header({ text: "Ilmoittautumiset" }), ...officeSelect, ...dayList];
  }

  async buildView(userId: string): Promise<SlackHomeTabDto> {
    return HomeTab()
      .blocks(...(await this.buildBlocks(userId)))
      .buildToObject();
  }

  async publish({ client, event }: AppHomeOpenedArgs): Promise<ViewsPublishResponse> {
    const blocks = await this.buildBlocks(event.user);

    return client.views.publish({
      user_id: event.user,
      view: HomeTab()
        .blocks(...blocks)
        .buildToObject(),
    });
  }

  async update(action: BlockAction, client: WebClient): Promise<ViewsPublishResponse> {
    return client.views.update({
      view_id: action.view.id,
      view: await this.buildView(action.user.id),
    });
  }
}
