import React, { useState, useEffect } from "react";
import { get } from "../../utilities";



type Item = {
  id: string;
  image: string;
  title: string;
  points: number;
  requester: {
    requester_id: string;
    requester_name: string;
  };

  sharer: {
    sharer_id: string;
    sharer_name: string;
  };
  start_date: string;
  end_date: string;
  item_id: string;
};

const Orders = (props) => {
  const { user } = props;
  const [requestedItems, setRequestedItems] = useState<Item[]>([]);
  const [catalogItems, setCatalogItems] = useState<Item[]>([]);

  useEffect(() => {
    // console.log("User:", user);
    get("/api/requests").then((requests: Item[]) => {
      const userRequests = requests.filter((request) => {
        if (!request.requester) {
          console.error("requester is undefined");
          return false;
        }

        return request.requester.requester_id === user._id;
      });
      setRequestedItems([...userRequests].reverse());
      // console.log("Requests:", requests);

      get("/api/catalog").then((catalog: Item[]) => {
        const foundItems = catalog.filter((catalogItem) => {
          // console.log("catalog id", catalogItem.id);
          // console.log(userRequests);
          return userRequests.some((requestedItem) => {
            // console.log("requester", requestedItem.requester.requester_id);
            return requestedItem.item_id === catalogItem.id;
          });
        });
        setCatalogItems(foundItems);
      });
    });
  }, [user]);
  // console.log("requesterd items", catalogItems);
  return (
    <div>
      {catalogItems.map((item, index) => (

        <div>
          <p>{item.title}</p>
          <p>{item.sharer.sharer_name}</p>
          <p>{item.start_date}</p>
          <p>{item.end_date}</p>
          <hr></hr>
        </div>
      ))}
    </div>
  );
};

export default Orders;
