import { useContext } from "react"
import { useParams } from "react-router-dom"
import { formatTripDates } from "../utils/formatDates"
import { UserContext } from "../context/UserContext"
import { CalendarDays, MapPin } from "lucide-react"

function TripDetails() {
    const { id } = useParams()
    const { userTrips } = useContext(UserContext)

    const trip = userTrips.find(trip => trip.id === parseInt(id))

    if (!trip) return <p className="error">Trip not found</p>

    const { name, start_date, end_date, places } = trip

    const formattedDates = formatTripDates(start_date, end_date)

    const countdown = Math.ceil(
        (new Date(start_date) - new Date()) / (1000 * 60 * 60 * 24)
    )

    const countdownText =
        countdown > 0
        ? `Trip is in ${countdown} day${countdown !== 1 ? "s" : ""}`
        : null

    return (
        <div className="trip-details-page">
            <h2 className="trip-details-title">{name}</h2>
            <p className="countdown">{countdownText}</p>
            <div className="trip-dates">
                <CalendarDays size={18} />
                <span>{formattedDates}</span>
            </div>

            <div className="trip-places">
                <h3>Places on this trip:</h3>
                {places.length > 0 ? (
                <ul>
                    {places.map((place) => (
                    <li key={place.id}>
                        <MapPin size={16} style={{ marginRight: "0.4rem" }} />
                        {place.name}
                    </li>
                    ))}
                </ul>
                ) : (
                <p className="empty">No places added yet.</p>
                )}
            </div>
        </div>
  )}

export default TripDetails