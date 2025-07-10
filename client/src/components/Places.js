import { useContext, useEffect } from "react";
import { PlaceContext } from "../context/PlaceContext";
import NewPlaceForm from "./NewPlaceForm";


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
        <div>
            <NewPlaceForm/>
        </div>
    )
}

export default Places