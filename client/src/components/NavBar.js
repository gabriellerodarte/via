import { useContext, useState } from "react"
import { NavLink, useNavigate } from "react-router-dom"
import { UserContext } from "../context/UserContext"
import "../styles/navbar.css"


function NavBar() {
    const { logoutUser } = useContext(UserContext)
    const navigate = useNavigate()
    const [error, setError] = useState(null)

    const handleLogout = async () => {
        setError(null)
        const result = await logoutUser()
        if (result.success) {
            navigate("/")
        } else {
            setError(result.error)
        }
    }

    return (
        <nav className="navbar">
            <div className="navbar-left">
                <div className="logo">via.</div>
                <div className="nav-links">
                    <NavLink to="/" className="nav-link">Home</NavLink>
                    <NavLink to="/my-trips" className="nav-link">Trips</NavLink>
                    <NavLink to="/places" className="nav-link">Explore</NavLink>
                </div>
            </div>
            <div className="navbar-right">
                <button onClick={handleLogout} className="logout-button">Log Out</button>
                {error && <div className="error-message">{error}</div>}
            </div>
        </nav>
    )
}

export default NavBar