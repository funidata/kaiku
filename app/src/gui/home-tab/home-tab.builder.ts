import { Injectable } from "@nestjs/common";
import { BlockAction } from "@slack/bolt";
import { Actions, Button, Header, HomeTab, ViewBlockBuilder } from "slack-block-builder";
import { Appendable, SlackHomeTabDto } from "slack-block-builder/dist/internal";
import Action from "../../bolt/enums/action.enum";
import { AppHomeOpenedArgs } from "../../bolt/types/app-home-opened.type";
import { ViewsPublishResponse } from "../../bolt/types/views-publish-response.type";
import { WebClient } from "../../bolt/types/web-client.type";
import { DevUiBuilder } from "../dev/dev-ui.builder";
import { DayList } from "./views/day-list.builder";
import { VisibleOfficeSelect } from "./views/visible-office-select.builder";

@Injectable()
export class HomeTabBuilder {
  constructor(
    private dayListBlocks: DayList,
    private devToolsBuilder: DevUiBuilder,
    private visibleOfficeSelectBuilder: VisibleOfficeSelect,
  ) {}

  async buildBlocks(userId: string): Promise<Appendable<ViewBlockBuilder>> {
    const devTools = this.devToolsBuilder.buildBlocks();
    const officeSelect = await this.visibleOfficeSelectBuilder.buildBlocks();
    const dayList = await this.dayListBlocks.buildBlocks(userId);
    return [
      ...devTools,
      Actions().elements([
        Button({ text: "Ilmoittautuminen" }),
        Button({ text: "Läsnäolijat", actionId: Action.OPEN_PRESENCE_VIEW }),
        Button({ text: "Asetukset" }),
      ]),
      Header({ text: "Ilmoittautuminen" }),
      ...officeSelect,
      ...dayList,
    ];
  }

  // TODO: Remove
  async buildView(userId: string): Promise<SlackHomeTabDto> {
    return HomeTab()
      .blocks(...(await this.buildBlocks(userId)))
      .buildToObject();
  }

  async build(blocks: Appendable<ViewBlockBuilder>) {
    return (
      HomeTab()
        // TODO: Needs "global" items.
        .blocks(...blocks)
        .buildToObject()
    );
  }

  async publish(
    { client, event }: AppHomeOpenedArgs,
    view: SlackHomeTabDto,
  ): Promise<ViewsPublishResponse> {
    return client.views.publish({
      user_id: event.user,
      view,
    });
  }

  async update(
    action: BlockAction,
    client: WebClient,
    content: Appendable<ViewBlockBuilder>,
  ): Promise<ViewsPublishResponse> {
    return client.views.update({
      view_id: action.view.id,
      view: await this.build(content),
    });
  }
}
