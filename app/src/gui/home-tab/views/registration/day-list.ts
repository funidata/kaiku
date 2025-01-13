import { Injectable } from "@nestjs/common";
import { first, flatten, last } from "lodash";
import dayjs from "../../../../common/dayjs";
import { workDayRange } from "../../../../common/work-day-range";
import { ConstantPresenceService } from "../../../../entities/constant-presence/constant-presence.service";
import { OfficeService } from "../../../../entities/office/office.service";
import { PresenceService } from "../../../../entities/presence/presence.service";
import { DayListItem } from "./day-list-item";

@Injectable()
export class DayList {
  constructor(
    private dayListItem: DayListItem,
    private officeService: OfficeService,
    private presenceService: PresenceService,
    private cpService: ConstantPresenceService,
  ) {}

  async build(userId: string) {
    const dates = workDayRange(10);
    const presences = await this.presenceService.findPresencesByUser(userId);
    const constantPresences = await this.cpService.findByDateRange(
      {
        start: first(dates),
        end: last(dates),
      },
      { userId },
    );

    const offices = await this.officeService.findAll();
    const blockLists = dates.map((date) => {
      const currentPresence = presences.find((presence) =>
        date.isSame(dayjs(presence.date), "date"),
      );

      const constantPresence = constantPresences.find((cp) => cp.dayOfWeek === date.weekday());

      return this.dayListItem.build({ date, offices, presence: currentPresence, constantPresence });
    });
    return flatten(blockLists);
  }
}
