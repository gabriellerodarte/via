import { useContext, useEffect, useState } from "react"
import NewPlaceForm from "./NewPlaceForm"
import { PlaceContext } from "../context/PlaceContext"
import "../styles/placeselectormodal.css"

function PlaceSelectorModal({ show, onClose, onPlaceSelect }) {
    const { places, setPlaces, getPlaces } = useContext(PlaceContext)
    const [showAddForm, setShowAddForm] = useState(false)

    useEffect(() => {
        getPlaces()
    }, [getPlaces])

    if (!show) return null

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <button className="close-button" onClick={onClose}>×</button>
                <h2>Select a Place</h2>

                <ul className="place-list">
                    {places.map(place => (
                        <li 
                            key={place.id} 
                            className="place-item" 
                            onClick={() => onPlaceSelect(place)}
                        >
                            <strong>{place.name}</strong><br />
                            <span>{place.address}</span>
                        </li>
                    ))}
                </ul>

                {!showAddForm ? (
                    <button onClick={() => setShowAddForm(true)} className="add-place-button">
                        + Add New Place
                    </button>
                ) : (
                    <div className="add-place-form">
                        <NewPlaceForm
                            onSuccess={(newPlace) => {
                                // setPlaces(prev => [...prev, newPlace])
                                onPlaceSelect(newPlace)
                                setShowAddForm(false)
                            }}
                        />
                    </div>
                )}
            </div>
        </div>
    )
}

export default PlaceSelectorModal
