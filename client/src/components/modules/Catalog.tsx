import React, { useState } from "react";
import { Link } from "@reach/router";
import "./Catalog.css";
import NewItem from "./NewItem"

// Define a type for your items
type Item = {
  id: string;
  image: string;
  title: string;
  points: number;
};

const Catalog = () => {
  // Provide a type annotation for your state
  const [items, setItems] = useState<Item[]>([]);

  const handleNewItem = (item: Item) => {
    setItems((prevItems) => [...prevItems, item]);
  };

  if (!Array.isArray(items)) {
    return <div className="catalog">No items to display</div>;
  }

  return (
    <div className="catalog">
      <NewItem onNewItem={handleNewItem} />
      {items.map((item) => (
        <Link to={`/item/${item.id}`} key={item.id} className="item">
          <img src={item.image} alt={item.title} />
          <h2>{item.title}</h2>
          <p>Rating: 5/5 (1 review)</p>
          <p>{item.points} Points</p>
        </Link>
      ))}
    </div>
  );
};

export default Catalog;
