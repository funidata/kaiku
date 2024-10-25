import { Injectable } from "@nestjs/common";
import { Header } from "slack-block-builder";
import { Appendable, ViewBlockBuilder } from "slack-block-builder/dist/internal";
import { Presence, PresenceType } from "../../../../entities/presence/presence.model";
import { PresenceService } from "../../../../entities/presence/presence.service";
import { UserSettings } from "../../../../entities/user-settings/user-settings.model";
import { UserSettingsService } from "../../../../entities/user-settings/user-settings.service";
import { OfficeFilter } from "./office-filter";

@Injectable()
export class PresenceView {
  constructor(
    private presenceService: PresenceService,
    private officeFilter: OfficeFilter,
    private userSettingsService: UserSettingsService,
  ) {}

  async build(userId: string): Promise<Appendable<ViewBlockBuilder>> {
    const userSettings = await this.userSettingsService.findForUser(userId);
    const presenceEntries = await this.fetchFilteredPresences(userSettings);
    console.log(presenceEntries);
    const officeFilter = await this.officeFilter.build();
    return [Header({ text: "Läsnäolijat" }), ...officeFilter];
  }

  private async fetchFilteredPresences(settings: UserSettings): Promise<Presence[]> {
    const date = new Date();
    const type = settings.officeFilter === "REMOTE" ? PresenceType.REMOTE : PresenceType.OFFICE;

    return this.presenceService.findByFilter({ date, type });
  }
}
