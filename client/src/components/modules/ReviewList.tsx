import React, { useEffect, useState } from "react";
import { post, get } from "../../utilities";
import "./ReviewList.css";

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

const displayUserReviews = (reviews: Review[]) => {
  return reviews.map((review) => (
    <div key={review._id} className="review">
      <div className="review-rating">
        {[...Array(5)].map((star, i) => {
          const ratingValue = i + 1;
          return (
            <i
              key={i}
              className={
                ratingValue <= review.rating ? "fas fa-star star-filled" : "far fa-star star-empty"
              }
              style={{ fontSize: "16px" }}
            ></i>
          );
        })}
        <span>Rating: {review.rating}/5</span>
        <span className="reviewer-name">Posted by {review.reviewer.reviewer_name}</span>
      </div>
      <p className="review-comment">"{review.comment}"</p>
      <hr className="divide-line-review" />
    </div>
  ));
};

const calculateAverageRating = (reviews: Review[]) => {
  const totalRating = reviews.reduce((total, review) => total + review.rating, 0);
  const averageRating = totalRating / reviews.length;
  return Math.round(averageRating * 10) / 10;
};

const calculateNumberOfReviews = (reviews: Review[]) => {
  return reviews.length;
};

const ReviewList = ({ userid }) => {
  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
    get("/api/getreview").then((allReviews: Review[]) => {
      const userReviews = allReviews.filter((review) => {
        if (review.sharer && review.sharer.sharer_id) {
          return review.sharer.sharer_id === userid;
        } else {
          console.log("No sharer_id found for review:", review);
          return false;
        }
      });
      setReviews(userReviews);
    });
  }, [userid]);

  // Replace 'userid' with the actual user id
  const userReviews = displayUserReviews(reviews);
  const averageRating = calculateAverageRating(reviews);
  const numberOfReviews = calculateNumberOfReviews(reviews);

  return (
    <div>
      <p className="average-rating">Overall: {averageRating}/5</p>
      <div className="rev-rating">
        {[...Array(5)].map((star, i) => {
          const ratingValue = i + 1;
          return (
            <label key={i}>
              <i
                className={
                  ratingValue <= (averageRating || 0)
                    ? "fas fa-star star-filled"
                    : "far fa-star star-empty"
                }
              ></i>
            </label>
          );
        })}
      </div>
      <p className="number-of-reviews">{numberOfReviews} review(s)</p>
      <hr className="divide-line" />
      {userReviews}
    </div>
  );
};

export { ReviewList };
