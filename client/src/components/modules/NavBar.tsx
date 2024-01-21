// NavBar.tsx
import React from "react";
import { Link } from "@reach/router";
import {
  GoogleOAuthProvider,
  GoogleLogin,
  googleLogout,
  CredentialResponse,
} from "@react-oauth/google";

import "./NavBar.css";
import { RouteComponentProps } from "@reach/router";

const GOOGLE_CLIENT_ID = "350716754210-d2e3uodftb7j5mgkp2n0n8u1qtat5m22.apps.googleusercontent.com";

type Props = RouteComponentProps & {
  userId?: string;
  handleLogin: (credentialResponse: CredentialResponse) => void;
  handleLogout: () => void;
};
const NavBar = (props: Props) => {
  const { handleLogin, handleLogout } = props;

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
        <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
          {props.userId ? (
            <button
              onClick={() => {
                googleLogout();
                handleLogout();
              }}
            >
              Logout
            </button>
          ) : (
            <GoogleLogin onSuccess={handleLogin} onError={() => console.log("Error Logging in")} />
          )}
        </GoogleOAuthProvider>
      </div>
    </div>
  );
};

export default NavBar;
