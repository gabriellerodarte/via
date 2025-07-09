import React, { useCallback, useState } from "react";

const PlaceContext = React.createContext()

function PlaceProvider({ children }) {
    const [places, setPlaces] = useState([])

    const getPlaces = useCallback(async () => {
        try {
            const r = await fetch(`/places`, {
                credentials: 'include'
            })
            if (r.ok) {
                const data = await r.json()
                setPlaces(data)
                return { success: true }
            } else {
                const errorData = await r.json()
                return { success: false, error: errorData.error || "Failed to fetch places." }
            }
        } catch (err) {
            console.log("Error fetching places:", err)
            return { success: false, error: "An unexpected error occurred while fetching places."}
        }

    }, [])

    return (
        <PlaceContext.Provider value={{ places, getPlaces }}>
            {children}
        </PlaceContext.Provider>
    )
}

export { PlaceContext, PlaceProvider }