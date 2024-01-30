import React, { useEffect, useState } from "react";
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

const displayUserReviews = (reviews: Review[]) => {
  return reviews.map((review) => (
    <div key={review._id}>
      <p>Rating: {review.rating}</p>
      <p>Comment: {review.comment}</p>
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

const updateUserRating = (userid: string, averageRating: number, numberOfReviews: number) => {
  post("/api/updateuser", { userid, rating: averageRating, numreviews: numberOfReviews }).catch(
    (error) => {
      console.error("Error updating user:", error);
    }
  );
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

      const averageRating = calculateAverageRating(userReviews);
      const numberOfReviews = calculateNumberOfReviews(userReviews);

      updateUserRating(userid, averageRating, numberOfReviews);
    });
  }, [userid]);

  // Replace 'userid' with the actual user id
  const userReviews = displayUserReviews(reviews);
  const averageRating = calculateAverageRating(reviews);
  const numberOfReviews = calculateNumberOfReviews(reviews);

  return (
    <div>
      <p>Average Rating: {averageRating}</p>
      {userReviews}
    </div>
  );
};

export { ReviewList };
