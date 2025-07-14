import { useContext, useEffect, useState } from "react";
import { PlaceContext } from "../context/PlaceContext";
import NewPlaceForm from "./NewPlaceForm";
import "../styles/placeselectormodal.css";

function PlaceSelectorModal({ show, onClose, onPlaceSelect }) {
    const { places, getPlaces } = useContext(PlaceContext)
    const [showNewPlaceForm, setShowNewPlaceForm] = useState(false)
    const [searchTerm, setSearchTerm] = useState("")
    const filteredPlaces = places.filter(place => 
        place.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        place.address.toLowerCase().includes(searchTerm.toLowerCase())
    )

    useEffect(() => {
        if (show) getPlaces()
    }, [show, getPlaces])

    if (!show) return null

    const handleNewPlaceAdded = (newPlace) => {
        onPlaceSelect(newPlace)
        setShowNewPlaceForm(false)
    };

    return (
        <div className="modal-overlay">
        <div className="modal-content">
            <button className="close-button" onClick={onClose}>×</button>

            {!showNewPlaceForm ? (
            <>
                <h2>Select a Place</h2>
                <input
                    type="text"
                    placeholder="Search places..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="place-search"
                />

                <ul className="place-list">
                {filteredPlaces.map((place) => (
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
            
                <button
                onClick={() => setShowNewPlaceForm(true)}
                className="add-place-button"
                >
                + Add New Place
                </button>
            </>
            ) : (
            <div className="add-place-form">
                <button onClick={() => setShowNewPlaceForm(false)}>
                ← Back to Place List
                </button>
                <NewPlaceForm onSuccess={handleNewPlaceAdded}/>
            </div>
            )}
        </div>
        </div>
    );
}

export default PlaceSelectorModal