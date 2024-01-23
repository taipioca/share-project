import React, { useEffect, useState } from "react";
import { RouteComponentProps, Link } from "@reach/router";
import { get } from "../../utilities";

import "./ItemDetails.css";

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
const ItemDetails = (props: RouteComponentProps<{ id: string }>) => {
  const id = props.id;
  const [item, setItem] = useState<Item | null>(null);
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);

  useEffect(() => {
    get("/api/catalog").then((itemsObjs) => {
      const foundItem = itemsObjs.find((item: Item) => item.id === id);
      console.log(foundItem);
      setItem(foundItem);
    });
  }, [id]);

  if (!item) {
    return <div>No item found</div>;
  }
  const handleSendRequest = () => {
    // IMPLEMENT THIS LATER
    console.log("Send request button clicked");
  };

  const youGetPoints = Math.ceil(item.points * 0.2);
  const calculateTotalPoints = () => {
    if (startDate && endDate && item) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const diffTime = Math.abs(end.getTime() - start.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays * item.points;
    }
    return 0;
  };
  const calculateTotalRewards = () => {
    if (startDate && endDate && item) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const diffTime = Math.abs(end.getTime() - start.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays * youGetPoints;
    }
    return 0;
  };

  return (
    <div className="item-container">
      <Link to="/catalog">
        <button>&#8592;</button>
      </Link>
      <div className="item-content">
        <div className="item-left">
          <img src={item.image} alt={item.title} className="item-image" />
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
          <p>Uploaded by {item.sharer.sharer_name}</p>
          <p>Rating: 5/5 (1 review)</p>
          <p>{item.points ?? 0} Points /day</p>
          <p>{item.description ?? ""}</p>
          <p>You get: {youGetPoints} Points /day</p>
          <div className="date-container">
            <label>
              Start Date:
              <input
                type="date"
                value={startDate ?? ""}
                onChange={(e) => setStartDate(e.target.value)}
                required
              />
            </label>
            <label>
              End Date:
              <input
                type="date"
                value={endDate ?? ""}
                onChange={(e) => setEndDate(e.target.value)}
                required
              />
            </label>
          </div>

          <button onClick={handleSendRequest}>Send Request</button>
          <p>Total Points: {calculateTotalPoints()}</p>
          <p>Your Total Rewards: {calculateTotalRewards()}</p>
        </div>
      </div>
    </div>
  );
};

export default ItemDetails;
