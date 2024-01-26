import React, { useState, useEffect } from "react";
import { NewRequest } from "../modules/NewRequest";
import { get } from "../../utilities";

import ItemDetails from "../modules/ItemDetails";

type Item = {
  id: string;
  image: string;
  title: string;
  points: number;
  requester_id: string;
  sharer_id: string;
  item_id: string;
};

interface ItemProps {
  id: string;
  title: string;
  // image: string;
  // sharer: string;
  // startDate: Date;
  // endDate: Date;
}

const SimpleItem: React.FC<ItemProps> = ({ id, title }) => {
  return (
    <div key={id}>
      {/* <img src={image} alt={title} /> */}
      <h2>{title}</h2>
      {/* <p>Shared by: {sharer}</p> */}
      {/* <p>Start Date: {startDate.toLocaleDateString()}</p>
      <p>End Date: {endDate.toLocaleDateString()}</p> */}
    </div>
  );
};

const Orders = (props) => {
  const { user } = props;
  const [requestedItems, setRequestedItems] = useState<Item[]>([]);
  const [catalogItems, setCatalogItems] = useState<Item[]>([]);

  useEffect(() => {
    console.log("User:", user);
    get("/api/requests").then((requests: Item[]) => {
      const userRequests = requests.filter((request) => request.requester_id === user._id);
      setRequestedItems([...userRequests].reverse());
      console.log("Requests:", requests);

      get("/api/catalog").then((catalog: Item[]) => {
        const foundItems = catalog.filter((catalogItem) => {
          console.log("catalog id", catalogItem.id);
          console.log(userRequests);
          return userRequests.some((requestedItem) => {
            console.log("requester", requestedItem.requester_id);
            return requestedItem.item_id === catalogItem.id; // Add return here
          });
        });
        setCatalogItems(foundItems);
      });
    });
  }, [user]);
  console.log(catalogItems);
  return (
    <div>
      {catalogItems.map((item, index) => (
        <SimpleItem
          id={item.id}
          title={item.title}
          // image={item.image}
        />
      ))}
    </div>
  );
};

export default Orders;
