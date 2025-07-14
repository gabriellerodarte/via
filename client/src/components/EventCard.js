import { formatTimeRange } from "../utils/dateHelpers"

function EventCard({ event }) {
    const { title, planning_status, location, start_time, end_time } = event

    return (
        <li className="event-card">
            <strong>{title}</strong> @ {location}
            {event.start_time && (
                <span className="event-time">
                    {' '}({formatTimeRange(start_time, end_time)})
                </span>
            )}
            <span className={`status ${planning_status}`}>
                {planning_status}
            </span>
        </li>
    )
    
}

export default EventCard