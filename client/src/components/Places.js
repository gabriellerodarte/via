import { useContext, useEffect } from "react";
import { PlaceContext } from "../context/PlaceContext";


function Places() {
    const { places, getPlaces } = useContext(PlaceContext)

    useEffect(() => {
        const fetchPlaces = async () => {
            const result = await getPlaces()
            if(!result.success) {
                const errorData = await result.json()
                console.log(errorData.error)
            }
        }
        fetchPlaces()
    }, [getPlaces])
    
    return (
        <h1>PLACE COMPONENT</h1>
    )
}

export default Places