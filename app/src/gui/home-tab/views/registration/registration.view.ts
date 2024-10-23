import { Injectable } from "@nestjs/common";
import { Header, ViewBlockBuilder } from "slack-block-builder";
import { Appendable } from "slack-block-builder/dist/internal";
import { DayList } from "./day-list";

@Injectable()
export class RegistrationView {
  constructor(private dayListBlocks: DayList) {}

  async build(userId: string): Promise<Appendable<ViewBlockBuilder>> {
    const dayList = await this.dayListBlocks.build(userId);

    return [Header({ text: "Ilmoittautuminen" }), ...dayList];
  }
}
