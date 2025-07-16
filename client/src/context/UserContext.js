import React, { useEffect, useState } from "react";

const UserContext = React.createContext()

function UserProvider({ children }) {
    const [user, setUser] = useState(null)
    const [userTrips, setUserTrips] = useState([])
    const [loading, setLoading] = useState(true)

    console.log(userTrips)

    const checkSession = async () => {
        try {
            const r = await fetch('/check_session', {
                credentials: 'include'
            })
            if (r.ok) {
                const data = await r.json()
                setUser({
                    id: data.id,
                    username: data.username
                })
                setUserTrips(data.trips)
            } else {
                setUser(null)
            }
        } catch (err) {
            console.log("Something went wrong checking your session.")
            setUser(null)
            setUserTrips(null)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        checkSession()
    }, [])

    const signupUser = async (values) => {
        try {
            const r = await fetch(`/signup`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify(values)
            })
            if (r.ok) {
                const data = await r.json()
                setUser({
                    id: data.id,
                    username: data.username
                })
                setUserTrips(data.trips)
                return { success: true, data }
            } else {
                const errorData = await r.json()
                return { success: false, error: errorData.error || "Signup failed." }
            }
        } catch (err) {
            console.log("Error signing up user:", err)
            return { success: false, error: "An unexpected error occurred during signup."}
        }
    }

    const loginUser = async (values) => {
        try {
            const r = await fetch(`/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify(values)
            })
            if (r.ok) {
                const data = await r.json()
                setUser({
                    id: data.id,
                    username: data.username
                })
                setUserTrips(data.trips)
            } else {
                const errorData = await r.json()
                return { success: false, error: errorData.error}
            }
        } catch (err) {
            return { success: false, error: "An unexpected error occured during login."}
        }
    }

    const logoutUser = async () => {
        try {
            const r = await fetch(`/logout`, {
                method: 'DELETE',
                credentials: 'include'
            })
            if (r.ok) {
                setUser(null)
                setUserTrips([])
                return { success: true }
            } else {
                const errorData = await r.json()
                return { success: false, error: errorData.error || "Failed to log out." }
            }
        } catch (err) {
            console.log("Error during logout:", err)
            return { success: false, error: "An unexpected error occurred during logout. Please try again."}
        }
    }

    const createTrip = async (values) => {
        try {
            const r = await fetch(`/trips`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify(values)
            })
            if (r.ok) {
                const data = await r.json()
                setUserTrips(prev => [...prev, data])
                return { success: true, data: data }
            } else {
                const errorData = await r.json()
                return { success: false, error: errorData.error || "Failed to create trip." }
            }
        } catch (err) {
            console.log("Error creating trip:", err)
            return { success: false, error: "An unexpected error occurred while creating trip. Please try again."}
        }
    }

    const addEvent = async (newEvent) => {
        try {
            const r = await fetch(`/events`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify(newEvent)
            })
            if (r.ok) {
                const newEventData = await r.json()
                setUserTrips(prev => (
                    prev.map(trip => {
                        if (trip.id !== newEventData.trip.id) return trip
                        const placeExists = trip.places.find(p => p.id === newEventData.place.id)
                        if (placeExists) {
                            const updatedPlaces = trip.places.map(p => {
                                if (p.id === newEventData.place.id) {
                                    return {
                                        ...p,
                                        events: [...p.events, newEventData]
                                    }
                                }
                                return p
                            })

                            return {
                                ...trip,
                                places: updatedPlaces
                            }
                        } else {
                            return {
                                ...trip,
                                places: [...trip.places, {
                                    ...newEventData.place,
                                    events: [newEventData]
                                }]
                            }
                        }
                    }))
                )
                return { success: true }
            } else {
                const errorData = await r.json()
                return { success: false, error: errorData.error || "Failed to create event." }
            }
        } catch (err) {
            console.log("Error creating event:", err)
            return { success: false, error: "An unexpected error occurred while creating event. Please try again."}
        }
    }

    const updateEvent = async (updatedEvent) => {
        try {
            const r = await fetch(`/events/${updatedEvent.id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify(updatedEvent)
            })
            if (r.ok) {
                setLoading(true)
                const updatedEventData = await r.json()
                setUserTrips(prevTrips => 
                    prevTrips.map(t => {
                        if (t.id !== updatedEventData.trip.id) return t

                        return {
                            ...t,
                            places: t.places.map(p => {
                                if (p.id !== updatedEventData.place.id) return p

                                return {
                                    ...p,
                                    events: p.events.map(e =>
                                        e.id === updatedEventData.id ? updatedEventData : e
                                    )
                                }
                            })
                        }
                    })
                )
                return { success: true }
            } else {
                const errorData = await r.json()
                return { success: false, error: errorData.error || "Failed to update event." }
            }
        } catch (err) {
            console.log("Error updating event:", err)
            return { success: false, error: "An unexpected error occurred while updating event. Please try again."}
        } finally {
            setLoading(false)
        }
    }

    const deleteEvent = async (tripId, placeId, eventId) => {
        try {
            const r = await fetch(`/events/${eventId}`, {
                method: 'DELETE',
                credentials: 'include'
            })
            if (r.ok) {
                console.log(tripId, placeId, eventId)
                setUserTrips(prev => 
                    prev.map(t => {
                        if (t.id !== parseInt(tripId)) return t

                        const updatedPlaces = t.places.map(p => {
                            if (p.id !== parseInt(placeId)) return p

                            const updatedEvents = p.events.filter(e => e.id !== parseInt(eventId))

                            return updatedEvents.length > 0
                                ? {...p, events: updatedEvents}
                                : null
                        }).filter(p => p !== null)
                        return {...t, places: updatedPlaces}
                    })
                )
                return { success: true }
            } else {
                const errorData = await r.json()
                return { success: false, error: errorData.error || "Failed to create trip." }
            }
        } catch (err) {
            console.log("Error creating trip:", err)
            return { success: false, error: "An unexpected error occurred while creating trip. Please try again."}
        }
    }
    return (
        <UserContext.Provider value={{ user, userTrips, loading, signupUser, loginUser, logoutUser, createTrip, addEvent, updateEvent, deleteEvent }}>
            {children}
        </UserContext.Provider>
    )
}

export { UserContext, UserProvider }