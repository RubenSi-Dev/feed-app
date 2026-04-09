import type { DateResponse } from "shared";

export function toDateResponse(date: Date): DateResponse {
    const dateStrings = date.toString().split(' ');
    return {
      dayOfWeek: dateStrings[0],
      month: dateStrings[1],
      day: date.getDay(),
      year: date.getFullYear(),
      time: {
        hour: date.getHours(),
        minute: date.getMinutes(),
      },
    };
}