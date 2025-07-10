import { useContext } from "react"
import { useParams } from "react-router-dom"
import { UserContext } from "../context/UserContext"
import { formatTripDates } from "../utils/dateHelpers"
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
        <div className="trip-details">
            <section className="trip-countdown">
                <h1>{countdown}</h1>
                <p>days</p>
            </section>

            <hr className="divider" />

            <section className="trip-info">
                <h2 className="trip-name">{name}</h2>
                <div className="trip-dates">
                    <CalendarDays size={18} />
                    <span>{formattedDates}</span>
                </div>
            </section>

            {/* Itinerary section will go here later */}
        </div>
  )}

export default TripDetails