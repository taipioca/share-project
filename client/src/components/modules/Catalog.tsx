import React, { useState, useEffect } from "react";
import { Link } from "@reach/router";
import "./Catalog.css";
import { v4 as uuidv4 } from "uuid";

// Define a type for your items
type Item = {
  id: string;
  image: string;
  title: string;
  points: number;
};

const Catalog = () => {
  const [items, setItems] = useState<Item[]>([]);

  // Load items from localStorage when component mounts
  useEffect(() => {
    const savedItems = localStorage.getItem("items");
    if (savedItems) {
      setItems(JSON.parse(savedItems));
    }
  }, []);

  // Save items to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("items", JSON.stringify(items));
  }, [items]);

  if (!Array.isArray(items)) {
    return <div className="catalog">No items to display</div>;
  }

  return (
    <div className="catalog">
      {items.map((item) => (
        <Link to={`/item/${item.id}`} id={item.id} className="item">
          <div className="image-container">
            <img src={item.image} alt={item.title} />
          </div>{" "}
          <h4>{item.title}</h4>
          <p>Rating: 5/5 (1 review)</p>
          <h3>{item.points} Points/day</h3>
        </Link>
      ))}
      <button onClick={() => localStorage.clear()}>Clear Local Storage</button>
    </div>
  );
};

export default Catalog;
