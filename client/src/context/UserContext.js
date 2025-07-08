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
                console.log(data)
                setUser(data)
            } else {
                setUser(null)
            }
        } catch (err) {
            console.log("Error checking session:", err)
            setUser(null)
            throw err
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
                console.log(data)
                setUser(data)
            } else {
                setUser(null)
            }
        } catch (err) {
            console.log("Error signing up user:", err)
            setUser(null)
        }
    }

    return (
        <UserContext.Provider value={{ user, userTrips, loading, signupUser }}>
            {children}
        </UserContext.Provider>
    )
}

export { UserContext, UserProvider }