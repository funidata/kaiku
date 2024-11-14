import { Injectable } from "@nestjs/common";
import { flatten } from "lodash";
import { workDayRange } from "../../../../common/work-day-range";
import { OfficeService } from "../../../../entities/office/office.service";
import { PresenceService } from "../../../../entities/presence/presence.service";
import { DayListItem } from "./day-list-item";

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
