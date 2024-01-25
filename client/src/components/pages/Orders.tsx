import React, { useState, useEffect } from "react";
import { NewRequest } from "../modules/NewRequest";
import { get } from "../../utilities";

import ItemDetails from "../modules/ItemDetails";

type Item = {
  item_id: string;
  requester_id: string;
  sharer_id: string;
  timestamp: string;
  points: number;
};

const Orders = (props) => {
  const { user } = props;
  const [requestedItems, setRequestedItems] = useState<Item[]>([]);

  useEffect(() => {
    get("/api/requests").then((requests: Item[]) => {
      const userRequests = requests.filter((request) => request.requester_id === user.userid);
      setRequestedItems(userRequests);
    });
  }, [user]);

  return (
    <div>
      {requestedItems.map((item, index) => (
        <ItemDetails key={index} item={item} />
      ))}
    </div>
  );
};

export default Orders;
