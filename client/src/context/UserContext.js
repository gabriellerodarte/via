import React, { useEffect, useState } from "react";

const UserContext = React.createContext()

function UserProvider({ children }) {
    const [user, setUser] = useState(null)
    const [userTrips, setUserTrips] = useState([])
    const [loading, setLoading] = useState(true)

    const checkSession = async () => {
        try {
            const r = await fetch('/check_session')
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

    return (
        <UserContext.Provider value={{ user, userTrips, loading, signupUser }}>
            {children}
        </UserContext.Provider>
    )
}

export { UserContext, UserProvider }