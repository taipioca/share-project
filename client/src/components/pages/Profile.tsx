import React, { useState, useEffect } from "react";
import { get, post } from "../../utilities";
import "./Profile.css";

import "../../utilities.css";
import { NewReview } from "../modules/NewReview";
import { NewItem } from "../modules/NewItem";
import { Link } from "react-router-dom";

interface User {
  name: string;
  userid: string;
  points: number;
  rating: number;
}
type Item = {
  id: string;
  image: string;
  title: string;
  points: number;
  sharer: {
    sharer_id: string;
    sharer_name: string;
  }
};
const Profile = (props) => {
  const [user, setUser] = useState<User>();
  const [items, setItems] = useState<Item[]>([]);

  useEffect(() => {
    get("/api/catalog").then((itemsObjs: Item[]) => {
      const userItems = itemsObjs.filter((item) => item.sharer.sharer_id === props.userId);
      setItems(userItems);
    });
  }, [props.userId]);

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
        <NewItem sharer_name={user.name} sharer_id={props.userId} />

        {/* <NewReview reviewerName={user.name} reviewerId={props.userId} /> */}
      </div>

      <div className="catalog">
      {items.map((item) => (
        // <Link to={`/item/${item.id}`} key={item.id} id={item.id} className="item">
        <div>
          <div className="image-container">
            <img src={item.image} alt={item.title} />
          </div>
          <h4 className="item-text">{item.title}</h4>
          <p className="item-text">Rating: 5/5 (1 review)</p>
          <h3 className="item-text">{item.points} Points/day</h3>
          </div>

        // </Link>
      ))}
    </div>
    </>
  );
};

export default Profile;
