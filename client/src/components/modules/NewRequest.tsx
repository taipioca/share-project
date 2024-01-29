import React, { useEffect, useState } from "react";
import { post, get } from "../../utilities";
import "./NewRequest.css";
import { Link } from "@reach/router";
const NewRequestInput = (props) => {
  console.log("inside new request input", props);
  const [request, setRequest] = useState({
    requester: {
      requester_id: props.requester_id,
      requester_name: props.requester_name,
    },
    sharer: {
      sharer_id: props.sharer.sharer_id,
      sharer_name: props.sharer.sharer_name,
    },
    title: "",
    item_id: "",
    sharer_id: "",
    start_date: "",
    end_date: "",
    sharer_points: 0,
    requester_points: 0,
    status: props.status,
  });
  const [requestSent, setRequestSent] = useState(false);

  // If request is pending, set requestSent to true
  useEffect(() => {
    if (request.status === "pending") {
      setRequestSent(true);
    }
  }, []);

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

    // Check if requester is signed in
    if (!props.requester_id) {
      alert("You must be signed in to make a request.");
      return;
    }

    // Check if requester is sharer
    if (props.requester_id === request.sharer.sharer_id) {
      alert("You cannot request your own item.");
      return;
    }

    // Check if start_date is before end_date and both are in the future
    const currentDate = new Date();
    const startDate = new Date(request.start_date);
    const endDate = new Date(request.end_date);
    if (startDate < currentDate || endDate < currentDate) {
      alert("Start date and end date must be in the future.");
      return;
    }
    if (startDate > endDate) {
      alert("Start date must be before end date.");
      return;
    }

    props.onSubmit && props.onSubmit(request);
    // setRequest({
    //   requester: {
    //     requester_id: "",
    //     requester_name: "",
    //   },
    //   sharer: {
    //     sharer_id: "",
    //     sharer_name: "",
    //   },
    //   title: "",

    //   item_id: "",
    //   sharer_id: "",
    //   start_date: "",
    //   end_date: "",
    //   sharer_points: 0,
    //   requester_points: 0,
    //   status: "",
    // });
    setRequestSent(true);
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
          Start Date
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
          End Date
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
      {requestSent ? (
        <p className="request-sent">
          Request Sent! Check your{" "}
          <Link to="/profile/${props.requester.requester_id}">profile</Link> for pending approvals.
        </p>
      ) : (
        <button type="submit" className="NewRequestInput-button u-pointer" value="Submit">
          Send Request
        </button>
      )}
      <hr
        style={{
          marginTop: "5%",
          borderWidth: "2px",
          borderRadius: "5px",
          borderStyle: "solid",
          borderColor: "#DDD8D8",
        }}
      />
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
      get("/api/getproduct", { item: requestObj.item_id }).then((foundItem) => {
        const updateBody = { ...foundItem, status: "pending" };
        post("/api/updateproduct", updateBody).then((productDetails) => {
          // console.log("Returned updateProduct:", productDetails);
        });
      });
    });
  };
  return (
    <NewRequestInput
      onSubmit={addRequest}
      requester_id={props.requester.requester_id}
      requester_name={props.requester.requester_name}
      item_id={props.item_id}
      sharer={{ sharer_id: props.sharer.sharer_id, sharer_name: props.sharer.sharer_name }}
      status={props.status}
    />
  );
};

export { NewRequest };
