import { format, isToday, isTomorrow, isYesterday } from "date-fns";

export function determineFormat(date) {
    if (date === "") return undefined;

    let formattedDate;
    if (isToday(date)) formattedDate = "Today";
    else if (isTomorrow(date)) formattedDate = "Tomorrow";
    else if (isYesterday(date)) formattedDate = "Yesterday";
    else formattedDate = format(date, "eeee dd/MM");

    return formattedDate;
}