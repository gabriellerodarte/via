import { useContext } from "react"
import { getCurrentTrips, getUpcomingTrips } from "../utils/tripFilters"
import { UserContext } from "../context/UserContext"
import { NavLink } from "react-router-dom"
import TripCard from "./TripCard"
import "../styles/dashboard.css"

function Dashboard() {
    const { userTrips } = useContext(UserContext)

    const currentTrips = getCurrentTrips(userTrips || [])
    const upcomingTrips = getUpcomingTrips(userTrips || [])
    

    return (
            <div className="dashboard">
                <section className="welcome-banner">
                    <div className="banner-top">
                        <h1>Welcome back!</h1>
                    </div>
                    <div className="banner-message">
                        {currentTrips[0] ? (
                        <p>Your current trip: <strong>{currentTrips[0].name}!</strong></p>
                        ) : upcomingTrips[0] ? (
                        <p>Your next trip: <strong>{upcomingTrips[0].name}</strong></p>
                        ) : (
                        <p>No trips planned yet - your next trip begins here. <NavLink to="/new-trip">Plan one →</NavLink></p>
                        )}
                    </div>
                </section>

                <div className="dashboard-grid">
                    {currentTrips.length > 0 && (
                    <div className="dashboard-panel">
                        <h2>Current Trip</h2>
                        {currentTrips.map((trip, index) => <TripCard key={trip.id} trip={trip} index={index}/>)}
                    </div>
                    )}

                    {upcomingTrips.length > 0 && (
                    <div className="dashboard-panel">
                        <h2>Upcoming Trips</h2>
                        {upcomingTrips.map((trip, index) => <TripCard key={trip.id} trip={trip} index={index}/>)}
                    </div>
                    )}
                </div>
            </div>
    )
}

export default Dashboard