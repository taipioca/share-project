import React, { useEffect, useState } from "react";
import { RouteComponentProps } from "@reach/router";

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
};
const ItemDetails = (props: RouteComponentProps<{ id: string }>) => {
  const id = props.id;
  console.log('id:', id)
  const [item, setItem] = useState<Item | null>(null);

  useEffect(() => {
    const storedItems = JSON.parse(localStorage.getItem('items') || '[]');
    console.log('storedItems:', storedItems);
    console.log('id:', id)
    const foundItem = storedItems.find((item: Item) => item.id === id);

    setItem(foundItem);
  }, [id]);

  if (!item) {
    return <div>No item found</div>;
  }

  const youGetPoints = Math.ceil(item.points * 0.2);
  console.log(item.id)
  return (
    <div className="item-container">
      <img src={item.image} alt={item.title} 
        className="item-image"
      />
      <div className="item-details">
        
        <h2>{item.title ?? ""}</h2>
        <p>Rating: 5/5 (1 review)</p>
        <p>{item.points ?? 0} Points /day</p>
        <p>{item.description ?? ""}</p>
        <p>You get: {youGetPoints} Points /day</p>
      </div>
    </div>
  );
};

export default ItemDetails;
