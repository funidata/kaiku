import { Injectable } from "@nestjs/common";
import dayjs, { Dayjs } from "dayjs";
import { Divider, Header } from "slack-block-builder";
import { Appendable, ViewBlockBuilder } from "slack-block-builder/dist/internal";
import { workDayRange } from "../../../../common/work-day-range";
import { Presence, PresenceType } from "../../../../entities/presence/presence.model";
import { PresenceService } from "../../../../entities/presence/presence.service";
import { UserSettings } from "../../../../entities/user-settings/user-settings.model";
import { UserSettingsService } from "../../../../entities/user-settings/user-settings.service";
import { DateFilter } from "./date-filter";
import { OfficeFilter } from "./office-filter";
import { PresenceList } from "./presence-list";
import { UserGroupFilter } from "./user-group-filter";

@Injectable()
export class PresenceView {
  constructor(
    private presenceService: PresenceService,
    private officeFilter: OfficeFilter,
    private dateFilter: DateFilter,
    private userGroupFilter: UserGroupFilter,
    private userSettingsService: UserSettingsService,
    private presenceList: PresenceList,
  ) {}

  async build(userId: string): Promise<Appendable<ViewBlockBuilder>> {
    const userSettings = await this.userSettingsService.findForUser(userId);
    const presenceEntries = await this.fetchFilteredPresences(userSettings);

    const officeFilter = await this.officeFilter.build(userSettings.officeFilter);
    const dateFilter = this.dateFilter.build(userSettings.dateFilter);
    const userGroupFilter = await this.userGroupFilter.build(userSettings.userGroupFilter);
    const results = this.presenceList.build(presenceEntries);

    return [
      Header({ text: "Läsnäolijat" }),
      officeFilter,
      dateFilter,
      userGroupFilter,
      Divider(),
      ...results,
    ];
  }

  private async fetchFilteredPresences(settings: UserSettings) {
    const startDate = settings.dateFilter || new Date().toISOString();
    const endDate = dayjs(startDate).add(2, "weeks").toISOString();

    const type = settings.officeFilter === "REMOTE" ? PresenceType.REMOTE : PresenceType.OFFICE;

    const entries = await this.presenceService.findByFilter({
      startDate,
      endDate,
      type,
      userGroup: settings.userGroupFilter,
    });

    return this.groupByDateContinuous(entries, dayjs(startDate));
  }

  /**
   * Group given presence list by date.
   *
   * Weekends are excluded but working days are included even if they have no
   * entries.
   */
  private groupByDateContinuous(entries: Presence[], from: Dayjs) {
    const days = workDayRange(10, from);

    const grouped = days.map((date) => ({
      date,
      entries: entries.filter((entry) => dayjs(entry.date).isSame(date, "day")),
    }));

    return grouped;
  }
}
