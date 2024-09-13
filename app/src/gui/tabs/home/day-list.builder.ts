import { Injectable } from "@nestjs/common";
import dayjs, { Dayjs } from "dayjs";
import { flatten } from "lodash";
import { ViewBlockBuilder } from "slack-block-builder";
import { OfficeService } from "../../../entities/office/office.service";
import { BlockBuilder } from "../../block-builder.interface";
import { DayListItemBuilder } from "./day-list-item.builder";

/**
 * Get range of days from today (inclusive) for the next `len` working days
 * (defined as Mon-Fri).
 */
const dayRange = (len: number, days: Dayjs[] = [], i = 0): Dayjs[] => {
  if (i >= len) {
    return days;
  }

  if (days.length === 0) {
    days.push(dayjs());
    return dayRange(len, days, i + 1);
  }

  const prevDate = days.at(-1);
  const prevDay = prevDate.day();
  // Skip Saturdays (day 6) and Sundays (day 0).
  const daysToAdd = prevDay === 5 ? 3 : prevDay === 6 ? 2 : 1;
  days.push(prevDate.add(daysToAdd, "d"));

  return dayRange(len, days, i + 1);
};

@Injectable()
export class DayListBuilder implements BlockBuilder<ViewBlockBuilder> {
  constructor(
    private dayListItemBuilder: DayListItemBuilder,
    private officeService: OfficeService,
  ) {}

  async build() {
    const offices = await this.officeService.findAll();
    const dates = dayRange(14);
    const blockLists = dates.map((date) => this.dayListItemBuilder.build({ date, offices }));
    return flatten(blockLists);
  }
}