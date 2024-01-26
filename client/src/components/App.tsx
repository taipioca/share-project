import React, { useState, useEffect } from "react";
import { Router, navigate } from "@reach/router";
import NavBar from "./modules/NavBar";
import jwt_decode from "jwt-decode";
import { CredentialResponse } from "@react-oauth/google/dist";
import { get, post } from "../utilities";
import Home from "./pages/Home";
import CatalogPage from "./pages/CatalogPage";
import ItemDetails from "./modules/ItemDetails";
import { NewProduct } from "./modules/NewProductInput";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import { NewReview } from "./modules/NewReview";
import { NewRequest } from "./modules/NewRequest";
import { socket } from "../client-socket";
import User from "../../../shared/User";
import Orders from "./pages/Orders";
import "../utilities.css";

const App = () => {
  const [userId, setUserId] = useState<string | undefined>(undefined);

  useEffect(() => {
    get("/api/whoami")
      .then((user: User) => {
        if (user._id) {
          // TRhey are registed in the database and currently logged in.
          setUserId(user._id);
        }
      })
      .then(() =>
        socket.on("connect", () => {
          post("/api/initsocket", { socketid: socket.id });
        })
      );
  }, []);

  const handleLogin = (credentialResponse: CredentialResponse) => {
    const userToken = credentialResponse.credential;
    const decodedCredential = jwt_decode(userToken as string) as { name: string; email: string };
    console.log(`Logged in as ${decodedCredential.name}`);
    post("/api/login", { token: userToken }).then((user) => {
      setUserId(user._id);
      post("/api/initsocket", { socketid: socket.id });
    });
  };

  const handleLogout = () => {
    setUserId(undefined);
    post("/api/logout").then(() => {
      navigate("/home");
    });
  };

  return (
    <>
      <NavBar
        // isLoggedIn={true}
        handleLogin={handleLogin}
        handleLogout={handleLogout}
        userId={userId}
      />
      <Router>
        <Home path="/" />
        <Home path="/home" />
        <CatalogPage path="/catalog" />
        <Profile userId={userId} path="/profile/:userId" />
        <NotFound default={true} />
        <ItemDetails userId={userId} path="/item/:id" />

        <NewProduct path="/newproduct" />
        <NewReview path="/newreview" />
        <NewRequest path="/newrequest" />
        <Orders path="/orders" />
      </Router>
    </>
  );
};

export default App;
