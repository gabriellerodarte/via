import * as Yup from "yup";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { useParams } from "react-router-dom";

function NewEventForm() {
    const { id, tripId } = useParams()

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
        place: !tripId ? Yup.string().required('Please select a place or add a new one') : Yup.string()
    })

    const initialValues = {
        title: '',
        planning_status: 'tentative',
        location: '',
        start_time: '',
        end_time: '',
        place: id || ''
    }
}

export default NewEventForm