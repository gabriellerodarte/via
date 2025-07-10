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
