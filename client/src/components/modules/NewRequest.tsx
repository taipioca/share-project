import React, { useState } from "react";
import { post } from "../../utilities";

const NewRequestInput = (props) => {
  const [request, setRequest] = useState({
    requester: {
      requester_id: "",
      requester_name: "",
    },
    sharer: {
      sharer_id: "",
      sharer_name: "",
    },
    item_id: "",
    sharer_id: "",
    start_date: "",
    end_date: "",
  });
  console.log(props.requester_id);
  console.log(props.item_id);
  //   const handleChange = (event) => {
  //     setRequest({
  //       ...request,
  //       [event.target.name]: event.target.value,
  //     });
  //   };
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

    props.onSubmit && props.onSubmit(request);
    setRequest({
      requester: {
        requester_id: "",
        requester_name: "",
      },
      sharer: {
        sharer_id: "",
        sharer_name: "",
      },
      item_id: "",
      sharer_id: "",
      start_date: "",
      end_date: "",
    });
  };
  return (
    <form onSubmit={handleSubmit}>
      <label>
        Start Date:
        <input
          type="date"
          name="start_date"
          value={request.start_date}
          onChange={handleDateChange}
          required
        />
      </label>
      <label>
        End Date:
        <input
          type="date"
          name="end_date"
          value={request.end_date}
          onChange={handleDateChange}
          required
        />
      </label>
      <button type="submit" className="NewRequestInput-button u-pointer" value="Submit">
        Request Item
      </button>
    </form>
  );
};

const NewRequest = (props) => {
  const addRequest = (request) => {
    const body = {
      ...request,
      requester_id: props.requester.requester_id,
      requester_name: props.requester.requester_name,
      item_id: props.item_id,
      sharer_id: props.sharer.sharer_id,
      sharer_name: props.sharer.sharer_name,
    };
    post("/api/newrequest", body).then((requestObj) => {
      console.log("request added", requestObj);
    });
  };
  return (
    <NewRequestInput
      onSubmit={addRequest}
      requester_id={props.requester.requester_id}
      requester_name={props.requester.requester_name}
      item_id={props.item_id}
    />
  );
};

export { NewRequest };
