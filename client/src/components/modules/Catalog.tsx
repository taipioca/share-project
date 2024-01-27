import React, { useState, useEffect } from "react";
import { Link } from "@reach/router";
import "./Catalog.css";

import { post, get } from "../../utilities";

type Item = {
  id: string;
  image: string;
  title: string;
  points: number;
  rating: number;
  reviews: number;
};

const Catalog = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  // Load product items from MongoDB when component mounts
  useEffect(() => {
    document.title = "Catalog";
    get("/api/catalog").then((itemsObjs) => {
      let reversedItemsObjs = itemsObjs.reverse();
      setItems(reversedItemsObjs);
    });
  }, []);

  // Search items by keyword in title
  const handleSearch = () => {
    get("/api/catalog").then((itemsObjs: Item[]) => {
      const filteredItems = itemsObjs.filter((item) =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setItems(filteredItems);
    });
  };

  if (!Array.isArray(items)) {
    return <div className="catalog">No items to display</div>;
  }

  return (
    <>
      <div className="search-bar-container">
        <div className="search-input-container">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSearch();
              }
            }}
            placeholder="What are you looking for?"
          />
          <i className="fas fa-search search-icon"></i>
          {searchTerm && (
            <button
              onClick={() => {
                setSearchTerm("");
                handleSearch();
              }}
              className="clear-search"
            >
              Clear
            </button>
          )}
        </div>
      </div>
      <div className="catalog">
        {items.map((item) => (
          <Link to={`/item/${item.id}`} key={item.id} id={item.id} className="item">
            <div className="image-container">
              <img src={item.image} alt={item.title} />
            </div>
            <h4 className="item-text">{item.title}</h4>
            <div className="rating">
              {[...Array(5)].map((star, i) => {
                const ratingValue = i + 1;
                return (
                  <label key={i}>
                    <i className={ratingValue <= item.rating ? "fas fa-star" : "far fa-star"}></i>
                  </label>
                );
              })}
              <span>({item.reviews})</span> {/* Add this line */}
            </div>
            <h3 className="item-text">{item.points} Points/day</h3>
          </Link>
        ))}
      </div>
    </>
  );
};

export default Catalog;
