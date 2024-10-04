import { Injectable } from "@nestjs/common";
import { Header, HomeTab, ViewBlockBuilder } from "slack-block-builder";
import { Appendable, SlackHomeTabDto } from "slack-block-builder/dist/internal";
import { AppHomeOpenedArgs } from "../../bolt/types/app-home-opened.type";
import { BoltActionArgs } from "../../bolt/types/bolt-action-args.type";
import { ViewsPublishResponse } from "../../bolt/types/views-publish-response.type";
import { HomeTabControls } from "./home-tab-controls";
import { DayList } from "./views/day-list.builder";
import { VisibleOfficeSelect } from "./views/visible-office-select.builder";

@Injectable()
export class HomeTabBuilder {
  constructor(
    private dayListBlocks: DayList,
    private visibleOfficeSelectBuilder: VisibleOfficeSelect,
    private homeTabControls: HomeTabControls,
  ) {}

  async buildBlocks(userId: string): Promise<Appendable<ViewBlockBuilder>> {
    const controls = this.homeTabControls.build();
    const officeSelect = await this.visibleOfficeSelectBuilder.buildBlocks();
    const dayList = await this.dayListBlocks.buildBlocks(userId);

    return [...controls, Header({ text: "Ilmoittautuminen" }), ...officeSelect, ...dayList];
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
    { body, client }: BoltActionArgs,
    content: Appendable<ViewBlockBuilder>,
  ): Promise<ViewsPublishResponse> {
    return client.views.update({
      view_id: body.view.id,
      view: await this.build(content),
    });
  }
}
