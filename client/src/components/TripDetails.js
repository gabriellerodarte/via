import { useContext, useState } from "react"
import { Navigate, useNavigate, useParams } from "react-router-dom"
import { UserContext } from "../context/UserContext"
import { formatTripDates, getCountdown } from "../utils/dateHelpers"
import { CalendarDays, MapPin } from "lucide-react"
import TripPlaceCard from "./TripPlaceCard"
import "../styles/tripdetails.css"

function TripDetails() {
    const { id } = useParams()
    const navigate = useNavigate()
    const { userTrips, deleteEvent } = useContext(UserContext)
    const [deleteIDs, setDeleteIDs] = useState(null)
    const [showModal, setShowModal] = useState(false)
    
    const trip = userTrips.find(trip => trip.id === parseInt(id))

    if (!trip) return <Navigate to="/my-trips"/>

    const { name, start_date, end_date, places } = trip
    const formattedDates = formatTripDates(start_date, end_date)
    const daysAway = getCountdown(start_date)

    const handleConfirmDelete = (placeId, eventId) => {
        setDeleteIDs({
            placeId: placeId,
            eventId: eventId
        })
        setShowModal(true)
    }

    const handleDelete = async () => {
        try {
            const result = await deleteEvent(id, deleteIDs.placeId, deleteIDs.eventId)

            if (result.success) {
                setShowModal(false)
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
                <button className="add-event-button" onClick={() => navigate(`/my-trips/${id}/new-event`)}>Add a New Event</button>
            <hr className="divider" />

            <section>
                <h3>Oh the places you'll go...</h3>
                {places.length === 0 ? (
                    <>
                        {/* <p>Oh the places you'll go...</p> */}
                        <p>Add events to your trip to see what places are on your trip itinerary!</p>
                    </>
                ) : (
                    <>
                        {places.map(place => (
                            <TripPlaceCard key={place.id} place={place} onDelete={handleConfirmDelete}/>
                        )
                        )}
                    </>
                )}
            </section>
            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h4>Delete this event?</h4>
                        <p>This action cannot be undone.</p>
                        <div className="modal-buttons">
                            <button 
                                className="cancel" 
                                onClick={() => {
                                    setShowModal(false)
                                    setDeleteIDs(null)
                                }}
                            >
                                Cancel
                            </button>
                            <button className="confirm" onClick={handleDelete}>Delete</button>
                        </div>
                    </div>
                </div>
            )}


        </div>
  )}

export default TripDetails