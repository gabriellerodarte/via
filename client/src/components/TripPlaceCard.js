import EventCard from "./EventCard"


function TripPlaceCard({ place }) {
    const { name, address, events } = place
    return (
        <div className="place-card">
            <h3>{name}</h3>
            <p className="place-address">{address}</p>

            <ul className="event-list">
                {place.events.map(event => (
                    <EventCard key={event.id} event={event}/>
                ))}
            </ul>
        </div>
    )
}

export default TripPlaceCard