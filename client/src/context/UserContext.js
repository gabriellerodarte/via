import React, { useEffect, useState } from "react";

const UserContext = React.createContext()

function UserProvider({ children }) {
    const [user, setUser] = useState(null)
    const [userTrips, setUserTrips] = useState([])
    const [loading, setLoading] = useState(true)

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

    return (
        <UserContext.Provider value={{ user, userTrips, loading, signupUser, loginUser, logoutUser, createTrip }}>
            {children}
        </UserContext.Provider>
    )
}

export { UserContext, UserProvider }