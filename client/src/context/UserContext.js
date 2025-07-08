import React, { useEffect, useState } from "react";

const UserContext = React.createContext()

function UserProvider({ children }) {
    const [user, setUser] = useState(null)
    const [userTrips, setUserTrips] = useState([])

    const checkSession = useCallback(() => {
        fetch('/check_session')
        .then(res => res.ok ? res.json() : Promise.reject("Not logged in"))
        .then(data => {
            console.log(data)
            setUser({
                id: data.id,
                username: data.username
            })
            setUserTrips(data.trips)
        })
        .catch((error) => {
            console.log(error)
            setUser(null)
        })
    })

    useEffect(() => {
        checkSession()
    }, [])

    return (
        <UserContext.Provider values={{ user, userTrips }}>
            {children}
        </UserContext.Provider>
    )
}

export { UserContext, UserProvider }