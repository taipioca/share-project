import React, { useState, useEffect } from "react";
import { get } from "../../utilities";
import "./Profile.css";
import Orders from "./Orders";
// import icon from ;

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
  const [starRotations, setStarRotations] = useState([0, 0, 0, 0, 0]);
  const confettiColors = ["red", "blue", "green"];
  // Set a random rotation for each star when the component mounts
  useEffect(() => {
    setStarRotations(starRotations.map(() => Math.random() * 360));
  }, []);
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
      <div className="profile-container">
        <div className="profile-info">
          {Array.from({ length: 30 }).map((_, i) => (
            <div
              className={`confetti ${confettiColors[i % confettiColors.length]}`}
              style={
                {
                  "--random": Math.random(), // Random horizontal direction
                  animationDelay: `${Math.random() * 2}s`, // Random start time
                  animationDuration: `${Math.random() * 3 + 2}s`, // Random duration
                } as React.CSSProperties
              }
            ></div>
          ))}
          <div className="Profile-avatarContainer">
            <img
              src="https://i.pinimg.com/564x/72/34/28/72342848e6b8dc2f8877605f07e6e249.jpg"
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
                      <i
                        className={`star star-${ratingValue} ${
                          ratingValue <= user.rating ? "fas fa-star" : "far fa-star"
                        }`}
                        style={{
                          transform: `rotate(${starRotations[i]}deg)`,
                        }}
                      ></i>
                    </label>
                  );
                })}
              </div>
              <div className="Profile-points u-textCenter">
  <h2 style={{ position: 'relative', zIndex: 1 }}>{user.points}</h2>
  <h3 style={{ position: 'relative', zIndex: 1 }}>POINTS</h3>
</div>
            </div>
          </div>
        </div>
        <div className="tabs-container">
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
            <div className="profile-catalog">
              <div className="upload-button-container">
                <NewItem sharer_name={user.name} sharer_id={props.userId} />
              </div>

              <div className="items-container">
                {items.map((item) => (
                  <div key={item.id} id="edit-item">
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
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Profile;
