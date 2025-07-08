import { Link } from "react-router-dom"


function PublicHome() {

    return (
        <div>
            <p>Your next trip begins here.</p>
            <Link to="/login">Log In</Link>
            <Link to="/signup">Sign Up</Link>
        </div>
    )
}

export default PublicHome