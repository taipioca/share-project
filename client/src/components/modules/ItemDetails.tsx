import React, { useEffect, useState } from "react";
import { RouteComponentProps, Link } from "@reach/router";
import { get } from "../../utilities";
import { NewRequest } from "./NewRequest";

import "./ItemDetails.css";

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
  description: string;
  points: number;
  minShareDays: string;
  maxShareDays: string;
  pickupLocation: string;
  returnLocation: string;
  pickupNotes: string;
  returnNotes: string;
  sharer: {
    sharer_id: String;
    sharer_name: String;
  };
};
const ItemDetails = (props) => {
  const id = props.id;
  const [item, setItem] = useState<Item | null>(null);

  const [user, setUser] = useState<User>();
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    setIsActive(true);
  }, []);

  const handleClick = () => {
    setIsActive(true);
  };

  useEffect(() => {
    get("/api/catalog").then((itemsObjs) => {
      const foundItem = itemsObjs.find((item: Item) => item.id === id);
      // console.log(foundItem);
      setItem(foundItem);
    });
  }, [id]);
  useEffect(() => {
    if (props.userId) {
      get(`/api/user`, { userid: props.userId }).then((userObj) => setUser(userObj));
    }
  }, [props.userId]);
  if (!item) {
    return <div>No item found</div>;
  }

  const youGetPoints = Math.ceil(item.points * 0.2);


  return (
    <div className={`item-container ${isActive ? "active" : ""}`} onClick={handleClick}>
      <div className="item-container">
        <div className="item-content">
          {" "}
          <Link to="/catalog" className="back-button-link">
            <button className="back-button">
              <i className="fas fa-arrow-left"></i>
            </button>
          </Link>
          <div className="item-left">
            <div className="item-image-container">
              <img src={item.image} alt={item.title} className="item-image" />
            </div>
            <div className="location-container">
              <div className="location-details">
                <h3>Pickup Location</h3>
                <p>{item.pickupLocation}</p>
                <h3>Pickup Notes</h3>
                <p>{item.pickupNotes}</p>
              </div>
              <div className="location-details">
                <h3>Return Location</h3>
                <p>{item.returnLocation}</p>
                <h3>Return Notes</h3>
                <p>{item.returnNotes}</p>
              </div>
            </div>
          </div>
          <div className="item-details">
            <h2>{item.title ?? ""}</h2>
            <div className="uploader-rating">
              <p>By {item.sharer.sharer_name}</p>
              <p>Rating: 5/5 (1 review)</p>
            </div>
            <div className="rounded-box">
              <div className="points-container">
                <p>{item.points ?? 0} Points /day</p>
                <p>You get: {youGetPoints} Points /day</p>
              </div>
              <p>{item.description ?? ""}</p>

              <NewRequest
                item={item}
                requester={{ requester_id: props.userId, requester_name: user?.name ?? "" }}
                item_id={item.id}
                sharer={{ sharer_id: item.sharer.sharer_id, sharer_name: item.sharer.sharer_name }}
                title={item.title}
                // sharer_points={calculateTotalPoints()}
                // requester_points={calculateTotalRewards()}
              />
              {/* <p>Total Points: {calculateTotalPoints()}</p>
              <p>Your Total Rewards: {calculateTotalRewards()}</p> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemDetails;
