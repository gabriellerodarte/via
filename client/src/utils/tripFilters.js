export function getCurrentTrips(trips) {
    const today = new Date()
    return trips.filter(trip => {
        const start = new Date(trip.start_date)
        const end = new Date(trip.end_date)
        return start <= today && end >= today
    })
}

export function getUpcomingTrips(trips) {
    const today = new Date()
    return trips.filter(trip => {
        const start = new Date(trip.start_date)
        return start > today
    })
}

export function getPastTrips(trips) {
    const today = new Date()
    return trips.filter(trip => {
        const end = new Date(trip.end_date)
        return end < today
    })
}
