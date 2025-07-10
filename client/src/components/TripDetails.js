import { useContext } from "react"
import { useParams } from "react-router-dom"
import { UserContext } from "../context/UserContext"
import { formatTripDates, getCountdown } from "../utils/dateHelpers"
import { CalendarDays, MapPin } from "lucide-react"

function TripDetails() {
    const { id } = useParams()
    const { userTrips } = useContext(UserContext)
    const trip = userTrips.find(trip => trip.id === parseInt(id))

    if (!trip) return <p className="error">Trip not found</p>

    const { name, start_date, end_date, places } = trip
    const formattedDates = formatTripDates(start_date, end_date)
    const daysAway = getCountdown(start_date)

    return (
        <div className="trip-details">
            {daysAway > 0 && (
                <section className="trip-countdown">
                    <h1>{daysAway}</h1>
                    <p>days</p>
                </section>
            )}

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