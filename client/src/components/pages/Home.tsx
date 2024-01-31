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

  return (
    <div>
      <section className="header">
        <h1 className="animated-title">s h a r e d o m</h1>
        <p className="caption">borrow anything for free</p>
        <Link to="/catalog">
          <button className="start-browsing">Start Browsing</button>
        </Link>{" "}
        <ScrollLink to="how-it-works" smooth={true} duration={500} id="how-direct">
          <div className="caption">How it works</div>
          <div>
            <i className="fas fa-caret-down"></i>
          </div>
        </ScrollLink>
      </section>

      <section className="how-it-works">
        <h2 className = "instructions-title">Making borrowing items easy, convenient, and FREE through a cyclic point system</h2>
        <div>
          <div className="instructions-text">Browse or search for an item you need</div>
          <div className="instructions-step" id="browse"></div>
        </div>

        <div>
          <div className="instructions-text">
            Request an item - No money needed! <br />All new users are given points to use items.
          </div>
          <div className="instructions-step" id="making-request"></div>
        </div>{" "}

        <div>
          <div className="instructions-text">
            You can earn points by uploading items to share with others
          </div>
          <div className="instructions-step" id="activity"></div>
        </div>

        <div>
          <div className="instructions-text">
            GUESS WHAT: <br/>ANY sharing comes with points! In other words, you can get more points to work with even from borrowing and reviewing.
          </div>
          <div className="instructions-step" id="points"></div>
        </div>

        <div>
          <div className="instructions-text">For users: use and review</div>
          <div className="instructions-step" id="use-review"></div>
        </div>

        <div>
          <div className="instructions-text">For sharers: approve and review</div>
          <div className="instructions-step" id="approve-review"></div>
        </div>
        <div>
          <div className="instructions-text">
            Anyone can be a user, sharer, or both! <br />See your points and all activity in your profile.
          </div>
          <div className="instructions-step" id="profile-tabs"></div>
        </div>
        <div>
          <div className="instructions-text">See what others think of each user</div>
          <div className="instructions-step" id="view-review"></div>
        </div>
        <h2 className = "instructions-ending">Sign in now to get started with sharedom</h2>
      </section>
      {/* <section>
        <h2>
          See What Others are Sharing
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
      </section> */}
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
