import * as Yup from "yup";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { useParams } from "react-router-dom";
import { Check } from "lucide-react";
import "../styles/eventform.css"
import { useContext, useState } from "react";
import { PlaceContext } from "../context/PlaceContext";
import PlaceSelectorModal from "./PlaceSelectorModal";

function NewEventForm() {
    const { id, tripId } = useParams()
    const [selectedPlace, setSelectedPlace] = useState(null)
    const [showPlaceModal, setShowPlaceModal] = useState(false)

    // make sure use conditionals properly with potentially two id params - id being different if place tied to event already
    
    const EventSchema = Yup.object().shape({
        title: Yup.string().required("Event title is required"),
        planning_status: Yup.string()
        .oneOf(['confirmed', 'tentative'], 'Must be confirmed or tentative')
        .required("Planning status is required"),
        location: Yup.string().required("Please provide event location"),
        start_time: Yup.date()
            .nullable()
            .typeError('Start time must be a valid date/time')
            .notRequired(),
        end_time: Yup.date()
            .nullable()
            .typeError('Start time must be a valid date/time')
            .notRequired()
            .test('is_after_start', 'End time must be after start time', function (value) {
                const { start_time } = this.parent
                if (!start_time || !value) return true
                return new Date(value) > new Date(start_time)
            }),
        place: !tripId 
            ? Yup.string().required('Please select a place or add a new one') 
            : Yup.string(),
    })

    const initialValues = {
        title: '',
        planning_status: 'tentative',
        location: '',
        start_time: '',
        end_time: '',
        place: tripId ? id : ''
    }

    return (
        <Formik
            initialValues={initialValues}
            validationSchema={EventSchema}
            onSubmit={()=>{}}
        >
            {({ values, setFieldValue, errors}) => (
                <Form className="event-form">
                    <label htmlFor="title">Title</label>
                    <Field name="title" type="text" placeholder="Ex: Rehearsal Dinner" />
                    <ErrorMessage name="title" component="div" className="error" />

                    <label>Planning Status</label>
                    <div className="status-toggle">
                        {["confirmed", "tentative"].map((status) => (
                        <button
                            type="button"
                            key={status}
                            className={`toggle-button ${
                            values.planning_status === status ? "active" : ""
                            }`}
                            onClick={() => setFieldValue("planning_status", status)}
                        >
                            {values.planning_status === status && (
                            <Check size={14} style={{ marginRight: "4px" }} />
                            )}
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                        </button>
                        ))}
                    </div>
                    <ErrorMessage name="planning_status" component="div" className="error" />

                    <label htmlFor="location">Location</label>
                    <Field name="location" type="text" placeholder="Ex: Rosewood Hotel, SB" />
                    <ErrorMessage name="location" component="div" className="error" />

                    <label htmlFor="start_time">Start Time</label>
                    <Field name="start_time" type="datetime-local" />
                    <ErrorMessage name="start_time" component="div" className="error" />

                    <label htmlFor="end_time">End Time</label>
                    <Field name="end_time" type="datetime-local" />
                    <ErrorMessage name="end_time" component="div" className="error" />

                    {!tripId && (
                        <>
                            <div className="place-section">
                                <label>Place</label>
                                <button type="button" onClick={() => setShowPlaceModal(true)}>
                                    {selectedPlace ? 'Change Place' : 'Select Place'}
                                </button>
                                {selectedPlace && (
                                    <p><strong>{selectedPlace.name}</strong><br />{selectedPlace.address}</p>
                                )}
                                <ErrorMessage name="place" component="div" className="error" />
                            </div>
                        </>
                    )}
                    <PlaceSelectorModal
                        show={showPlaceModal}
                        onClose={() => setShowPlaceModal(false)}
                        onPlaceSelect={(place) => {
                            setSelectedPlace(place)
                            setFieldValue('place', place.id)
                            setShowPlaceModal(false)
                        }}
                    />

                    <button type="submit">Add Event</button>                    
                </Form>
            )}
        </Formik>
    )
}

export default NewEventForm