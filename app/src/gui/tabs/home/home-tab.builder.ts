import { Injectable } from "@nestjs/common";
import { Header, ViewBlockBuilder } from "slack-block-builder";
import { BlockBuilder } from "../../block-builder.interface";
import { DevUiBuilder } from "../../dev/dev-ui.builder";
import { DayListBuilder } from "./day-list.builder";
import { VisibleOfficeSelectBuilder } from "./visible-office-select.builder";

@Injectable()
export class HomeTabBuilder implements BlockBuilder<ViewBlockBuilder> {
  constructor(
    private dayListBlocks: DayListBuilder,
    private devToolsBuilder: DevUiBuilder,
    private visibleOfficeSelectBuilder: VisibleOfficeSelectBuilder,
  ) {}

  async build() {
    const devTools = this.devToolsBuilder.build();
    const officeSelect = await this.visibleOfficeSelectBuilder.build();
    const dayList = await this.dayListBlocks.build();
    return [...devTools, Header({ text: "Ilmoittautumiset" }), ...officeSelect, ...dayList];
  }
}
