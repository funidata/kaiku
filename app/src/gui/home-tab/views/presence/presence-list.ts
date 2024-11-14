import { Injectable } from "@nestjs/common";
import { Dayjs } from "dayjs";
import { capitalize } from "lodash";
import { Header } from "slack-block-builder";
import { Appendable, ViewBlockBuilder } from "slack-block-builder/dist/internal";
import dayjs from "../../../../common/dayjs";
import { Presence } from "../../../../entities/presence/presence.model";
import { RichText } from "../../../block-builders/rich-text.builder";

type PresenceSearchResult = {
  date: Dayjs;
  entries: Presence[];
};

@Injectable()
export class PresenceList {
  build(results: PresenceSearchResult[]): Appendable<ViewBlockBuilder> {
    return results.flatMap((result) => [
      Header({ text: capitalize(dayjs(result.date).format("dddd D.M.")) }),
      RichText().elements({
        type: "rich_text_list",
        style: "bullet",
        elements: this.peopleList(result.entries),
      }),
    ]);
  }

  private peopleList(entries: Presence[]) {
    const sorted = entries.toSorted((a, b) =>
      a.user.realName.localeCompare(b.user.realName, "fi", { sensitivity: "base" }),
    );

    return sorted.map((entry) => ({
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
    }));
  }
}
