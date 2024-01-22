import React, { useState } from "react";

import "./NewReview.css";
import { post } from "../../utilities";

const NewReviewInput = (props) => {
  const [value, setValue] = useState("");

  // called whenever the user types in the new post input box
  const handleChange = (event) => {
    setValue(event.target.value);
  };

  // called when the user hits "Submit" for a new post
  const handleSubmit = (event) => {
    event.preventDefault();
    props.onSubmit && props.onSubmit(value);
    setValue("");
  };

  return (
    <div className="u-flex">
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
  const addReview = (value) => {
    const body = { sharerId: props.sharerId, sharerName: props.sharerName, timestamp: props.timestamp, content: value };
    post("/api/newreview", body).then((comment) => {
      console.log(comment); //ADD NEW REVIEW FUNCTION
    });
  };

  return <NewReviewInput defaultText="New Comment" onSubmit={addReview} />;
};

export { NewReview };
