import React, { useState, useEffect } from "react";
import { get } from "../../utilities";

// type Item = {
//   id: string;
//   image: string;
//   title: string;
//   points: number;
//   requester: {
//     requester_id: string;
//     requester_name: string;
//   };

//   sharer: {
//     sharer_id: string;
//     sharer_name: string;
//   };
//   start_date: string;
//   end_date: string;
//   item_id: string;
// };

type Item = {
  requester: {
    requester_id: string;
    requester_name: string;
  };
  sharer: {
    sharer_id: string;
    sharer_name: string;
  };
  title: string;
  item_id: string;
  _id: string;
  start_date: string;
  end_date: string;
  sharer_points: number;
  requester_points: number;
  image?: string;
};

const Orders = (props) => {
  const { user } = props;
  const [pendingItems, setPendingItems] = useState<Item[]>([]); // items that are pending approval
  const [unavailableItems, setunavailableItems] = useState<Item[]>([]); // items that are unavailable/in use
  const [returnedItems, setreturnedItems] = useState<Item[]>([]); // items that are returned

  useEffect(() => {
    // console.log("inside Orders-Props:", props);
    // console.log("User:", user);

    get("/api/pendingproduct", { user_id: user._id }).then((pendings: Item[]) => {
      console.log("pendings:", pendings);
      setPendingItems(pendings);
    });

    get("/api/unavailableproduct", { user_id: user._id }).then((unavailables: Item[]) => {
      console.log("unavailables:", unavailables);
      setunavailableItems(unavailables);
    });

    get("/api/returnedproduct", { user_id: user._id }).then((returns: Item[]) => {
      console.log("returns:", returns);
      setreturnedItems(returns);
    });
  }, [user]);

  return (
    <>
      <div>
        <p style={{ fontSize: "2em", fontWeight: "bold" }}>Requests Pending for Approval</p>
        {pendingItems.map((item, index) => (
          <div key={index}>
            <img src={item.image} alt="ProductImange" style={{ width: "100px", height: "auto" }} />
            <p>Title: {item.title}</p>
            <p>Sharer: {item.sharer.sharer_name}</p>
            <p>Start Date: {item.start_date}</p>
            <p>End Date: {item.end_date}</p>
            <hr></hr>
          </div>
        ))}
      </div>
      <div>
        <p style={{ fontSize: "2em", fontWeight: "bold" }}>In Use</p>
        {unavailableItems.map((item, index) => (
          <div key={index}>
            <img src={item.image} alt="ProductImange" style={{ width: "100px", height: "auto" }} />
            <p>Title: {item.title}</p>
            <p>Sharer: {item.sharer.sharer_name}</p>
            <p>Start Date: {item.start_date}</p>
            <p>End Date: {item.end_date}</p>
            <hr></hr>
          </div>
        ))}
      </div>
      <div>
        <p style={{ fontSize: "2em", fontWeight: "bold" }}>Order History</p>
        {returnedItems.map((item, index) => (
          <div key={index}>
            <img src={item.image} alt="ProductImange" style={{ width: "100px", height: "auto" }} />
            <p>Title: {item.title}</p>
            <p>Sharer: {item.sharer.sharer_name}</p>
            <p>Start Date: {item.start_date}</p>
            <p>End Date: {item.end_date}</p>
            <hr></hr>
          </div>
        ))}
      </div>
    </>
  );
};

export default Orders;
