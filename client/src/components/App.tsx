import React, { useState } from "react";
import { Router } from "@reach/router";
import NavBar from "./modules/NavBar";
import CatalogPage from "./pages/CatalogPage";
import ItemDetails from "./modules/ItemDetails";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";

import "../utilities.css";

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState(null);

  const handleLogin = (id) => {
    setIsLoggedIn(true);
    setUserId(id);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserId(null);
  };

  return (
    <>
      <NavBar isLoggedIn={isLoggedIn} user={userId} onLogin={handleLogin} onLogout={handleLogout} />
      <Router>
        <CatalogPage path="/catalog/" />
        <Profile userId={userId} path="/profile/:userId" />        
        <NotFound default={true} />
        <ItemDetails path="/item/:id" />
      </Router>
      <button onClick={() => localStorage.clear()}>Clear Local Storage</button>
    </>
  );
};

export default App;
