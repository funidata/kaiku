import { Injectable } from "@nestjs/common";
import { capitalize } from "lodash";
import { Context, Header } from "slack-block-builder";
import { Appendable, ViewBlockBuilder } from "slack-block-builder/dist/internal";
import dayjs from "../../../../common/dayjs";
import { RichText } from "../../../block-builders/rich-text.builder";
import { CommonPresence, PresencesByDate } from "./types";

@Injectable()
export class PresenceList {
  build(results: PresencesByDate[]): Appendable<ViewBlockBuilder> {
    return results.flatMap((result) => [
      Header({ text: capitalize(dayjs(result.date).format("dddd D.M.")) }),
      this.peopleList(result.presences),
    ]);
  }

  private peopleList(presences: CommonPresence[]) {
    if (presences.length === 0) {
      return Context().elements("Ei ilmoittautumisia valituilla kriteereillä.");
    }

    const sorted = presences.toSorted((a, b) =>
      a.user.realName.localeCompare(b.user.realName, "fi", { sensitivity: "base" }),
    );

    const bulletPoints = sorted.map((entry) => ({
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

    return RichText().elements({
      type: "rich_text_list",
      style: "bullet",
      elements: bulletPoints,
    });
  }
}
