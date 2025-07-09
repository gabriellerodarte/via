import { useContext, useState } from "react"
import { NavLink, useNavigate } from "react-router-dom"
import { UserContext } from "../context/UserContext"
import { Home, Compass, Search, PlusCircle, Luggage, Map } from "lucide-react";
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
        <>
            <nav className="navbar">
                <div className="navbar-left">
                    <div className="logo"><Compass size={20} style={{ marginRight: '0.4rem', color: "#b3e5fc" }}/> via.</div>
                </div>
                <div className="nav-center">
                    <NavLink to="/" className="nav-link"><Home size={18}/> Home</NavLink>
                    <NavLink to="/my-trips" className="nav-link"><Luggage size={18}/> Trips</NavLink>
                    <NavLink to="/new-trip" className="nav-link"><PlusCircle size={18}/>Plan a Trip</NavLink>
                    <NavLink to="/places" className="nav-link"><Search size={18}/> Explore</NavLink>
                    <NavLink to="/about" className="nav-link"><Map size={18}/> About</NavLink>
                </div>
                <div className="navbar-right">
                    <button onClick={handleLogout} className="logout-button">Log Out</button>
                </div>
            </nav>
            {error && <div className="error-message">{error}</div>}
        </>
    )
}

export default NavBar