import React, { useEffect, useState } from "react";
import { Link } from "@reach/router";
import { RouteComponentProps } from "@reach/router";
import { get } from "../../utilities";
import { Link as ScrollLink } from "react-scroll";

import "./Home.css";

type HomeProps = RouteComponentProps;
type Item = {
  status: string;
  id: string;
  image: string;
  title: string;
  points: number;
  sharer: {
    sharer_id: string;
    sharer_name: string;
  };
};
const Home = (props: HomeProps) => {
  const [items, setItems] = useState<Item[]>([]);

  useEffect(() => {
    get("/api/catalog").then((allItems: Item[]) => {
      const availableItems = allItems.filter((item) => item.status === "available");
      const randomItems = getRandomItems(availableItems, 5);
      setItems(randomItems);
    });
  }, []);

  console.log(items);
  return (
    <div>
      <section className="header">
        <h1 className="animated-title">s h a r e d o m</h1>
        <p>borrow anything for FREE</p>
        <Link to="/catalog">
          <button>Start Browsing</button>
        </Link>{" "}
        <ScrollLink to="how-it-works" smooth={true} duration={500} id = "how-direct">
          How it works <i className="fas fa-arrow-down"></i>
        </ScrollLink>
      </section>

      <section id="how-it-works">
        <h2>How it works</h2>
        <ol>
          <li>Find something you need or share something of your own.</li>
          <li>Earn points to borrow even more!</li>
        </ol>
      </section>
      <section>
        <Link to="/login">
          <button>Sign In to Get Started</button>
        </Link>
      </section>
      <section>
        <h2>
          See What Others are Sharing{" "}
          <section className="item-container">
            {items.map((item, index) => (
              <Link to={`/item/${item.id}`} key={item.id} id={item.id} className="item">
                <div className="image-container">
                  <img src={item.image} alt={item.title} />
                </div>
                <h4 className="item-text">{item.title}</h4>
                <p className="item-text">Rating: 5/5 (1 review)</p>
                <h3 className="item-text">{item.points} Points/day</h3>
              </Link>
            ))}
          </section>
        </h2>
      </section>
    </div>
  );
};

function getRandomItems(items, count) {
  // Shuffle the array
  const shuffled = items.sort(() => 0.5 - Math.random());
  // Get sub-array of first n elements after shuffled
  return shuffled.slice(0, count);
}

export default Home;
