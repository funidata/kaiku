import { Dayjs } from "dayjs";
import dayjs from "./dayjs";

/**
 * Range of Dayjs objects for the next `n` working days (Mon-Fri) counting from
 * today or from an optional `from` parameter.
 */
export const workDayRange = (n: number, from = dayjs()): Dayjs[] => {
  // Increment n to account for weekends that will be filtered out after creating the date range.
  const nPadded = Math.ceil(n + (n / 5) * 2);
  const allDays = Array.from(Array(nPadded)).map((_, i) => from.add(i, "days"));
  const workDays = allDays.filter((d) => ![0, 6].includes(d.day()));
  return workDays.slice(0, n);
};
