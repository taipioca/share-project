// NavBar.tsx
import React from "react";
import { Link } from "@reach/router";
import "./NavBar.css";
import Login from "./Login";

const NavBar = ({ isLoggedIn, userID, onLogin, onLogout }) => {
  return (
    <div className="NavBar-container u-inlineBlock">
      <div className="NavBar-title">
        <Link to="/" className="NavBar-title u-bold">
          sharedom
        </Link>
      </div>
      <div className="NavBar-right">
        <Link to={"/catalog/"} className="NavBar-linkContainer NavBar-link">
          Catalog
        </Link>
        {isLoggedIn ? (
          <>
            <Link to={`/profile/${userID}`} className="NavBar-linkContainer NavBar-link">
              Profile
            </Link>
            <button onClick={onLogout}>Logout</button>
          </>
        ) : (
          <Login onLogin={onLogin} />
        )}
      </div>
    </div>
  );
};

export default NavBar;