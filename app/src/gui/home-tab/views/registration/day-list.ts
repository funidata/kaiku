import { Injectable } from "@nestjs/common";
import { flatten } from "lodash";
import dayjs from "../../../../common/dayjs";
import { workDayRange } from "../../../../common/work-day-range";
import { OfficeService } from "../../../../entities/office/office.service";
import { PresenceService } from "../../../../entities/presence/presence.service";
import { DayListItem } from "./day-list-item";

@Injectable()
export class DayList {
  constructor(
    private dayListItem: DayListItem,
    private officeService: OfficeService,
    private presenceService: PresenceService,
  ) {}

  async build(userId: string) {
    const dates = workDayRange(10);
    const presences = await this.presenceService.findPresencesByUser(userId);

    const offices = await this.officeService.findAll();
    const blockLists = dates.map((date) => {
      const currentPresence = presences.find((presence) =>
        date.isSame(dayjs(presence.date), "date"),
      );

      return this.dayListItem.build({ date, offices, presence: currentPresence });
    });
    return flatten(blockLists);
  }
}
