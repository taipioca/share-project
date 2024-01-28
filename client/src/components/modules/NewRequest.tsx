import React, { useState } from "react";
import { post } from "../../utilities";
import "./NewRequest.css";
const NewRequestInput = (props) => {
  console.log("inside new request input", props);
  const [request, setRequest] = useState({
    requester: {
      requester_id: "",
      requester_name: "",
    },
    sharer: {
      sharer_id: "",
      sharer_name: "",
    },
    title: "",
    item_id: "",
    sharer_id: "",
    start_date: "",
    end_date: "",
    sharer_points: 0,
    requester_points: 0,
  });

  const handleDateChange = (event) => {
    setRequest({
      ...request,
      [event.target.name]: event.target.value,
    });
  };
  const handleSubmit = (event) => {
    event.preventDefault();

    // Check if start_date and end_date are not empty
    if (!request.start_date || !request.end_date) {
      alert("Start date and end date are required.");
      return;
    }

    if (request.end_date < request.start_date) {
      alert("End date must be after start date.");
      return;
    }
    //   if (!request.requester.requester_id) {
    //   alert("You must be signed in to make a request.");
    //   return;
    // }
    // if (request.requester.requester_id === request.sharer.sharer_id) {
    //   alert("You cannot request your own item.");
    //   return;
    // }
    const currentDate = new Date();
    const startDate = new Date(request.start_date);
    const endDate = new Date(request.end_date);

    // const [startDate, setStartDate] = useState<string | null>(null);
    // const [endDate, setEndDate] = useState<string | null>(null);

    if (startDate < currentDate || endDate < currentDate) {
      alert("Start date and end date must be in the future.");
      return;
    }

    const totalPoints = calculateTotalPoints();
    const totalRewards = calculateTotalRewards();

    props.onSubmit && props.onSubmit(request, totalPoints, totalRewards);
    setRequest({
      requester: {
        requester_id: "",
        requester_name: "",
      },
      sharer: {
        sharer_id: "",
        sharer_name: "",
      },
      title: "",

      item_id: "",
      sharer_id: "",
      start_date: "",
      end_date: "",
      sharer_points: 0,
      requester_points: 0,
    });
  };
  const youGetPoints = Math.ceil(props.points * 0.2);

  const calculateTotalPoints = () => {
    if (request.start_date && request.end_date) {
      const start = new Date(request.start_date);
      const end = new Date(request.end_date);
      const diffTime = Math.abs(end.getTime() - start.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays * props.points;
    }
    return 0;
  };

  const calculateTotalRewards = () => {
    if (request.start_date && request.end_date) {
      const start = new Date(request.start_date);
      const end = new Date(request.end_date);
      const diffTime = Math.abs(end.getTime() - start.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays * youGetPoints;
    }
    return 0;
  };
  return (
    <form onSubmit={handleSubmit}>
      <div className="date-container">
        <label className="date-field">
          Start Date:
          <input
            type="date"
            name="start_date"
            value={request.start_date}
            onChange={handleDateChange}
            required
            className="date-input"
          />
        </label>
        <label className="date-field">
          End Date:
          <input
            type="date"
            name="end_date"
            value={request.end_date}
            onChange={handleDateChange}
            required
            className="date-input"
          />
        </label>
      </div>
      <button type="submit" className="NewRequestInput-button u-pointer" value="Submit">
        Request Item
      </button>
      <hr />
    </form>
  );
};

const NewRequest = (props) => {
  console.log("inside new request", props);
  const addRequest = (request, totalPoints, totalRewards) => {
    const body = {
      ...request,
      requester_id: props.requester.requester_id,
      requester_name: props.requester.requester_name,
      item_id: props.item_id,
      sharer_id: props.sharer.sharer_id,
      sharer_name: props.sharer.sharer_name,
      title: props.title,
      sharer_points: totalPoints, // Use calculated totalPoints
      requester_points: totalRewards,
    };
    post("/api/newrequest", body).then((requestObj) => {
      console.log("total points", totalPoints);
      console.log("request added", requestObj);
    });
  };
  return (
    <div>
      <NewRequestInput
        onSubmit={(request, totalPoints, totalRewards) =>
          addRequest(request, totalPoints, totalRewards)
        }
        requester_id={props.requester.requester_id}
        requester_name={props.requester.requester_name}
        item_id={props.item_id}
        sharer_points={props.sharer_points}
        requester_points={props.requester_points}
      />
      <p>Total Points:</p>
      <p>{props.sharer_points}</p>
    </div>
  );
};

export { NewRequest };
