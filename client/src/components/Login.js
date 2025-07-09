import { useContext } from "react"
import { NavLink, useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { UserContext } from "../context/UserContext"

function Login() {
    const { loginUser } = useContext(UserContext)
    const navigate = useNavigate()
    
    const LoginSchema = Yup.object().shape({
        username: Yup.string().required("Username required"),
        password: Yup.string().required("Password required")
    })

    const initialValues = {
        username: "",
        password: ""
    }


    return (
        <div>
            <h1>via.</h1>
            <Formik
                initialValues={initialValues}
                validationSchema={LoginSchema}
                onSubmit={async (values, { setSubmitting, setErrors }) => {
                    try {
                        const result = await loginUser(values)
                        if (result.success) {
                            console.log("Login successful!")
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
                    <Form>
                        <label htmlFor="username">Username</label>
                        <Field name="username" type="text"/>
                        <ErrorMessage name="username" component="div" className="error"/>

                        <label htmlFor="password">Password</label>
                        <Field name="password" type="password"/>
                        <ErrorMessage name="password" component="div" className="error"/>

                        {errors.general && <div className="error">{errors.general}</div>}

                        <div>
                            <button type="submit">Log In</button>
                        </div>
                    </Form>
                )}

            </Formik>
            <div>
                Don't have an account? {" "} <NavLink to="/signup">Sign Up</NavLink>
            </div>
        </div>
    )
}

export default Login