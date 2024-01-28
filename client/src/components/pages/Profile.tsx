import React, { useState, useEffect } from "react";
import { get } from "../../utilities";
import "./Profile.css";
import Orders from "./Orders";

import "../../utilities.css";
import { NewReview } from "../modules/NewReview";
import { EditItem, NewItem } from "../modules/NewItem";
import ItemActivityButton from "../modules/ItemActivity";

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
  };
};
const Profile = (props) => {
  const [user, setUser] = useState<User>();
  const [items, setItems] = useState<Item[]>([]);
  const [selectedTab, setSelectedTab] = useState("orders");

  const handleTabClick = (tabName) => {
    setSelectedTab(tabName);
  };

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
          src="https://i.pinimg.com/564x/0d/42/90/0d42905fc5e9d14fa032d8ea0282bf68.jpg"
          alt="User Avatar"
          className="Profile-avatar"
        />

        <h1 className="Profile-name u-textCenter">{user.name}</h1>
        <div className="Profile-pointsContainer">
          <div className="profile-rating">
            {[...Array(5)].map((star, i) => {
              const ratingValue = i + 1;
              return (
                <label key={i}>
                  <i className={ratingValue <= user.rating ? "fas fa-star" : "far fa-star"}></i>
                </label>
              );
            })}
          </div>
          <h2 className="Profile-points u-textCenter">{user.points} Points</h2>
        </div>
      </div>
      <div className="tabs">
        <button
          className={selectedTab === "orders" ? "active" : ""}
          onClick={() => handleTabClick("orders")}
        >
          Orders
        </button>
        <button
          className={selectedTab === "items" ? "active" : ""}
          onClick={() => handleTabClick("items")}
        >
          My Shares
        </button>
      </div>
      {selectedTab === "orders" ? (
        <Orders user={user} />
      ) : (
        <div className="catalog">
          <NewItem sharer_name={user.name} sharer_id={props.userId} />
          {items.map((item) => (
            <div key={item.id} className="item">
              <div className="image-container">
                <img src={item.image} alt={item.title} />
              </div>
              <h4 className="item-text">{item.title}</h4>
              <p className="item-text">Rating: 5/5 (1 review)</p>
              <h3 className="item-text">{item.points} Points/day</h3>
              <div className="item-buttons">
                <EditItem item_id={item.id} />
                <ItemActivityButton itemId={item.id} />
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default Profile;
