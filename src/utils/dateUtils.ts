const DATE_FORMAT = 'YYYY-MM-DD';

export function formatDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function isToday(dateKey: string, now: Date = new Date()): boolean {
  return dateKey === formatDateKey(now);
}

/** Для сегодня — только часы 00..текущий час включительно */
export function getMaxHourForDate(dateKey: string, now: Date = new Date()): number {
  return isToday(dateKey, now) ? now.getHours() : 23;
}

export function getDateTagLabel(dateKey: string, now: Date = new Date()): string {
  return isToday(dateKey, now) ? 'Сегодня' : dateKey;
}

export { DATE_FORMAT };
