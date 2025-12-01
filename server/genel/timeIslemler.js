import { DateTime } from "luxon";

export function getDateRange(type, timeZone = "Europe/Istanbul") {
  const now = DateTime.now().setZone(timeZone);

  let start, end;
  switch (type) {
    case "today":
      start = now.startOf("day");
      end = now.endOf("day");
      break;

    case "yesterday":
      start = now.minus({ days: 1 }).startOf("day");
      end = now.minus({ days: 1 }).endOf("day");
      break;

    case "thisWeek":
      start = now.startOf("week");
      end = now.endOf("week");
      break;

    case "lastWeek":
      start = now.minus({ weeks: 1 }).startOf("week");
      end = now.minus({ weeks: 1 }).endOf("week");
      break;

    case "thisMonth":
      start = now.startOf("month");
      end = now.endOf("month");
      break;

    case "lastMonth":
      start = now.minus({ months: 1 }).startOf("month");
      end = now.minus({ months: 1 }).endOf("month");
      break;

    default:
      if (type.startsWith("daysAgo:")) {
        const d = parseInt(type.split(":")[1], 10);
        start = now.minus({ days: d }).startOf("day");
        end = now.minus({ days: d }).endOf("day");
      } else {
        throw new Error("Unknown range type: " + type);
      }
  }
  return {
    gunAyYil: start.toFormat("yyyy-MM-dd"),
    gunAyYil: end.toFormat("yyyy-MM-dd"),
    // Türkiye saatine göre ISO (offsetli)
    trStart: start.toISO(),
    trEnd: end.toISO(),

    // Türkiye saatini offsetsiz formatta veriyoruz
    trStartNoOffset: start.toFormat("yyyy-MM-dd'T'HH:mm:ss.SSS"),
    trEndNoOffset: end.toFormat("yyyy-MM-dd'T'HH:mm:ss.SSS"),

    // UTC ISO (Mongo için ideal)
    utcStart: start.toUTC().toISO(),
    utcEnd: end.toUTC().toISO(),

    startDate: start.toJSDate(),
    endDate: end.toJSDate(),
  };
}
