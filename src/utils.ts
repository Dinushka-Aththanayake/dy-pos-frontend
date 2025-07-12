/**
 * Converts a date and time string to an ISO-like string (YYYY-MM-DD HH:mm:ss).
 *
 * @param {string} date - Date string in 'YYYY-MM-DD' format.
 * @param {string} time - Time string in 'HH:mm' or 'HH:mm:ss' format.
 * @returns {string|null} ISO-like string in local time, or null if date is missing.
 *
 * @example
 * formatDateToISO('2025-07-12', '14:30'); // '2025-07-12 14:30:00'
 *
 * @note
 * The output is based on the local timezone of the environment where this code runs. If you pass a date and time, the resulting string will represent that local time, not UTC.
 */
export function formatDateToISO(date, time) {
  console.log(date, time);
  if (!date) return null;
  const isoDate = new Date(`${date}T${time}`).toISOString();
  return isoDate.slice(0, 19).replace("T", " ");
}

/**
 * Converts a date and time string to a JavaScript Date object.
 *
 * @param {string} date - Date string in 'YYYY-MM-DD' format.
 * @param {string} time - Time string in 'HH:mm' or 'HH:mm:ss' format.
 * @returns {Date|undefined} JavaScript Date object or undefined if date is missing.
 *
 * @example
 * formatDateToISODate('2025-07-12', '14:30'); // Date object for local 2025-07-12 14:30
 *
 * @note
 * The resulting Date object is created in the local timezone. If you use toISOString() on it, it will convert to UTC.
 */
export function formatDateToISODate(date, time) {
  if (!date) return undefined;
  return new Date(`${date}T${time}`);
}

/**
 * Formats a Date object to a time string in 'HH:mm' format.
 *
 * @param {Date} date - JavaScript Date object.
 * @returns {string} Time string in 'HH:mm' format.
 *
 * @example
 * formatDateToTime(new Date('2025-07-12T14:30:00')) // '14:30'
 *
 * @note
 * The time is extracted in the local timezone.
 */
export function formatDateToTime(date) {
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${hours}:${minutes}`;
}

/**
 * Gets today's date in 'YYYY-MM-DD' format in the local timezone.
 *
 * @returns {string} Today's date string in 'YYYY-MM-DD' format.
 *
 * @example
 * getTodayDate(); // e.g., '2025-07-12'
 *
 * @note
 * The date is based on the local timezone of the user's environment.
 */
export function getTodayDate() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/**
 * Formats a Date object to a local date-time string 'YYYY-MM-DD HH:mm'.
 *
 * @param {Date} date - JavaScript Date object.
 * @returns {string} Date-time string in 'YYYY-MM-DD HH:mm' format, or empty string if date is falsy.
 *
 * @example
 * formatDateToLocalString(new Date('2025-07-12T14:30:00')) // '2025-07-12 14:30'
 *
 * @note
 * The output is in the local timezone, not UTC.
 */
export function formatDateToLocalString(date: Date) {
  if (!date) return "";
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${year}-${month}-${day} ${hours}:${minutes}`;
}
