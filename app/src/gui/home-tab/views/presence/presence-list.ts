import { Injectable } from "@nestjs/common";
import { capitalize } from "lodash";
import { Header } from "slack-block-builder";
import { Appendable, ViewBlockBuilder } from "slack-block-builder/dist/internal";
import dayjs from "../../../../common/dayjs";
import { Presence } from "../../../../entities/presence/presence.model";
import { RichText } from "../../../block-builders/rich-text.builder";

type PresenceSearchResult = {
  date: Date;
  entries: Presence[];
};

@Injectable()
export class PresenceList {
  build(results: PresenceSearchResult[]): Appendable<ViewBlockBuilder> {
    return results.flatMap((result) => [
      Header({ text: capitalize(dayjs(result.date).format("dddd D.M.")) }),
      RichText().elements(this.entryList(result.entries)),
    ]);
  }

  private entryList(entries: Presence[]) {
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
