import React, { useState } from "react";
import {
  GoogleOAuthProvider,
  GoogleLogin,
  googleLogout,
  CredentialResponse,
} from "@react-oauth/google";
import jwt_decode from "jwt-decode";

const GOOGLE_CLIENT_ID = "365028401591-cfffgvu1uj5hl25ut1mnt7bplc2nqmrj.apps.googleusercontent.com";

const Login = ({ onLogin }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = (credentialResponse: CredentialResponse) => {
    const userToken = credentialResponse.credential;
    const decodedCredential = jwt_decode(userToken as string) as { name: string; email: string };
    console.log(`Logged in as ${decodedCredential.name}`);
    setIsLoggedIn(true);
    // Call onLogin with the user's email
    onLogin(decodedCredential.email);
  };

  const handleLogout = () => {
    googleLogout();
    setIsLoggedIn(false);
  };

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      {isLoggedIn ? (
        <button onClick={handleLogout}>Logout</button>
      ) : (
        <GoogleLogin
          onSuccess={handleLogin}
          onError={() => console.log("Error Logging in")}
        />
      )}
    </GoogleOAuthProvider>
  );
};

export default Login;