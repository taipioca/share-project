import React, { useState, useEffect } from "react";
import { get } from "../../utilities";

import "../../utilities.css";

const Profile = (props) => {
  const [user, setUser] = useState();
  useEffect(() => {
    document.title = "Profile Page";
    get(`/api/user`, { userid: props.userId }).then((userObj) => setUser(userObj));
  }, []);
  if (!user) {
    return <div> Loading! </div>;
  }
  return (
    <>
      <div className="Profile-avatarContainer">
        <div className="Profile-avatar" />
      <h1 className="Profile-name u-textCenter">{props.userId}</h1>

      </div>
    </>
  );
};

export default Profile;
