import { Injectable } from "@nestjs/common";
import dayjs, { Dayjs } from "dayjs";
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
    const results = this.presenceList.build(presenceEntries);

    return [Header({ text: "Läsnäolijat" }), ...officeFilter, ...dateFilter, Divider(), ...results];
  }

  private async fetchFilteredPresences(settings: UserSettings) {
    const startDate = settings.dateFilter || new Date().toISOString();
    const endDate = dayjs(startDate).add(2, "weeks").toISOString();

    const type = settings.officeFilter === "REMOTE" ? PresenceType.REMOTE : PresenceType.OFFICE;

    const entries = await this.presenceService.findByFilter({
      startDate,
      endDate,
      type,
    });

    return this.groupByDateContinuous(entries, dayjs(startDate), dayjs(endDate));
  }

  /**
   * Group given presence list by date.
   *
   * Result will include all days between `from` and `to`, inclusive. Weekends
   * are excluded.
   */
  private groupByDateContinuous(entries: Presence[], from: Dayjs, to: Dayjs) {
    const grouped = [];
    let curr = from;

    while (to.diff(curr, "days") > 0) {
      if (curr.day() === 0 || curr.day() === 6) {
        curr = curr.add(1, "day");
        continue;
      }

      grouped.push({
        date: curr,
        entries: entries.filter((entry) => dayjs(entry.date).isSame(curr, "day")),
      });

      curr = curr.add(1, "day");
    }

    return grouped;
  }
}
