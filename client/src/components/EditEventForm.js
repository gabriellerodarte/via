import { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import * as Yup from "yup";
import { Formik, Form, Field, ErrorMessage,  } from 'formik';
import { UserContext } from '../context/UserContext';
import { Check } from 'lucide-react';

function EditEventForm() {
    const { tripId, placeId, id } = useParams()
    const { userTrips, updateEvent } = useContext(UserContext)
    const navigate = useNavigate()
    
    const editTrip = userTrips.find(t => t.id === parseInt(tripId))
    if (!editTrip) return <p>Trip not found</p>
    const editPlace = editTrip?.places?.find(p => p.id === parseInt(placeId))
    if (!editPlace) return <p>Place not found</p>
    const editEvent = editPlace?.events?.find(e => e.id === parseInt(id))
    if (!editEvent) return <p>Event not found</p>

    const UpdateEventSchema = Yup.object().shape({
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
        place: Yup.string().required('Please select a place or add a new one') 
    })
    
    const initialValues = {
        title: editEvent.title,
        planning_status: editEvent.planning_status,
        location: editEvent.location,
        start_time: editEvent.start_time,
        end_time: editEvent.end_time,
        place: placeId,
        trip: tripId
    }

    return (
        <div>
            <div className="event-form-header">
                <button
                    type="button"
                    className="back-button"
                    onClick={() => navigate(`/my-trips/${tripId}`)}
                    >
                    ← Back to Trip
                </button>
            </div>
            <h1 className="form-title">{editTrip.name}</h1>
            <Formik
                initialValues={initialValues}
                validationSchema={UpdateEventSchema}
                onSubmit={async (values, { setSubmitting, setErrors }) => {
                    try {
                        const updatedEvent = {
                            id: id,
                            title: values.title,
                            planning_status: values.planning_status,
                            location: values.location,
                            start_time: values.start_time,
                            end_time: values.end_time,
                            place_id: parseInt(placeId),
                            trip_id: parseInt(tripId)
                        }
                        const result = await updateEvent(updatedEvent)
                        if (result.success) {
                            navigate(`/my-trips/${tripId}`)
                        } else {
                            setErrors({ general: result.error })
                        }
                    } catch (err) {
                        setErrors({ general: err.error })
                    } finally {
                        setSubmitting(false)
                    }
                }}
            >
                {({ values, setFieldValue, errors}) => (
                    <>
                    
                        <Form className="event-form">
                            <div className="event-place-heading">
                                <h2>Edit Event - {editPlace.name}</h2>
                                <p>{editPlace.address}</p>
                            </div>
                            <label htmlFor="title">Title</label>
                            <Field name="title" type="text" placeholder="Ex: Rehearsal Dinner" />
                            <ErrorMessage name="title" component="div" className="error" />

                            <label htmlFor='planning_status'>Planning Status</label>
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
                            <Field name="start_time" type="datetime-local" step="60"/>
                            <ErrorMessage name="start_time" component="div" className="error" />

                            <label htmlFor="end_time">End Time</label>
                            <Field name="end_time" type="datetime-local" step="60"/>
                            <ErrorMessage name="end_time" component="div" className="error" />

                            {errors.general && <div className="error">{errors.general}</div>}
                            <button type="submit">Update Event</button>                    
                        </Form>
                    </>
                )}
            </Formik>
        </div>
    )
}

export default EditEventForm