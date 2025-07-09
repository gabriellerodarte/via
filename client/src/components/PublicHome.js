import { Link } from "react-router-dom"
import { Compass } from "lucide-react"

function PublicHome() {

    return (
        <div>
            <h1><Compass size={30} style={{ marginRight: '0.4rem', color: "#b3e5fc" }}/> via.</h1>

            <p>Your next trip begins here.</p>
            <Link to="/login">Log In</Link>
            <Link to="/signup">Sign Up</Link>
        </div>
    )
}

export default PublicHome