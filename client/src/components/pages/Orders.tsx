import React, { useState, useEffect } from "react";
import { get } from "../../utilities";
import { NewReview } from "../modules/NewReview";
import "./Orders.css";
import { format } from "date-fns";
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
      <div className="orders-container">
        <div>
          <p className="orders-category">Requests Pending for Approval</p>
          {pendingItems.length > 0 ? (
            pendingItems.map((item, index) => (
              <div key={index} className="orders-item-details">
                <img src={item.image} alt="ProductImange" className="orders-product-image" />
                <p className="orders-item-title">{item.title}</p>
                <p>
                  Shared by:{" "}
                  <span style={{ color: "var(--primary)" }}>{item.sharer.sharer_name}</span>
                </p>
                <p>
                  From{" "}
                  <span className="orders-item-date">
                    {format(new Date(item.start_date), "MMMM d, yyyy")}
                  </span>{" "}
                  to{" "}
                  <span className="orders-item-date">
                    {format(new Date(item.end_date), "MMMM d, yyyy")}
                  </span>
                </p>
                {/* <hr className="order-divide-line" /> */}
              </div>
            ))
          ) : (
            <p>No items.</p>
          )}
        </div>
        <div>
          <p className="orders-category">In Use</p>
          {inuseItems.length > 0 ? (
            inuseItems.map((item, index) => (
              <div key={index} className="orders-item-details">
                <img src={item.image} alt="ProductImange" className="orders-product-image" />
                <p className="orders-item-title">{item.title}</p>
                <p>
                  Shared by:{" "}
                  <span style={{ color: "var(--primary)" }}>{item.sharer.sharer_name}</span>
                </p>
                <p>
                  From{" "}
                  <span className="orders-item-date">
                    {format(new Date(item.start_date), "MMMM d, yyyy")}
                  </span>{" "}
                  to{" "}
                  <span className="orders-item-date">
                    {format(new Date(item.end_date), "MMMM d, yyyy")}
                  </span>
                </p>

                <NewReview
                  reviewer_name={item.requester.requester_name}
                  reviewer_id={item.requester.requester_id}
                  sharer_id={item.sharer.sharer_id}
                  sharer_name={item.sharer.sharer_name}
                />
              </div>
            ))
          ) : (
            <p>No items.</p>
          )}
        </div>
        <div>
          <p className="orders-category">Order History</p>
          
          {orderHistoryItems.length > 0 ? (
            orderHistoryItems.map((item, index) => (
              <div key={index} className="orders-item-details">
                <img src={item.image} alt="ProductImange" className="orders-product-image" />
                <p className="orders-item-title">{item.title}</p>
                <p>
                  Shared by:{" "}
                  <span style={{ color: "var(--primary)" }}>{item.sharer.sharer_name}</span>
                </p>
                <p>
                  From{" "}
                  <span className="orders-item-date">
                    {format(new Date(item.start_date), "MMMM d, yyyy")}
                  </span>{" "}
                  to{" "}
                  <span className="orders-item-date">
                    {format(new Date(item.end_date), "MMMM d, yyyy")}
                  </span>
                </p>
                <NewReview
                  reviewer_name={item.requester.requester_name}
                  reviewer_id={item.requester.requester_id}
                  sharer_id={item.sharer.sharer_id}
                  sharer_name={item.sharer.sharer_name}
                />
              </div>
            ))
          ) : (
            <p>No items.</p>
          )}
        </div>
      </div>
    </>
  );
};

export default Orders;
