import { useContext, useEffect } from "react";
import { PlaceContext } from "../context/PlaceContext";
import NewPlaceForm from "./NewPlaceForm";
import "../styles/explore.css"

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
        <div className="places-container">
            <h1>Explore All Places</h1>
            <ul className="place-card-list">
                {places && places.map(p => (
                    <li className="place-card">

                        <h5>{p.name}</h5>
                        <p>{p.address}</p>
                    </li>
                ))}
            </ul>
            <div className="add-place-section">
                <h2>Add a New Place</h2>
            </div>
                <NewPlaceForm/>
        </div>
    )
}

export default Places