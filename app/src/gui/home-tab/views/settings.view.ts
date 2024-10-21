import { Injectable } from "@nestjs/common";
import { Header } from "slack-block-builder";
import { Appendable, ViewBlockBuilder } from "slack-block-builder/dist/internal";

@Injectable()
export class SettingsView {
  async build(): Promise<Appendable<ViewBlockBuilder>> {
    return [Header({ text: "Asetukset" })];
  }
}
