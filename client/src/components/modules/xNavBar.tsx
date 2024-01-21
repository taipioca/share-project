// NavBar.tsx
import React from "react";
import { Link } from "@reach/router";
import {
  GoogleOAuthProvider,
  GoogleLogin,
  googleLogout,
  CredentialResponse,
} from "@react-oauth/google";
import { RouteComponentProps } from "@reach/router";
import "./NavBar.css";
import Login from "./Login";

type Props = RouteComponentProps & {
  isLoggedIn: boolean;
  userId?: string;
  handleLogin: (credentialResponse: CredentialResponse) => void;
  handleLogout: () => void;
};

// const NavBar = ({ isLoggedIn, user, onLogin, onLogout }) => {
const NavBar = (props: Props) => {
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
        {props.userId ? (
          <>
            <Link to={`/profile/${props.userId}`} className="NavBar-linkContainer NavBar-link">
              Profile
            </Link>
            <button onClick={props.handleLogout}>Logout</button>
          </>
        ) : (
          <Login onLogin={props.handleLogin} />
        )}
      </div>
    </div>
  );
};

export default NavBar;
