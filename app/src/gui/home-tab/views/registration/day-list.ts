import { Injectable } from "@nestjs/common";
import dayjs, { Dayjs } from "dayjs";
import { flatten } from "lodash";
import { OfficeService } from "../../../../entities/office/office.service";
import { PresenceService } from "../../../../entities/presence/presence.service";
import { DayListItem } from "./day-list-item";

/**
 * Range of Dayjs objects for next `n` working days (Mon-Fri) including today.
 */
const workDayRange = (n: number): Dayjs[] => {
  // Increment n to account for weekends that will be filtered out after creating the date range.
  const nPadded = Math.ceil(n + (n / 5) * 2);
  const allDays = Array.from(Array(nPadded)).map((_, i) => dayjs().add(i, "days"));
  const workDays = allDays.filter((d) => ![0, 6].includes(d.day()));
  return workDays.slice(0, n);
};

@Injectable()
export class DayList {
  constructor(
    private dayListItemBuilder: DayListItem,
    private officeService: OfficeService,
    private presenceService: PresenceService,
  ) {}

  async build(userId: string) {
    const presences = await this.presenceService.findPresencesByUser(userId);
    const offices = await this.officeService.findAll();
    const dates = workDayRange(10);
    const blockLists = dates.map((date) =>
      this.dayListItemBuilder.build({ date, offices, presences }),
    );
    return flatten(blockLists);
  }
}
