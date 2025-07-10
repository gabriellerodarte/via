import * as Yup from "yup";
import { Formik, Form, Field, ErrorMessage } from "formik";

function NewEventForm() {
    
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
        place: Yup.string().required('Please select a place or add a new one')
    })
}

export default NewEventForm