import { format, isToday, isTomorrow, isYesterday } from "date-fns";

export function determineFormat(date) {
    if (date === "") return ""

    if (isToday(date)) return "Today";
    if (isTomorrow(date)) return "Tomorrow";
    if (isYesterday(date)) return "Yesterday";
    return format(date, "eeee dd/MM");
}