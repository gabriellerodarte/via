import { useNavigate, useParams } from "react-router-dom"
import EventCard from "./EventCard"
import { useContext, useEffect } from "react"
import { UserContext } from "../context/UserContext"


function TripPlaceCard({ place, onDelete }) {
    const { id } = useParams()
    const { deleteEvent } = useContext(UserContext)
    const { name, address, events } = place
    const navigate = useNavigate()

    const handleEdit = (event) => {
        navigate(`/my-trips/${id}/places/${place.id}/events/${event.id}/edit`)
    }

    const handleDelete = (eventId) => {
        onDelete(place.id, eventId)
    }

    return (
        <div className="place-card">
            <h3>{name}</h3>
            <p className="place-address">{address}</p>

            <ul className="event-list">
                {events.map(event => (
                    <EventCard key={event.id} event={event} onEdit={handleEdit} onDelete={handleDelete}/>
                ))}
            </ul>
            <button className="add-event-button" onClick={() => navigate(`/my-trips/${id}/places/${place.id}/new-event`)}>New Event in {name}</button>
        </div>
    )
}

export default TripPlaceCard