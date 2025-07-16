import { useNavigate, useParams } from "react-router-dom"
import EventCard from "./EventCard"
import { useContext, useEffect } from "react"
import { UserContext } from "../context/UserContext"


function TripPlaceCard({ place }) {
    const { id } = useParams()
    const { deleteEvent } = useContext(UserContext)
    const { name, address, events } = place
    const navigate = useNavigate()

    const handleEdit = async (event) => {
        navigate(`/my-trips/${id}/places/${place.id}/events/${event.id}/edit`)
    }

    useEffect(() => {
        console.log("TripPlaceCard rerendered with events:", events)
    }, [events])

    const handleDelete = async (eventId) => {
        try {
            const result = await deleteEvent(id, place.id, eventId)

            if (result.success) {
                    console.log("Event successfully deleted")
            } else {
                    const errorData = result.error
                    console.log("Error deleting event", errorData)
            }
        } catch (err) {
            console.log('error', err.error)
        } 

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