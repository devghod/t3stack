import { format } from 'date-fns';
import { formatInTimeZone } from 'date-fns-tz';

/**
 * @param date - The date to format
 * @param formatString - The format string to use
 * @returns The formatted date
 */
export const formatDate = (
  date: Date | string | number,
  formatString: string
): string => {
  return format(new Date(date), formatString);
}

/**
 * @param date - The date to format
 * @param formatString - The format string to use
 * @param timezone - The timezone to use
 * @returns The formatted date
 */
export const formatDateTz  = (
  date: Date | string | number,
  formatString: string,
  timezone: string = 'UTC'
): string => {
  return formatInTimeZone(new Date(date), timezone, formatString);
}