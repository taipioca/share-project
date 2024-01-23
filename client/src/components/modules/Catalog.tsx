import React, { useState, useEffect } from "react";
import { Link } from "@reach/router";
import "./Catalog.css";

import { post, get } from "../../utilities";

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

  if (!Array.isArray(items)) {
    return <div className="catalog">No items to display</div>;
  }

  return (
    <div className="catalog">
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
