import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { HomeTab, ViewBlockBuilder } from "slack-block-builder";
import { Appendable } from "slack-block-builder/dist/internal";
import { BoltService } from "../../bolt/bolt.service";
import { BoltActionArgs } from "../../bolt/types/bolt-action-args.type";
import { ViewsPublishResponse } from "../../bolt/types/views-publish-response.type";
import { HomeTabControls } from "./home-tab-controls";

type PublishArgs = {
  userId: string;
  content: Appendable<ViewBlockBuilder>;
};

@Injectable()
export class HomeTabService {
  constructor(
    private homeTabControls: HomeTabControls,
    private boltService: BoltService,
  ) {}

  /**
   * Publish home tab content view.
   *
   * Use this after an event, e.g., opening the app home tab.
   */
  async publish({ userId, content }: PublishArgs): Promise<ViewsPublishResponse> {
    const { client } = this.boltService.getBolt();
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
    if (!body.view) {
      throw new InternalServerErrorException();
    }
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
