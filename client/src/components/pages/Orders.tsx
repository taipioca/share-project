import React, { useState, useEffect } from "react";
import { get } from "../../utilities";
import { NewReview } from "../modules/NewReview";
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
  // console.log("props(inside orders)", props);
  const { user } = props;
  const [pendingItems, setPendingItems] = useState<Item[]>([]); // items that are pending approval
  const [inuseItems, setInuseItems] = useState<Item[]>([]); // items that are in use
  const [orderHistoryItems, setOrderHistoryItems] = useState<Item[]>([]);
  // const [returnedItems, setReturnedItems] = useState<Item[]>([]); // items that are returned
  // const [unavailableItems, setUnavailableItems] = useState<Item[]>([]); // items that are unavailable

  useEffect(() => {
    // console.log("user:", user);
    get("/api/pendingproduct", { user_id: user._id }).then((pendings: Item[]) => {
      // console.log("pendings:", pendings);
      setPendingItems(pendings);
    });

    get("/api/inuseproduct", { user_id: user._id }).then((inuses: Item[]) => {
      // console.log("inuses:", inuses);
      setInuseItems(inuses);
    });

    get("/api/orderhistoryproduct", { user_id: user._id }).then((orders: Item[]) => {
      // console.log("orders:", orders);
      setOrderHistoryItems(orders);
    });

    // get("/api/unavailableproduct", { user_id: user._id }).then((unavailables: Item[]) => {
    //   console.log("unavailables:", unavailables);
    //   setUnavailableItems(unavailables);
    // });

    // get("/api/returnedproduct", { user_id: user._id }).then((returns: Item[]) => {
    //   console.log("returns:", returns);
    //   setReturnedItems(returns);
    // });
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
            <p>requester: {item.requester.requester_name}</p>
            <p>Start Date: {item.start_date}</p>
            <p>End Date: {item.end_date}</p>
            <hr></hr>
          </div>
        ))}
      </div>
      <div>
        <p style={{ fontSize: "2em", fontWeight: "bold" }}>In Use</p>
        {inuseItems.map((item, index) => (
          <div key={index}>
            <img src={item.image} alt="ProductImange" style={{ width: "100px", height: "auto" }} />
            <p>Title: {item.title}</p>
            <p>Sharer: {item.sharer.sharer_name}</p>
            <p>requester: {item.requester.requester_name}</p>
            <p>Start Date: {item.start_date}</p>
            <p>End Date: {item.end_date}</p>
            <hr></hr>
          </div>
        ))}
      </div>
      <div>
        <p style={{ fontSize: "2em", fontWeight: "bold" }}>Order History</p>
        {orderHistoryItems.map((item, index) => (
          <div key={index}>
            <img src={item.image} alt="ProductImange" style={{ width: "100px", height: "auto" }} />
            <p>Title: {item.title}</p>
            <p>Sharer: {item.sharer.sharer_name}</p>
            <p>requester: {item.requester.requester_name}</p>
            <p>Start Date: {item.start_date}</p>
            <p>End Date: {item.end_date}</p>
            <NewReview
              reviewer_name={item.requester.requester_name} //THERE IS A REALLY BAD NAMING ISSUE LOL SO IT'S ALL MIXED UP
              reviewer_id={item.requester.requester_id}
              sharer_id={item.sharer.sharer_id}
              sharer_name={item.sharer.sharer_name}
            />
            <hr></hr>
          </div>
        ))}
      </div>
    </>
  );
};

export default Orders;
