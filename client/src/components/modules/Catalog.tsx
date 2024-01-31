import React, { useState, useEffect } from "react";
import { Link } from "@reach/router";
import "./Catalog.css";

import { post, get } from "../../utilities";

interface User {
  name: string;
  userid: string;
  points: number;
  rating: number;
  numreviews: number;
}

type Item = {
  id: string;
  image: string;
  title: string;
  description: string;
  points: number;
  minShareDays: string;
  maxShareDays: string;
  pickupLocation: string;
  returnLocation: string;
  pickupNotes: string;
  returnNotes: string;
  sharer: {
    sharer_id: string;
    sharer_name: string;
  };
  status: string;
  reviews: number;
};

const Catalog = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const phrases = [
    "sleeping bag",
    "basketball",
    "scooter",
    "camera",
    "power strip",
    "vacuum",
    "party dress",
    "usb drive",
    "bike",
    "hair straightener",
  ];
  const [currentPhrase, setCurrentPhrase] = useState("");
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  useEffect(() => {
    const typingSpeed = 750; // 0.75 seconds per letter
    const deletingSpeed = 750; // 0.75 seconds per letter
    const currentSpeed = isDeleting ? deletingSpeed : typingSpeed;

    // If we've finished typing or deleting a phrase, switch to the other operation
    if (!isDeleting && charIndex === phrases[phraseIndex].length) {
      setTimeout(() => setIsDeleting(true), 3000); // Pause for 4 seconds before start deleting
    } else if (isDeleting && charIndex === 0) {
      setIsDeleting(false);
      setPhraseIndex((prevIndex) => (prevIndex + 1) % phrases.length); // Go to next phrase
    }

    // If we're not waiting to switch operations, proceed with typing or deleting
    if (!isDeleting && charIndex < phrases[phraseIndex].length) {
      setCurrentPhrase((prevPhrase) => prevPhrase + phrases[phraseIndex].charAt(charIndex));
      setCharIndex((prevIndex) => prevIndex + 1);
    } else if (isDeleting && charIndex > 0) {
      setCurrentPhrase((prevPhrase) => prevPhrase.slice(0, -1));
      setCharIndex((prevIndex) => prevIndex - 1);
    }

    const timeoutId = setTimeout(() => {}, currentSpeed);

    return () => clearTimeout(timeoutId); // Clean up the timeout on unmount
  }, [currentPhrase, isDeleting]);

  // Load product items from MongoDB when component mounts
  type ItemWithSharerDetails = Item & { sharerRating?: number; sharerNum?: number };

  useEffect(() => {
    document.title = "Catalog";
    get("/api/catalog").then((itemsObjs: Item[]) => {
      let reversedItemsObjs = itemsObjs.reverse();

      // Fetch sharer details for each item
      const itemsWithSharerDetails = reversedItemsObjs.map(async (item) => {
        if (item.sharer && item.sharer.sharer_id) {
          const userObj = await get(`/api/user`, { userid: item.sharer.sharer_id });
          return {
            ...item,
            sharerRating: userObj.rating,
            sharerNum: userObj.numreviews,
          } as ItemWithSharerDetails;
        } else {
          return item;
        }
      });

      Promise.all(itemsWithSharerDetails).then((items) => {
        setItems(items as ItemWithSharerDetails[]);
      });
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
      {/* <div className="page-background"></div> */}
      <div className="cat-header-search-container">
        <div>
          <h1 className="cat-animated-header search-text">
            <span>I need a </span>
            <span style={{ color: "var(--third)" }}>{currentPhrase}</span>
          </h1>
        </div>
        <div className="cat-search-bar-container">
          <div className="cat-search-input-container">
            <input
              className="cat-search-input"
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSearch();
                }
              }}
              placeholder="search..."
            />
            <i className="fas fa-search search-icon"></i>
            {/* {searchTerm && (
              <button
                onClick={() => {
                  setSearchTerm("");
                  handleSearch();
                }}
                className="clear-search"
              >
                Clear
              </button>
            )} */}
          </div>
        </div>
      </div>{" "}
      {/* This is the closing tag for the header-search-container div */}
      <div className="catalog">
        {items.map((item: ItemWithSharerDetails) => (
          <Link to={`/item/${item.id}`} key={item.id} id={item.id} className="item">
            <div className="image-container">
              <img src={item.image} alt={item.title} />
            </div>
            <h4 className="item-text">{item.title}</h4>
            <div className="cat-rating">
              {[...Array(5)].map((star, i) => {
                const ratingValue = i + 1;
                return (
                  <label key={i}>
                    <i
                      className={
                        ratingValue <= (item.sharerRating || 0)
                          ? "fas fa-star star-filled"
                          : "far fa-star star-empty"
                      }
                    ></i>
                  </label>
                );
              })}
              <span>({item.sharerNum || 0})</span>
            </div>
            <h3 className="item-text">{item.points} Points/day</h3>
          </Link>
        ))}
      </div>
    </>
  );
};
export default Catalog;
