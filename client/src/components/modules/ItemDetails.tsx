import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { RouteComponentProps } from "@reach/router";

import "./ItemDetails.css";

// Define a type for your items
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
};

const ItemDetails = (props: RouteComponentProps<{ itemId: string }>) => {
  const [item, setItem] = useState<Item | null>(null);
  const { itemId } = useParams<{ itemId: string }>();

  useEffect(() => {
    const savedItems = localStorage.getItem("items");
    if (savedItems) {
      const items: Item[] = JSON.parse(savedItems);
      const foundItem = items.find((item) => item.id === itemId);
      setItem(foundItem || null);
    }
  }, [itemId]);

  if (!item) {
    return <div>Loading...</div>;
  }

  const youGetPoints = Math.ceil(item.points * 0.2);

  return (
    <div className="item-container">
      <img
        src={`data:image/jpeg;base64,${item.image}` ?? ""}
        alt={item.title ?? ""}
        className="item-image"
      />
      <div className="item-details">
        <h2>{item.title ?? ""}</h2>
        <p>Rating: 5/5 (1 review)</p>
        <p>{item.points ?? 0} Points /day</p>
        <p>You get: {youGetPoints} Points /day</p>
        <p>{item.description ?? ""}</p>
      </div>
    </div>
  );
};

export default ItemDetails;
