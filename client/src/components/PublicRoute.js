import { useContext } from "react";
import { UserContext } from "../context/UserContext";
import { Navigate } from "react-router-dom";


function PublicRoute({ children }) {
    const { user, loading } = useContext(UserContext)

    if (loading) {
        return <div>Loading...</div>
    }

    return user ? <Navigate to="/"/> : children 
}

export default PublicRoute