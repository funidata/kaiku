import { Injectable } from "@nestjs/common";
import { HomeTab, ViewBlockBuilder } from "slack-block-builder";
import { Appendable } from "slack-block-builder/dist/internal";
import { BoltActionArgs } from "../../bolt/types/bolt-action-args.type";
import { ViewsPublishResponse } from "../../bolt/types/views-publish-response.type";
import { WebClient } from "../../bolt/types/web-client.type";
import { HomeTabControls } from "./home-tab-controls";

type PublishArgs = {
  userId: string;
  client: WebClient;
  content: Appendable<ViewBlockBuilder>;
};

@Injectable()
export class HomeTabService {
  constructor(private homeTabControls: HomeTabControls) {}

  /**
   * Publish home tab content view.
   *
   * Use this after an event, e.g., opening the app home tab.
   */
  async publish({ userId, client, content }: PublishArgs): Promise<ViewsPublishResponse> {
    return client.views.publish({
      user_id: userId,
      view: await this.build(content, userId),
    });
  }

  /**
   * Update home tab content.
   *
   * Use this after an action, e.g., clicking a button in the home tab.
   */
  async update(
    { body, client }: BoltActionArgs,
    content: Appendable<ViewBlockBuilder>,
  ): Promise<ViewsPublishResponse> {
    return client.views.update({
      view_id: body.view.id,
      view: await this.build(content, body.user.id),
    });
  }

  /**
   * Build home tab layout with given content in it.
   */
  private async build(content: Appendable<ViewBlockBuilder>, userId: string) {
    const controls = await this.homeTabControls.build(userId);

    return HomeTab()
      .blocks(...controls, ...content)
      .buildToObject();
  }
}
