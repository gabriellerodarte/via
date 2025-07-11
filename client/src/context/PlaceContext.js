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

    const createPlace = async (values) => {
        try {
            const r = await fetch(`/places`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify(values)
            })
            if (r.ok) {
                const data = await r.json()
                setPlaces(prev => [...prev, data])
                return { success: true, newPlace: data }
            } else {
                const errorData = await r.json()
                return { success: false, error: errorData.error || "Failed to add place." }
            }
        } catch (err) {
            console.log("Error adding place:", err)
            return { success: false, error: "An unexpected error occurred while adding place."}
        }
    }

    return (
        <PlaceContext.Provider value={{ places, getPlaces, createPlace }}>
            {children}
        </PlaceContext.Provider>
    )
}

export { PlaceContext, PlaceProvider }