import { useContext, useState } from "react"
import { NavLink, useNavigate } from "react-router-dom"
import { UserContext } from "../context/UserContext"


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
        <nav>
            <div>
                <div>via.</div>
                <div>
                    <NavLink to="/">Home</NavLink>
                    <NavLink to="/my-trips">View My Trips</NavLink>
                    <NavLink to="/places">Browse All Places</NavLink>
                </div>
            </div>
            <div>
                <button onClick={handleLogout}>Log Out</button>
                {error && <div>{error}</div>}
            </div>
        </nav>
    )
}

export default NavBar