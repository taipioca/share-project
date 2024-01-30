import React, { useState } from "react";

import "./NewReview.css";
import { post } from "../../utilities";

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
    <div className="u-flex">
      <p>select a rating for your experience</p>
      <select value={rating} onChange={handleRatingChange}>
        <option value=""></option>
        <option value="1">1 - Poor</option>
        <option value="2">2 - Unsatisfied</option>
        <option value="3">3 - Neutral</option>
        <option value="4">4 - Good</option>
        <option value="5">5 - Excellent</option>
      </select>
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
      console.log("review", review);
    });
  };

  return <NewReviewInput defaultText="Write a Review for _____" onSubmit={addReview} />;
};

export { NewReview };
