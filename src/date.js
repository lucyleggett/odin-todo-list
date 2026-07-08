import { format, isToday, isTomorrow, isYesterday } from "date-fns";

export function updateDateDisplay(inputElement) {
  if (!inputElement) return;

  const dateValue = inputElement.value;

  if (!dateValue) {
    inputElement.setAttribute("data-date", "No deadline");
    return;
  }

  const [year, month, day] = dateValue.split("-");
  const dateObj = new Date(year, month - 1, day);

  if (isNaN(dateObj.getTime())) {
    inputElement.setAttribute("data-date", "No deadline");
    return;
  }

  if (isToday(dateObj)) {
    inputElement.setAttribute("data-date", "Today");
  } else if (isTomorrow(dateObj)) {
    inputElement.setAttribute("data-date", "Tomorrow");
  } else if (isYesterday(dateObj)) {
    inputElement.setAttribute("data-date", "Yesterday");
  } else {
    const formatted = format(dateObj, "EEE dd/MM");
    inputElement.setAttribute("data-date", formatted);
  }
}

export function addCalendarListener() {
  const dateInputs = document.querySelectorAll(".custom-date");

  dateInputs.forEach((dateInput) => {
    updateDateDisplay(dateInput);

    dateInput.addEventListener("change", function () {
      updateDateDisplay(this);
    });
  });
}
