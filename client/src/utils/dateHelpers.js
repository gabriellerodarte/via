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