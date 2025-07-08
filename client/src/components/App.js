import React, { useContext, useEffect, useState } from "react";
import { Switch, Route } from "react-router-dom";
import { UserContext } from "../context/UserContext";

function App() {
  const { user, loading } = useContext(UserContext)
  
  if (loading) {
    return <p>Loading user session...</p>
  }
  
  return (
    <div>
      <header>
        {/* NavBar component */}
      </header>
      <main>
        <h1>APP COMPONENT</h1>
        {/* Outlet and any conditional rendering if loading? */}
      </main>
      <footer>
        {/* App footnote reliant on if user logged in */}
      </footer>
    </div>
  )
}

export default App;
