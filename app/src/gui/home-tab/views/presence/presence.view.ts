import { Injectable } from "@nestjs/common";
import { Header } from "slack-block-builder";
import { Appendable, ViewBlockBuilder } from "slack-block-builder/dist/internal";
import { PresenceService } from "../../../../entities/presence/presence.service";
import { VisibleOfficeSelect } from "./visible-office-select";

@Injectable()
export class PresenceView {
  constructor(
    private presenceService: PresenceService,
    private visibleOfficeSelectBuilder: VisibleOfficeSelect,
  ) {}

  async build(): Promise<Appendable<ViewBlockBuilder>> {
    const officeSelect = await this.visibleOfficeSelectBuilder.build();
    return [Header({ text: "Läsnäolijat" }), ...officeSelect];
  }
}
