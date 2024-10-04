import { Injectable } from "@nestjs/common";
import { Header } from "slack-block-builder";
import { Appendable, ViewBlockBuilder } from "slack-block-builder/dist/internal";
import { PresenceService } from "../../../entities/presence/presence.service";

@Injectable()
export class PresenceView {
  constructor(private presenceService: PresenceService) {}

  async build(): Promise<Appendable<ViewBlockBuilder>> {
    return [Header({ text: "Läsnäolijat" })];
  }
}
