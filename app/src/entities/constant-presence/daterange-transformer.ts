import dayjs, { Dayjs } from "dayjs";

export type DateRange = {
  start: Dayjs | undefined;
  end: Dayjs | undefined;
};

/**
 * Parse Dayjs object from unknown input.
 *
 * Returns undefined if the input is empty or cannot be parsed into a valid
 * date.
 */
const parseValidDate = (value: unknown): Dayjs | undefined => {
  if (!value || typeof value !== "string") {
    return undefined;
  }

  const date = dayjs(value);
  return date.isValid() ? date : undefined;
};

/**
 * TypeORM transformer for date ranges.
 *
 * Does not account for range inclusivity and exclusivity. Rather always assumes
 * that range start is inclusive and end is exclusive.
 */
export const daterangeTransformer = {
  to: (value: DateRange) => {
    const format = "YYYY-MM-DD";
    const start = value.start ? dayjs(value.start).format(format) : "";
    const end = value.end ? dayjs(value.end).format(format) : "";

    return `[${start},${end})`;
  },
  from: (value: string): DateRange => {
    const withoutBraces = value.substring(1, value.length - 1);
    const parts = withoutBraces.split(",");

    return {
      start: parseValidDate(parts[0]),
      end: parseValidDate(parts[1]),
    };
  },
};
