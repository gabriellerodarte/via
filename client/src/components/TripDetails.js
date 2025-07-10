import { useContext } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { UserContext } from "../context/UserContext"
import { formatTripDates, getCountdown } from "../utils/dateHelpers"
import { CalendarDays, MapPin } from "lucide-react"

function TripDetails() {
    const { id } = useParams()
    const navigate = useNavigate()
    const { userTrips } = useContext(UserContext)
    const trip = userTrips.find(trip => trip.id === parseInt(id))

    if (!trip) return <p className="error">Trip not found</p>

    const { name, start_date, end_date, places } = trip
    const formattedDates = formatTripDates(start_date, end_date)
    const daysAway = getCountdown(start_date)

    return (
        <div className="trip-details">
            <section className="trip-countdown">
                {daysAway >= 0 && (
                    <>
                        <h1>{daysAway}</h1>
                        <p>days</p>                    
                    </>
                )}
            </section>
            <hr className="divider" />

            <section className="trip-info">
                <h2 className="trip-name">{name}</h2>
                <div className="trip-dates">
                    <CalendarDays size={18} />
                    <span>{formattedDates}</span>
                </div>
            </section>
            <hr className="divider" />

            {/* Itinerary section will go here later */}
            {/* Place components */}
            <section>
                <h3>Itinerary</h3>
                {places.length === 0 && (
                    <>
                        <p>Oh the places you'll go...</p>
                        <p>Add events to your trip to see what places are on your trip itinerary!</p>
                    </>
                )}
                <button onClick={() => navigate(`/my-trips/${id}/new-event`)}>Add a New Event</button>

            </section>

        </div>
  )}

export default TripDetails