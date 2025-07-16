export function formatTripDates(start, end) {
    const startDate = new Date(start);
    const endDate = new Date(end);

    const optionsSameMonth = { month: 'short', day: 'numeric' };
    const optionsWithYear = { month: 'short', day: 'numeric', year: 'numeric' };

    if (startDate.getMonth() === endDate.getMonth()) {
        return `${startDate.toLocaleDateString('en-US', optionsSameMonth)}–${endDate.toLocaleDateString('en-US', optionsWithYear)}`;
    } else {
        return `${startDate.toLocaleDateString('en-US', optionsSameMonth)}–${endDate.toLocaleDateString('en-US', optionsWithYear)}`;
    }
}

export function getCountdown(startDateStr) {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const startDate = new Date(startDateStr)
    startDate.setHours(0, 0, 0, 0)

    const countdown = Math.ceil((new Date(startDate) - new Date()) / (1000 * 60 * 60 * 24))

    return countdown
}

export function formatTimeRange(start, end) {
    if (!start) return "";

    const startDate = new Date(start);
    const endDate = end ? new Date(end) : null;

    const dateOptions = { month: "short", day: "numeric", year: "numeric" };
    const timeOptions = { hour: "numeric", minute: "2-digit" };

    const sameDay =
        endDate &&
        startDate.toDateString() === endDate.toDateString();

    if (!endDate) {
        return `${startDate.toLocaleDateString(undefined, dateOptions)} • ${startDate.toLocaleTimeString(undefined, timeOptions)}`;
    }

    if (sameDay) {
        return `${startDate.toLocaleDateString(undefined, dateOptions)} • ${startDate.toLocaleTimeString(undefined, timeOptions)}–${endDate.toLocaleTimeString(undefined, timeOptions)}`;
    } else {
        return `${startDate.toLocaleDateString(undefined, dateOptions)} • ${startDate.toLocaleTimeString(undefined, timeOptions)} → ${endDate.toLocaleDateString(undefined, dateOptions)} • ${endDate.toLocaleTimeString(undefined, timeOptions)}`;
    }
}

export function toDateTimeLocal(dateStr) {
  const date = new Date(dateStr);
  const offset = date.getTimezoneOffset();
  const adjusted = new Date(date.getTime() - offset * 60 * 1000);
  return adjusted.toISOString().slice(0, 16); // "YYYY-MM-DDTHH:MM"
}