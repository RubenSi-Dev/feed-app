import type { DateResponse } from 'shared';

export function dateResponseToString(date: DateResponse): string {
  return `${date.dayOfWeek} ${date.day} ${date.month} ${date.time.hour}h${date.time.minute}`;
}
