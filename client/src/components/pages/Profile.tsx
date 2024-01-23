import React, { useState, useEffect } from "react";
import { get, post } from "../../utilities";
import "./Profile.css";
import { v4 as uuidv4 } from "uuid";

import "../../utilities.css";
import { NewReview } from "../modules/NewReview";
import NewItem from "../modules/NewItem";

interface User {
  name: string;
  userid: string;
  points: number;
  rating: number;
  // add other properties here if needed
}
type Item = {
  id: string;
  image: string;
  title: string;
  points: number;
};
const Profile = (props) => {
  const [items, setItems] = useState<Item[]>([]);

  const [user, setUser] = useState<User>();

  useEffect(() => {
    document.title = "Profile Page";
    get(`/api/user`, { userid: props.userId }).then((userObj) => setUser(userObj));
  }, []);
  if (!user) {
    return <div> Loading! </div>;
  }
  const handleNewItem = (item: Item) => {
    setItems((prevItems) => {
      const addedItem = {
        ...item,
        id: uuidv4(),
        sharer: {
          sharer_id: { userid: props.userId },
          name: user.name,
        },
      };
      const newItems = [...prevItems, addedItem];
      post("/api/newproduct", addedItem).then((productDetails: any) => {
        console.log("Returned addedItem:", productDetails);
      });
      return newItems;
    });
  };


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
        <NewItem onNewItem={handleNewItem} />

        <NewReview reviewerName={user.name}  />
      </div>
    </>
  );
};

export default Profile;
