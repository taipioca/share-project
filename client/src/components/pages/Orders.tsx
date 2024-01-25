import React, { useState, useEffect } from "react";
import { NewRequest } from "../modules/NewRequest";
import ItemDetails from "../modules/ItemDetails";

type Item = {
  title: string;
  requester_name: string;
  userId: string;
  timestamp: string;
  points: number;
};

const Orders = (props) => {
  const [requestedItems, setRequestedItems] = useState<Item[]>([]);
  const handleNewItemRequest = (item: Item) => {
    setRequestedItems((prevItems) => [...prevItems, item]);
  };
  useEffect(() => {
    // Fetch initial data here, if needed
  }, []);
  return (
    <div>
      {requestedItems.map((item, index) => (
        <ItemDetails key={index} item={item} />
      ))}
    </div>
  );
};

export default Orders;
