import { startOfDay, endOfDay, startOfWeek, endOfWeek, addDays } from 'date-fns';
import { utcToZonedTime, zonedTimeToUtc, format as fmt } from 'date-fns-tz';

export const IST = "Asia/Kolkata";

/** Returns { zonedNow, weekStartZoned, weekEndZoned, weekStartUTC, weekEndUTC } */
export function getISTWeekBounds(reference) {
  const now = reference ?? new Date();
  const zonedNow = utcToZonedTime(now, IST);

  // Monday-start week in IST
  const weekStartZoned = startOfWeek(zonedNow, { weekStartsOn: 1 });
  const weekEndZoned = endOfWeek(zonedNow, { weekStartsOn: 1 });

  // Clamp to day bounds in IST, then convert to UTC for DB queries
  const weekStartUTC = zonedTimeToUtc(startOfDay(weekStartZoned), IST);
  const weekEndUTC = zonedTimeToUtc(endOfDay(weekEndZoned), IST);

  return { zonedNow, weekStartZoned, weekEndZoned, weekStartUTC, weekEndUTC };
}

/** "Mon, 01 Sep" or "Mon, 01 Sep 5:30 pm" in IST */
export function formatISTRange(start, end, withTimes = false) {
  const zStart = utcToZonedTime(start, IST);
  const zEnd = utcToZonedTime(end, IST);
  const df = withTimes ? "EEE, dd MMM h:mm a" : "EEE, dd MMM";
  return {
    startLabel: fmt(zStart, df, { timeZone: IST }),
    endLabel: fmt(zEnd, df, { timeZone: IST }),
  };
}

/** Format "Wed, 10:30–11:15" from two UTC instants */
export function formatISTTimeWindow(startUTC, endUTC) {
  const s = utcToZonedTime(startUTC, IST);
  const e = utcToZonedTime(endUTC, IST);
  const day = fmt(s, "EEE", { timeZone: IST });
  const st = fmt(s, "h:mm a", { timeZone: IST });
  const et = fmt(e, "h:mm a", { timeZone: IST });
  return `${day}, ${st}–${et}`;
}

/** True if [a,b] intersects [x,y] (clipped duration helper) */
export function clipDurationMs(a, b, x, y) {
  const start = a > x ? a : x;
  const end = b < y ? b : y;
  return Math.max(0, +end - +start);
}

/** Get IST week bounds with optional offset in days */
export function getISTWeekBoundsWithOffset(offsetDays = 0) {
  const reference = addDays(new Date(), offsetDays);
  return getISTWeekBounds(reference);
}

/** Format a single date in IST */
export function formatISTDate(date, format = "EEE, dd MMM") {
  const zonedDate = utcToZonedTime(date, IST);
  return fmt(zonedDate, format, { timeZone: IST });
}

/** Check if a UTC date is today in IST */
export function isTodayIST(date) {
  const zonedDate = utcToZonedTime(date, IST);
  const todayIST = utcToZonedTime(new Date(), IST);
  return zonedDate.toDateString() === todayIST.toDateString();
}

/** Get start and end of day in IST, converted to UTC */
export function getISTDayBounds(date) {
  const zonedDate = utcToZonedTime(date, IST);
  const startOfDayIST = startOfDay(zonedDate);
  const endOfDayIST = endOfDay(zonedDate);
  
  return {
    startUTC: zonedTimeToUtc(startOfDayIST, IST),
    endUTC: zonedTimeToUtc(endOfDayIST, IST)
  };
}
