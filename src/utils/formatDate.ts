import { format as formatDateFns } from 'date-fns';

/**
 * Convert a Date to an ISO-8601 date string (YYYY-MM-DD).
 * @param d - Date object to convert
 * @returns ISO date string in the form YYYY-MM-DD
 */
export function toISODate(d: Date): string {
  return d.toISOString().slice(0, 10);
}

/**
 * Convert minutes to a string representing hours with an 'h' suffix.
 * @param min - Total minutes to convert
 * @param fractionDigits - Number of decimal places to keep for hours (default 0)
 * @returns A string in the format `${hours}h` (e.g., "1h", "1.5h")
 */
export function minutesToHoursLabel(min: number, fractionDigits = 0): string {
  const hours = (min || 0) / 60;
  return `${hours.toFixed(fractionDigits)}h`;
}

/**
 * Calculate percentage = round((part / total) * 100).
 * @param total - The total value
 * @param part - The portion value
 * @returns An integer percentage from 0 to 100
 */
export function percent(total: number, part: number): number {
  if (!total) return 0;
  return Math.round((part / total) * 100);
}

/**
 * Format a date using the browser's Intl API via toLocaleDateString.
 * Produces a DD/MM/YYYY style output for locales like en-GB.
 * @param date - A Date, timestamp (number), or ISO-like string parsable by Date
 * @param locale - A BCP-47 locale string (default: 'en-GB')
 * @returns A localized date string with day, month, year as 2-digit parts
 */
export function formatDate(
  date: Date | string | number,
  locale: string = 'en-GB',
): string {
  const d = date instanceof Date ? date : new Date(date);
  return d.toLocaleDateString(locale, {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

/**
 * Formats a date range using a specific date-fns pattern.
 * @param start - The start of the range.
 * @param end - The end of the range.
 * @param pattern - A date-fns pattern string (e.g., 'dd/MM/yyyy').
 * @returns A formatted date range string.
 * @example
 * formatDateRangeByPattern(new Date(2025, 9, 22), new Date(2025, 9, 28), 'dd/MM/yyyy') 
 * // Returns '22/10/2025 - 28/10/2025'
 */
export function formatDateRangeByPattern(
  start: Date | string | number,
  end: Date | string | number,
  pattern: string = 'yyyy-MM-dd',
): string {
  const startDate = start instanceof Date ? start : new Date(start);
  const endDate = end instanceof Date ? end : new Date(end);

  const formattedStart = formatDateFns(startDate, pattern);
  const formattedEnd = formatDateFns(endDate, pattern);

  return `${formattedStart} - ${formattedEnd}`;
}

/**
 * Formats a date range using a BCP-47 locale string.
 * @param start - The start of the range.
 * @param end - The end of the range.
 * @param locale - A BCP-47 locale string (e.g., 'vi-VN', 'en-GB').
 * @returns A formatted date range string based on the locale.
 * @example
 * formatDateRangeByLocale('2025-10-22', '2025-10-28', 'vi-VN') 
 * // Returns '22/10/2025 - 28/10/2025'
 */
export function formatDateRangeByLocale(
  start: Date | string | number,
  end: Date | string | number,
  locale: string = 'en-GB',
): string {
  const startDate = start instanceof Date ? start : new Date(start);
  const endDate = end instanceof Date ? end : new Date(end);

  const formattedStart = formatDate(startDate, locale);
  const formattedEnd = formatDate(endDate, locale);

  return `${formattedStart} - ${formattedEnd}`;
}