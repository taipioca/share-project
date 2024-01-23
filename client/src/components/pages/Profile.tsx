import React, { useState, useEffect } from "react";
import { get } from "../../utilities";
import "./Profile.css";

import "../../utilities.css";
import { NewReview } from "../modules/NewReview";

interface User {
  name: string;
  userid: string;
  points: number;
  rating: number;
  // add other properties here if needed
}

const Profile = (props) => {
  const [user, setUser] = useState<User>();

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
        <img
          src="https://cdn.pixabay.com/photo/2016/03/08/20/03/flag-1244649_1280.jpg"
          alt="User Avatar"
          className="Profile-avatar"
        />

        <h1 className="Profile-name u-textCenter">{user.name}</h1>
        <h2 className="Profile-points u-textCenter">{user.points} Points</h2>
        <h2 className="Profile-points u-textCenter">Rating: {user.rating}/5</h2>

        <NewReview reviewerName={user.name}  />
      </div>
    </>
  );
};

export default Profile;
