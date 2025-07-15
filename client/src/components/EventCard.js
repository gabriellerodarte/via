import { formatTimeRange } from "../utils/dateHelpers";

function EventCard({ event, onEdit, onDelete }) {
    const { title, planning_status, location, start_time, end_time } = event

    return (
        <li className="event-card">
            <div className="event-card-header">
                <h3 className="event-title">{title}</h3>
                <span className={`status-badge ${planning_status}`}>
                    {planning_status}
                </span>
            </div>
            <p className="event-location">@ {location}</p>
            {start_time && (
                <p className="event-time">
                    {formatTimeRange(start_time, end_time)}
                </p>
            )}
            <div className="event-card-actions">
                <button onClick={() => onEdit(event)} className="edit-btn">Edit</button>
                <button onClick={() => onDelete(event.id)} className="delete-btn">Delete</button>
            </div>
        </li>
    );
}

export default EventCard