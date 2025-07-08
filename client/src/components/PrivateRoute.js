import { useContext } from "react";
import { UserContext } from "../context/UserContext";
import { Navigate } from "react-router-dom";


function PrivateRoute({ children }) {
    const { user, loading } = useContext(UserContext)

    if (loading) {
        return <div>Loading...</div>
    }

    return user ? children : <Navigate to="/login"/>
}

export default PrivateRoute