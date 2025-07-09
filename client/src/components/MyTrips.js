import { useContext } from "react";
import { UserContext } from "../context/UserContext";
import TripSection from "./TripSection";
import { getCurrentTrips, getUpcomingTrips, getPastTrips } from "../utils/tripFilters";
import "../styles/mytrips.css"

function MyTrips() {
    const { userTrips } = useContext(UserContext)

    const currentTrips = getCurrentTrips(userTrips || [])
    const upcomingTrips = getUpcomingTrips(userTrips || [])
    const pastTrips = getPastTrips(userTrips || [])

    return (
        <div className="trip-sections-container">
            {currentTrips.length > 0 && (
                <TripSection title="Current" trips={currentTrips} emptyMessage="No trips are currently happening." />
            )}
            <TripSection title="Upcoming" trips={upcomingTrips} emptyMessage="Your next trip starts here." />
            {pastTrips.length > 0 && (
                <TripSection title="Past" trips={pastTrips} emptyMessage="No past trips to show yet." />
            )}
        </div>
    )
}

export default MyTrips