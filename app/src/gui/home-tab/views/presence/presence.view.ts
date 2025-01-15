import { Injectable } from "@nestjs/common";
import dayjs, { Dayjs } from "dayjs";
import { get } from "lodash";
import { Divider, Header } from "slack-block-builder";
import { Appendable, ViewBlockBuilder } from "slack-block-builder/dist/internal";
import { workDayRange } from "../../../../common/work-day-range";
import { ConstantPresence } from "../../../../entities/constant-presence/constant-presence.model";
import { ConstantPresenceService } from "../../../../entities/constant-presence/constant-presence.service";
import { Presence } from "../../../../entities/presence/presence.model";
import { PresenceService } from "../../../../entities/presence/presence.service";
import { UserSettings } from "../../../../entities/user-settings/user-settings.model";
import { UserSettingsService } from "../../../../entities/user-settings/user-settings.service";
import { DateFilter } from "./date-filter";
import { OfficeFilter } from "./office-filter";
import { PresenceList } from "./presence-list";
import { PresencesByDate } from "./types";
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
    private constantPresenceService: ConstantPresenceService,
  ) {}

  async build(userId: string): Promise<Appendable<ViewBlockBuilder>> {
    const userSettings = await this.getUserSettings(userId);
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

    const remote = settings.officeFilter === "REMOTE";
    const officeId = !["REMOTE", "ALL_OFFICES"].includes(settings.officeFilter)
      ? settings.officeFilter
      : null;

    const precenses = await this.presenceService.findByFilter({
      startDate,
      endDate,
      remote,
      officeId,
      userGroup: settings.userGroupFilter,
    });

    const constantPresences = await this.constantPresenceService.findByDateRange(
      { start: dayjs(startDate), end: dayjs(endDate) },
      { userGroupHandle: settings.userGroupFilter, officeId, remote },
    );

    return this.buildDailyPresenceLists(precenses, constantPresences, dayjs(startDate));
  }

  /**
   * Build presence lists for next 10 working days.
   *
   * The presence lists returned for each day are "exclusive" in the sense that
   * they are guaranteed to have only one entry per user per day. Manual
   * presence registrations are preferred over constant presences, if both are
   * found for the same day.
   */
  private buildDailyPresenceLists(
    presences: Presence[],
    constantPresences: ConstantPresence[],
    from: Dayjs,
  ): PresencesByDate[] {
    const days = workDayRange(10, from);

    const grouped = days.map((date) => {
      // We want only one presence per user, preferring manual registrations over constant presences.
      const daysManualEntries = presences.filter((p) => dayjs(p.date).isSame(date, "day"));
      const daysConstantPresences = constantPresences.filter(
        (cp) => cp.dayOfWeek === date.weekday(),
      );

      // Index both arrays by user ID to avoid nested loops.
      const daysManualEntriesByUser = Object.fromEntries(
        daysManualEntries.map((p) => [p.user.slackId, p]),
      );
      const daysConstantPresencesByUser = Object.fromEntries(
        daysConstantPresences.map((cp) => [cp.user.slackId, cp]),
      );

      // Unique values of the union of both lists' keys ensure all users with any entries are included.
      const usersWithAnyPresence = new Set(
        Object.keys(daysManualEntriesByUser).concat(Object.keys(daysConstantPresencesByUser)),
      );

      const effectivePresences = Array.from(usersWithAnyPresence).map((userId) => {
        const manualRegistration = get(daysManualEntriesByUser, userId);
        const constantPresence = get(daysConstantPresencesByUser, userId);
        return manualRegistration || constantPresence;
      });

      return {
        date,
        presences: effectivePresences,
      };
    });

    return grouped;
  }

  /**
   * Reset date filter to today if it was last set earlier than today.
   *
   * The idea here is to make presence view automatically show today's presences
   * first while still retaining the ability to choose a date and persist the
   * selection throughout switching views.
   */
  private async resetDateFilterDaily(userId: string, userSettings: UserSettings) {
    const { dateFilterUpdatedAt } = userSettings;
    if (!dateFilterUpdatedAt || dayjs(dateFilterUpdatedAt).isBefore(dayjs(), "day")) {
      await this.userSettingsService.update(userId, { dateFilter: dayjs().toISOString() });
      return this.userSettingsService.findForUser(userId);
    }

    return userSettings;
  }

  private async getUserSettings(userId: string) {
    const userSettings = await this.userSettingsService.findForUser(userId);
    return this.resetDateFilterDaily(userId, userSettings);
  }
}
