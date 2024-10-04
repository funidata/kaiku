import { Injectable } from "@nestjs/common";
import { Header, ViewBlockBuilder } from "slack-block-builder";
import { Appendable } from "slack-block-builder/dist/internal";
import { DayList } from "./day-list.builder";
import { VisibleOfficeSelect } from "./visible-office-select.builder";

@Injectable()
export class RegistrationView {
  constructor(
    private dayListBlocks: DayList,
    private visibleOfficeSelectBuilder: VisibleOfficeSelect,
  ) {}

  async build(userId: string): Promise<Appendable<ViewBlockBuilder>> {
    const officeSelect = await this.visibleOfficeSelectBuilder.buildBlocks();
    const dayList = await this.dayListBlocks.buildBlocks(userId);

    return [Header({ text: "Ilmoittautuminen" }), ...officeSelect, ...dayList];
  }
}
