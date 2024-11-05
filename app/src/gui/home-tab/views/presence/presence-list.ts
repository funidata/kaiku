import { Injectable } from "@nestjs/common";
import { Header } from "slack-block-builder";
import { Appendable, ViewBlockBuilder } from "slack-block-builder/dist/internal";
import { Presence } from "../../../../entities/presence/presence.model";

type PresenceSearchResult = {
  date: Date;
  entries: Presence[];
};

@Injectable()
export class PresenceList {
  build(results: PresenceSearchResult[]): Appendable<ViewBlockBuilder> {
    return results.flatMap((result) => [
      Header({ text: "date" }),
      {
        build: () => ({
          type: "rich_text",
          elements: [this.listFromEntries(result.entries)],
        }),
      } as any,
    ]);
  }

  private listFromEntries(entries: Presence[]) {
    return {
      type: "rich_text_list",
      style: "bullet",
      elements: entries.map((entry) => ({
        type: "rich_text_section",
        elements: [
          {
            type: "text",
            text: `${entry.user.realName} (`,
          },
          {
            type: "user",
            user_id: entry.user.slackId,
          },
          { type: "text", text: ")" },
        ],
      })),
    };
  }
}
