import * as Yup from "yup";
import { Formik, Form, Field, ErrorMessage } from "formik";
import "../styles/newtripform.css"
import { useContext } from "react";
import { UserContext } from "../context/UserContext";


function NewTripForm() {
    const { createTrip } = useContext(UserContext)

    const TripSchema = Yup.object().shape({
        name: Yup.string().required('Please enter your trip name'),
        start_date: Yup.date().required('Start date is required'),
        end_date: Yup.date().required('End date is required').min(Yup.ref('start_date'), 'End date cannot be before start date')
    })

    const initialValues = {
        name: '',
        start_date: '',
        end_date: ''
    }
    
    return (
        <div className="trip-form-container">
            <h2 className="trip-form-title">Your Trip</h2>
            <Formik
                initialValues={initialValues}
                validationSchema={TripSchema}
                onSubmit={async (values, { setSubmitting, setErrors }) => {
                    try {
                        const result = await createTrip(values)
                        if (result.success) {
                            console.log("Trip successfully created! Need to reroute to trip page.")
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
                {({ errors }) => (
                    <Form className="trip-form">
    
                        <label htmlFor="name">What is your trip called?</label>
                        <Field name="name" type="text" placeholder="e.g. Kaley's Bach Bash"/>
                        <ErrorMessage name="name" component="div" className="error"/>
                        
                        <p className="trip-form-subtitle">When will your trip take place?</p>
                        <div className="date-fields">
                            <label htmlFor="start_date">
                                Start Date
                                <Field name="start_date" type="date"/>
                                <ErrorMessage name="start_date" component="div" className="error"/>
                            </label>
    
                            <label htmlFor="end_date">
                                End Date
                                <Field name="end_date" type="date"/>
                                <ErrorMessage name="end_date" component="div" className="error"/>
                            </label>
                        </div>
    
                        {errors.general && <div className="error">{errors.general}</div>}
    
                        <button type="submit">Create Trip</button>
                    </Form>

                )}
            </Formik>
        </div>
    )
}

export default NewTripForm