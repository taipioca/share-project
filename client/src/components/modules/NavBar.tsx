import React from "react";
import { Link } from "@reach/router";
import {
  GoogleOAuthProvider,
  GoogleLogin,
  googleLogout,
  CredentialResponse,
} from "@react-oauth/google";

import "./NavBar.css";

//TODO(weblab student): REPLACE WITH YOUR OWN CLIENT_ID
const GOOGLE_CLIENT_ID = "365028401591-cfffgvu1uj5hl25ut1mnt7bplc2nqmrj.apps.googleusercontent.com";

type Props = {
  userId?: string;
  handleLogin: (credentialResponse: CredentialResponse) => void;
  handleLogout: () => void;
};
const NavBar = (props: Props) => {
  const { handleLogin, handleLogout } = props;

  return (
    <div className="NavBar-container ">
      <div className="NavBar-left">
        <Link to="/" className="NavBar-title u-bold NavBar-title">
          sharedom
        </Link>
      </div>
      <div className="NavBar-right">
        <Link to={"/catalog/"} className="NavBar-linkContainer NavBar-link">
          Catalog
        </Link>
        {props.userId && (
          <Link to={`/profile/${props.userId}`} className="NavBar-linkContainer NavBar-link">
            Profile
          </Link>
        )}

        <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
          {props.userId ? (
            <button   className="custom-google-login"

              onClick={() => {
                googleLogout();
                handleLogout();
              }}
            >
              Logout
            </button>
          ) : (
            <div className="custom-google-login">
              <GoogleLogin
                onSuccess={handleLogin}
                onError={() => console.log("Error Logging in")}
              />
            </div>
          )}
        </GoogleOAuthProvider>
      </div>
    </div>
  );
};

export default NavBar;
