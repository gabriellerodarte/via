import { useContext, useEffect } from "react";
import { PlaceContext } from "../context/PlaceContext";
import NewPlaceForm from "./NewPlaceForm";


function Places() {
    const { places, getPlaces } = useContext(PlaceContext)

    // handle fetch error if issue loading places !!!

    useEffect(() => {
        const fetchPlaces = async () => {
            const result = await getPlaces()
            if(!result.success) {
                console.log(result.error)
            }
        }
        fetchPlaces()
    }, [getPlaces])
    
    return (
        <div>
            <NewPlaceForm/>
            <ul>
                {places && places.map(p => (
                    <li>

                        <h5>{p.name}</h5>
                        <p>{p.address}</p>
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default Places