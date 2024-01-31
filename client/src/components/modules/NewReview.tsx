import React, { useState, useEffect } from "react";

import "./NewReview.css";
import { post, get } from "../../utilities";

interface User {
  userid: string;
  rating: number;
  numreviews: number;
}

interface Review {
  _id: string;
  reviewer: {
    reviewer_id: string;
    reviewer_name: string;
  };
  sharer: {
    sharer_id: string;
    sharer_name: string;
  };
  rating: number;
  comment: string;
}

const updateUserRating = (userid, reviews) => {
  if (reviews.length > 0) {
    const averageRating = calculateAverageRating(reviews);
    const numberOfReviews = calculateNumberOfReviews(reviews);

    post("/api/user", { userid, rating: averageRating, numreviews: numberOfReviews }).catch(
      (error) => {
        console.error("Error updating user:", error);
      }
    );
  }
};

const calculateAverageRating = (reviews: Review[]) => {
  const totalRating = reviews.reduce((total, review) => total + review.rating, 0);
  const averageRating = totalRating / reviews.length;
  return Math.round(averageRating * 10) / 10;
};

const calculateNumberOfReviews = (reviews: Review[]) => {
  return reviews.length;
};
const NewReviewInput = (props) => {
  const [value, setValue] = useState("");
  const [rating, setRating] = useState(""); // new state for the rating

  const handleRatingChange = (event) => {
    setRating(event.target.value);
  };
  // called whenever the user types in the new post input box
  const handleChange = (event) => {
    setValue(event.target.value);
  };

  // called when the user hits "Submit" for a new post
  const handleSubmit = (event) => {
    event.preventDefault();
    props.onSubmit && props.onSubmit(value, rating);
    setValue("");
    setRating("");
  };

  return (
    <div className="review-container">
      <p className="review-prompt">Leave a review for 5 points!</p>
      <div className="rating-container">
        <p>Rate your experience:</p>
        <select value={rating} onChange={handleRatingChange}>
          <option value=""></option>
          <option value="1">1 - Poor</option>
          <option value="2">2 - Unsatisfied</option>
          <option value="3">3 - Neutral</option>
          <option value="4">4 - Good</option>
          <option value="5">5 - Excellent</option>
        </select>
      </div>
      <input
        type="text"
        placeholder={props.defaultText}
        value={value}
        onChange={handleChange}
        className="NewPostInput-input"
      />
      <button
        type="submit"
        className="NewPostInput-button u-pointer"
        value="Submit"
        onClick={handleSubmit}
      >
        Submit
      </button>
    </div>
  );
};

/**
 * New Comment is a New Post component for comments
 *
 * Proptypes
 * @param {string} defaultText is the placeholder text
 * @param {string} storyId to add comment to
 */
const NewReview = (props) => {
  const addReview = (value, rating) => {
    const body = {
      reviewer: {
        reviewer_id: props.reviewer_id,
        reviewer_name: props.reviewer_name,
      },
      sharer: {
        sharer_id: props.sharer_id,
        sharer_name: props.sharer_name,
      },
      rating: rating,
      comment: value,
    };
    post("/api/newreview", body).then((review) => {
      // 5 points for the reviewer for leaving a review
      get(`/api/user`, { userid: review.reviewer.reviewer_id }).then((userObj) => {
        const updatedObj = userObj;
        updatedObj.points += 5;
        post("/api/user", updatedObj);
      });

      get(`/api/user`, { userid: props.sharer_id }).then((userObj) => {
        get("/api/getreview").then((allReviews: Review[]) => {
          const userReviews = allReviews.filter((review) => {
            if (review.sharer && review.sharer.sharer_id) {
              return review.sharer.sharer_id === props.sharer_id;
            } else {
              console.log("No sharer_id found for review:", review);
              return false;
            }
          });

          if (userReviews.length > 0) {
            const averageRating = calculateAverageRating(userReviews);
            const numberOfReviews = calculateNumberOfReviews(userReviews);

            post("/api/user", {
              ...userObj,
              rating: averageRating,
              numreviews: numberOfReviews,
            });
          }
        });
      });
    });
  };
  return <NewReviewInput defaultText={`Your comment`} onSubmit={addReview} />;
};

export { NewReview };
