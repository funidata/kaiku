import { Injectable } from "@nestjs/common";
import { HomeTab, ViewBlockBuilder } from "slack-block-builder";
import { Appendable } from "slack-block-builder/dist/internal";
import { AppHomeOpenedArgs } from "../../bolt/types/app-home-opened.type";
import { BoltActionArgs } from "../../bolt/types/bolt-action-args.type";
import { ViewsPublishResponse } from "../../bolt/types/views-publish-response.type";
import { HomeTabControls } from "./home-tab-controls";

@Injectable()
export class HomeTabBuilder {
  constructor(private homeTabControls: HomeTabControls) {}

  async build(content: Appendable<ViewBlockBuilder>) {
    const controls = this.homeTabControls.build();

    return HomeTab()
      .blocks(...controls, ...content)
      .buildToObject();
  }

  async publish(
    { client, event }: AppHomeOpenedArgs,
    content: Appendable<ViewBlockBuilder>,
  ): Promise<ViewsPublishResponse> {
    return client.views.publish({
      user_id: event.user,
      view: await this.build(content),
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
