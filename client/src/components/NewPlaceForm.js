import { useContext } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { MapPin, Asterisk } from "lucide-react";
import { PlaceContext } from "../context/PlaceContext";
import "../styles/newplaceform.css"

function NewPlaceForm({ onSuccess }) {
    const { createPlace } = useContext(PlaceContext)

    const PlaceSchema = Yup.object().shape({
        name: Yup.string().required("Place name is required"),
        address: Yup.string().required("Please provide address")
    })

    const initialValues = {
        name: '',
        address: ''
    }

    return (
            <Formik
                initialValues={initialValues}
                validationSchema={PlaceSchema}
                onSubmit={async (values, { setSubmitting, setErrors }) => {
                    console.log("Submitting values:", values)
                    try {
                        const result = await createPlace(values)
                        if (result.success) {
                            console.log("Place successfully created!")
                            if (onSuccess) onSuccess(result.newPlace)
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
                    <Form className="place-form">
    
                        <label htmlFor="name">Name</label>
                        <div className="input-with-icon">
                            <Asterisk size={16} className="input-icon"/>
                            <Field name="name" type="text" placeholder="e.g. Golden Gate Park" className="with-icon"/>
                        </div>
                        <ErrorMessage name="name" component="div" className="error"/>

                        <label htmlFor="address">Location</label>
                        <div className="input-with-icon">
                            <MapPin size={16} className="input-icon"/>
                            <Field name="address" placeholder="e.g. San Francisco, CA" className="with-icon" />
                        </div>
                        <ErrorMessage name="address" component="div" className="error"/>
    
                        {errors.general && <div className="error">{errors.general}</div>}
    
                        <button type="submit">Add Place</button>
                    </Form>

                )}
            </Formik>
    )
}

export default NewPlaceForm