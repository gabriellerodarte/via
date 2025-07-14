import { useNavigate, useParams } from "react-router-dom"
import EventCard from "./EventCard"


function TripPlaceCard({ place }) {
    const { id } = useParams()
    const { name, address, events } = place
    const navigate = useNavigate()

    return (
        <div className="place-card">
            <h3>{name}</h3>
            <p className="place-address">{address}</p>

            <ul className="event-list">
                {place.events.map(event => (
                    <EventCard key={event.id} event={event}/>
                ))}
            </ul>
            <button onClick={() => navigate(`/my-trips/${id}/places/${place.id}/new-event`)}>New Event in {name}</button>
        </div>
    )
}

export default TripPlaceCard