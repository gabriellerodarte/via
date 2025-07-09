import React, { useContext } from "react";
import { Outlet } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import { Plane } from "lucide-react";
import NavBar from "./NavBar";
import "../styles/app.css"

function App() {
  const { user, loading } = useContext(UserContext)
  
  if (loading) {
    // insert Loading spinner or page or something
    return <p>Loading user session...</p>
  }

  return (
    <div>
      <header>
        {user && <NavBar/>}
      </header>
      <main>
        <Outlet/>
      </main>
      <footer className="app-footer">
        {user && <p>Planned by {user.username} <Plane size={18}/></p>}
      </footer>
    </div>
  )
}

export default App;
