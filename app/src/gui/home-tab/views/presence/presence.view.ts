import { Injectable } from "@nestjs/common";
import dayjs from "dayjs";
import { Divider, Header } from "slack-block-builder";
import { Appendable, ViewBlockBuilder } from "slack-block-builder/dist/internal";
import { Presence, PresenceType } from "../../../../entities/presence/presence.model";
import { PresenceService } from "../../../../entities/presence/presence.service";
import { UserSettings } from "../../../../entities/user-settings/user-settings.model";
import { UserSettingsService } from "../../../../entities/user-settings/user-settings.service";
import { DateFilter } from "./date-filter";
import { OfficeFilter } from "./office-filter";
import { PresenceList } from "./presence-list";

@Injectable()
export class PresenceView {
  constructor(
    private presenceService: PresenceService,
    private officeFilter: OfficeFilter,
    private dateFilter: DateFilter,
    private userSettingsService: UserSettingsService,
    private presenceList: PresenceList,
  ) {}

  async build(userId: string): Promise<Appendable<ViewBlockBuilder>> {
    const userSettings = await this.userSettingsService.findForUser(userId);
    const presenceEntries = await this.fetchFilteredPresences(userSettings);

    const officeFilter = await this.officeFilter.build(userSettings.officeFilter);
    const dateFilter = this.dateFilter.build(userSettings.dateFilter);
    const results = this.presenceResults(presenceEntries);

    return [Header({ text: "Läsnäolijat" }), ...officeFilter, ...dateFilter, Divider(), ...results];
  }

  private presenceResults(entries: Presence[]): Appendable<ViewBlockBuilder> {
    // TODO: Group entries by date and sort.
    const asd = this.presenceList.build([
      { date: new Date(), entries },
      { date: new Date(), entries: [] },
    ]);
    return asd;
  }

  private async fetchFilteredPresences(settings: UserSettings): Promise<Presence[]> {
    const startDate = settings.dateFilter || new Date().toISOString();
    const endDate = dayjs(startDate).add(2, "weeks").toISOString();

    const type = settings.officeFilter === "REMOTE" ? PresenceType.REMOTE : PresenceType.OFFICE;

    return this.presenceService.findByFilter({
      startDate,
      endDate,
      type,
    });
  }
}
