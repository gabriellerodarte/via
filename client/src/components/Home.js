import { useContext } from "react"
import { UserContext } from "../context/UserContext"
import Dashboard from "./Dashboard"
import PublicHome from "./PublicHome"
import { Compass } from "lucide-react"


function Home() {
    const { user, loading } = useContext(UserContext)

    if (loading) {
        return <div>Loading...</div>
    }

    return (
        <div>
            <h1><Compass size={30} style={{ marginRight: '0.4rem', color: "#b3e5fc" }}/> via.</h1>
            {user ? <Dashboard/> : <PublicHome/>}
        </div>
    )
}

export default Home