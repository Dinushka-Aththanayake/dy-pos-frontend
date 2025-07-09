export function formatDateToISO(date, time) {
  if (!date) return null;
  const isoDate = new Date(`${date}T${time}`).toISOString();
  return isoDate.slice(0, 19).replace('T', ' ');
}

// get the today date part in local timezone and browser input format
export function getTodayDate() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}
