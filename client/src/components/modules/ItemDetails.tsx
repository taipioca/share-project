import React, { useEffect, useState } from "react";
import { Link } from "@reach/router";
import { get } from "../../utilities";
import { NewRequest } from "./NewRequest";
import { ReviewList } from "./ReviewList";
import "./ItemDetails.css";
import Modal from "react-modal";

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
const ItemDetails = (props) => {
  const id = props.id;
  const [item, setItem] = useState<Item | null>(null);
  const [sharer, setSharer] = useState<User>();
  const [showReviews, setShowReviews] = useState(false);

  const [user, setUser] = useState<User>();
  const [isActive, setIsActive] = useState(false);
  const [sharerRating, setSharerRating] = useState(0.0);
  const [sharerNum, setSharerNum] = useState(0);

  useEffect(() => {
    setIsActive(true);
  }, []);

  const handleClick = () => {
    setIsActive(true);
  };

  const handleStarClick = () => {
    setShowReviews(!showReviews);
  };

  useEffect(() => {
    get("/api/catalog").then((itemsObjs) => {
      const foundItem = itemsObjs.find((item: Item) => item.id === id);
      setItem(foundItem);
      setSharer(foundItem.sharer);
    });
  }, [id]);
  useEffect(() => {
    if (props.userId) {
      get(`/api/user`, { userid: props.userId }).then((userObj) => setUser(userObj));
    }
  }, [props.userId]);
  if (!item) {
    return <div>No item found</div>;
  }

  const youGetPoints = Math.ceil(item.points * 0.2);
  if (sharer) {
    get(`/api/user`, { userid: item.sharer.sharer_id }).then((userObj) => {
      setSharerRating(userObj.rating);
      setSharerNum(userObj.numreviews);
    });
  }

  return (
    <div className={`item-container ${isActive ? "active" : ""}`} onClick={handleClick}>
      <div className="item-container">
        <div className="item-content">
          {" "}
          <Link to="/catalog" className="back-button-link">
            <button className="back-button">
              <i className="fas fa-arrow-left"></i>
            </button>
          </Link>
          <div className="item-left">
            <div className="item-image-container">
              <img src={item.image} alt={item.title} className="item-image" />
            </div>
            <div className="location-container">
              <div className="location-details">
                <h3>Pickup Details</h3>
                <p>
                  <i
                    className="fas fa-map-marker-alt"
                    style={{ marginLeft: "2px", marginRight: "6px", color: "var(--primary--dim)" }}
                  ></i>
                  {item.pickupLocation}
                </p>{" "}
                <p>
                  {" "}
                  <i
                    className="fas fa-info-circle"
                    style={{ marginRight: "5px", color: "var(--primary--dim)" }}
                  ></i>
                  {item.pickupNotes}
                </p>
              </div>
              <div className="location-details">
                <h3>Return Details</h3>
                <p>
                  <i
                    className="fas fa-map-marker-alt"
                    style={{ marginLeft: "2px", marginRight: "6px", color: "var(--primary--dim)" }}
                  ></i>
                  {item.returnLocation}
                </p>
                <p>
                  <i
                    className="fas fa-info-circle"
                    style={{ marginRight: "5px", color: "var(--primary--dim)" }}
                  ></i>
                  {item.returnNotes}
                </p>
              </div>
            </div>
          </div>
          <div className="item-details">
            <h2 id="item-title">{item.title ?? ""}</h2>
            <div className="uploader-rating" style={{ cursor: "pointer" }}>
              <p id="item-sharername" style={{ marginRight: "1%" }}>
                By{" "}
                <span style={{ color: "var(--primary)" }} onClick={handleStarClick}>
                  {item.sharer.sharer_name}
                </span>
              </p>

              <div className="details-rating" onClick={handleStarClick}>
                {sharer ? (
                  [...Array(5)].map((star, i) => {
                    const ratingValue = i + 1;
                    return (
                      <label key={i}>
                        <i
                          className={
                            sharerRating !== null && ratingValue <= Math.floor(sharerRating)
                              ? "fas fa-star star-filled"
                              : "far fa-star star-empty"
                          }
                          style={{ cursor: "pointer" }}
                        ></i>
                      </label>
                    );
                  })
                ) : (
                  <p>Loading...</p>
                )}
                <span>({sharerNum})</span>
              </div>

              {showReviews && (
                <Modal
                  isOpen={showReviews}
                  onRequestClose={handleStarClick}
                  shouldCloseOnOverlayClick={true}
                  className="review-modal"
                  style={{
                    overlay: {
                      backgroundColor: "transparent",
                    },
                  }}
                >
                  <div className="review-modal-content">
                    <span className="close" onClick={() => setShowReviews(false)}>
                      &times;
                    </span>
                    <h2>Reviews for {item.sharer.sharer_name}</h2>
                    <ReviewList userid={item.sharer.sharer_id} />
                  </div>
                </Modal>
              )}
            </div>
            <div className="rounded-box">
              <div className="points-container">
                <span className="details-points">{item.points ?? 0} Points</span>
                <span className="details-points-unit"> /day</span>{" "}
                <span className="details-rewards">
                  <div className="details-rewards">
                    <div>You get:</div>
                    <div>
                      <span className="points-color">{youGetPoints} Points</span> /day
                    </div>
                  </div>
                </span>
              </div>

              <p className="details-description">{item.description ?? ""}</p>

              <NewRequest
                item={item}
                requester={{ requester_id: props.userId, requester_name: user?.name ?? "" }}
                item_id={item.id}
                sharer={{ sharer_id: item.sharer.sharer_id, sharer_name: item.sharer.sharer_name }}
                title={item.title}
                status={item.status}
                points={item.points}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemDetails;
