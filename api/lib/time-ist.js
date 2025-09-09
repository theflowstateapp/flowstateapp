const { startOfDay, endOfDay, startOfWeek, endOfWeek, addDays, format } = require('date-fns');
const { fromZonedTime, toZonedTime } = require('date-fns-tz');

const IST = "Asia/Kolkata";

/** Returns { zonedNow, weekStartZoned, weekEndZoned, weekStartUTC, weekEndUTC } */
function getISTWeekBounds(reference) {
  const now = reference ?? new Date();
  const zonedNow = toZonedTime(now, IST);

  // Monday-start week in IST
  const weekStartZoned = startOfWeek(zonedNow, { weekStartsOn: 1 });
  const weekEndZoned = endOfWeek(zonedNow, { weekStartsOn: 1 });

  // Clamp to day bounds in IST, then convert to UTC for DB queries
  const weekStartUTC = fromZonedTime(startOfDay(weekStartZoned), IST);
  const weekEndUTC = fromZonedTime(endOfDay(weekEndZoned), IST);

  return { zonedNow, weekStartZoned, weekEndZoned, weekStartUTC, weekEndUTC };
}

/** "Mon, 01 Sep" or "Mon, 01 Sep 5:30 pm" in IST */
function formatISTRange(start, end, withTimes = false) {
  const zStart = toZonedTime(start, IST);
  const zEnd = toZonedTime(end, IST);
  const df = withTimes ? "EEE, dd MMM h:mm a" : "EEE, dd MMM";
  return {
    startLabel: format(zStart, df, { timeZone: IST }),
    endLabel: format(zEnd, df, { timeZone: IST }),
  };
}

/** Format "Wed, 10:30–11:15" from two UTC instants */
function formatISTTimeWindow(startUTC, endUTC) {
  const s = toZonedTime(startUTC, IST);
  const e = toZonedTime(endUTC, IST);
  const day = format(s, "EEE", { timeZone: IST });
  const st = format(s, "h:mm a", { timeZone: IST });
  const et = format(e, "h:mm a", { timeZone: IST });
  return `${day}, ${st}–${et}`;
}

/** True if [a,b] intersects [x,y] (clipped duration helper) */
function clipDurationMs(a, b, x, y) {
  const start = a > x ? a : x;
  const end = b < y ? b : y;
  return Math.max(0, +end - +start);
}

/** Get IST week bounds with optional offset in days */
function getISTWeekBoundsWithOffset(offsetDays = 0) {
  const reference = addDays(new Date(), offsetDays);
  return getISTWeekBounds(reference);
}

/** Format a single date in IST */
function formatISTDate(date, formatStr = "EEE, dd MMM") {
  const zonedDate = toZonedTime(date, IST);
  return format(zonedDate, formatStr, { timeZone: IST });
}

/** Check if a UTC date is today in IST */
function isTodayIST(date) {
  const zonedDate = toZonedTime(date, IST);
  const todayIST = toZonedTime(new Date(), IST);
  return zonedDate.toDateString() === todayIST.toDateString();
}

/** Get start and end of day in IST, converted to UTC */
function getISTDayBounds(date) {
  const zonedDate = toZonedTime(date, IST);
  const startOfDayIST = startOfDay(zonedDate);
  const endOfDayIST = endOfDay(zonedDate);
  
  return {
    startUTC: fromZonedTime(startOfDayIST, IST),
    endUTC: fromZonedTime(endOfDayIST, IST)
  };
}

module.exports = {
  IST,
  getISTWeekBounds,
  formatISTRange,
  formatISTTimeWindow,
  clipDurationMs,
  getISTWeekBoundsWithOffset,
  formatISTDate,
  isTodayIST,
  getISTDayBounds
};
