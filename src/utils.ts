export function formatDateToISO(date, time) {
  if (!date) return null;
  const isoDate = new Date(`${date}T${time}`).toISOString();
  return isoDate.slice(0, 19).replace('T', ' ');
}