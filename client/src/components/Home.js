import { useContext } from "react"
import { UserContext } from "../context/UserContext"
import Dashboard from "./Dashboard"
import PublicHome from "./PublicHome"


function Home() {
    const { user, loading } = useContext(UserContext)

    if (loading) {
        return <div>Loading...</div>
    }

    return (
        <div>
            {user ? <Dashboard/> : <PublicHome/>}
        </div>
    )
}

export default Home