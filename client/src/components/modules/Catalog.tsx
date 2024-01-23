import React, { useState, useEffect } from "react";
import { Link } from "@reach/router";
import "./Catalog.css";
import NewItem from "./NewItem";
import { v4 as uuidv4 } from "uuid";
import { post, get } from "../../utilities";
import { set } from "mongoose";

// Define a type for your items
type Item = {
  id: string;
  image: string;
  title: string;
  points: number;
};

const Catalog = () => {
  const [items, setItems] = useState<Item[]>([]);

  // Load product items from MongoDB when component mounts
  useEffect(() => {
    document.title = "Catalog";
    get("/api/catalog").then((itemsObjs) => {
      let reversedItemsObjs = itemsObjs.reverse();
      setItems(reversedItemsObjs);
    });
  }, []);

  // Save items to MongoDB when submit
  const handleNewItem = (item: Item) => {
    setItems((prevItems) => {
      const addedItem = {
        ...item,
        id: uuidv4(),
        sharer: {
          sharer_id: "456",
          name: "Test Sharer",
        },
      };
      const newItems = [...prevItems, addedItem];
      post("/api/newproduct", addedItem).then((productDetails: any) => {
        console.log("Returned addedItem:", productDetails);
      });
      return newItems;
    });
  };

  if (!Array.isArray(items)) {
    return <div className="catalog">No items to display</div>;
  }

  return (
    <div className="catalog">
      <NewItem onNewItem={handleNewItem} />
      {items.map((item) => (
        <Link to={`/item/${item.id}`} key={item.id} id={item.id} className="item">
          <div className="image-container">
            <img src={item.image} alt={item.title} />
          </div>
          <h4 className="item-text">{item.title}</h4>
          <p className="item-text">Rating: 5/5 (1 review)</p>
          <h3 className="item-text">{item.points} Points/day</h3>
        </Link>
      ))}
    </div>
  );
};

export default Catalog;
