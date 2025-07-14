import { useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom"
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { UserContext } from "../context/UserContext";
import { Compass } from "lucide-react";
import "../styles/signup.css"

function Signup() {
    const { signupUser } = useContext(UserContext)
    const navigate = useNavigate()

    const SignupSchema = Yup.object().shape({
        username: Yup.string().required('Username required'),
        password: Yup.string().required('Password required'),
        confirmPassword: Yup.string()
        .oneOf([Yup.ref('password'), null], 'Passwords must match')
        .required('Confirm password is required')
    })

    const initialValues = {
        username: "",
        password: "",
        confirmPassword: ""
    }

    return (
        <div className="signup-page">
            <h1 onClick={() => navigate("/")}><Compass size={30} style={{ marginRight: '0.4rem', color: "#b3e5fc" }}/> via.</h1>
            <p>Sign up to start exploring places<br/>and plan your next trip!</p>

            <Formik
                initialValues={initialValues}
                validationSchema={SignupSchema}
                onSubmit={async (values, { setSubmitting, setErrors }) => {
                    try {
                        const result = await signupUser(values)
                        if (result.success) {
                            navigate("/")
                        } else {
                            setErrors({ general: result.error})
                        }
                    } catch (err) {
                        setErrors({ general: err.message })
                    } finally {
                        setSubmitting(false)
                    }
                }}
            >
                {({ errors }) => (
                    <Form className="signup-form">
                        <label htmlFor="username">Username</label>
                        <Field name="username" type="text"/>
                        <ErrorMessage name="username" component="div" className="error"/>

                        <label htmlFor="password">Password</label>
                        <Field name="password" type="password"/>
                        <ErrorMessage name="password" component="div" className="error"/>


                        <label htmlFor="confirmPassword">Confirm Password</label>
                        <Field name="confirmPassword" type="password"/>
                        <ErrorMessage name="confirmPassword" component="div" className="error"/>

                        {errors.general && <div className="error">{errors.general}</div>}

                        <div>
                            <button type="submit">Sign Up</button>
                        </div>
                    </Form>
                )}
            </Formik>
            <NavLink to="/login">Already have an account?</NavLink>
        </div>
    )
}

export default Signup