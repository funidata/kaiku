import { Injectable } from "@nestjs/common";
import { HomeTab, ViewBlockBuilder } from "slack-block-builder";
import { Appendable } from "slack-block-builder/dist/internal";
import { AppHomeOpenedArgs } from "../../bolt/types/app-home-opened.type";
import { BoltActionArgs } from "../../bolt/types/bolt-action-args.type";
import { ViewsPublishResponse } from "../../bolt/types/views-publish-response.type";
import { HomeTabControls } from "./home-tab-controls";

@Injectable()
export class HomeTabService {
  constructor(private homeTabControls: HomeTabControls) {}

  /**
   * Publish home tab content view.
   *
   * Use this after an event, e.g., opening the app home tab.
   */
  async publish(
    { client, event }: AppHomeOpenedArgs,
    content: Appendable<ViewBlockBuilder>,
  ): Promise<ViewsPublishResponse> {
    return client.views.publish({
      user_id: event.user,
      view: await this.build(content),
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
      view: await this.build(content),
    });
  }

  /**
   * Build home tab layout with given content in it.
   */
  private async build(content: Appendable<ViewBlockBuilder>) {
    const controls = this.homeTabControls.build();

    return HomeTab()
      .blocks(...controls, ...content)
      .buildToObject();
  }
}
