export function getCurrentTrips(trips) {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return trips.filter(trip => {
        const start = new Date(trip.start_date)
        const end = new Date(trip.end_date)
        start.setHours(0, 0, 0, 0)
        end.setHours(0, 0, 0, 0)
        return start <= today && end >= today
    })
}

export function getUpcomingTrips(trips) {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return trips.filter(trip => {
        const start = new Date(trip.start_date)
        start.setHours(0, 0, 0, 0)
        return start > today
    })
}

export function getPastTrips(trips) {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return trips.filter(trip => {
        const end = new Date(trip.end_date)
        end.setHours(0, 0, 0, 0)
        return end < today
    })
}
