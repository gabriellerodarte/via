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
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        checkSession()
    }, [])

    return (
        <UserContext.Provider value={{ user, userTrips, loading }}>
            {children}
        </UserContext.Provider>
    )
}

export { UserContext, UserProvider }