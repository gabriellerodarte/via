import React, { useContext, useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import NavBar from "./NavBar";

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
      <footer>
        {user && <p>Planned by {user.username} ‍✈️</p>}
      </footer>
    </div>
  )
}

export default App;
