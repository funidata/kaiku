import { Injectable } from "@nestjs/common";
import { Header, ViewBlockBuilder } from "slack-block-builder";
import { Appendable } from "slack-block-builder/dist/internal";
import { DayList } from "./day-list";
import { VisibleOfficeSelect } from "./visible-office-select";

@Injectable()
export class RegistrationView {
  constructor(
    private dayListBlocks: DayList,
    private visibleOfficeSelectBuilder: VisibleOfficeSelect,
  ) {}

  async build(userId: string): Promise<Appendable<ViewBlockBuilder>> {
    const officeSelect = await this.visibleOfficeSelectBuilder.build();
    const dayList = await this.dayListBlocks.build(userId);

    return [Header({ text: "Ilmoittautuminen" }), ...officeSelect, ...dayList];
  }
}
