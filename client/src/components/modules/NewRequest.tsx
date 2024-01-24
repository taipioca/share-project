import React, { useState } from "react";
import { post } from "../../utilities";

const NewRequestInput = (props) => {
  const [request, setRequest] = useState({
    requester_id: props.requester_id, // replace with the actual ID of the requester
    item_id: props.item_id, // replace with the actual ID of the item
    sharer_id: props.sharer_id, // replace with the actual ID of the uploader
  });

//   const handleChange = (event) => {
//     setRequest({
//       ...request,
//       [event.target.name]: event.target.value,
//     });
//   };

  const handleSubmit = (event) => {
    event.preventDefault();

    props.onSubmit && props.onSubmit(request);
    setRequest({
      requester_id: props.requester_id, // replace with the actual ID of the requester
      item_id: props.item_id, // replace with the actual ID of the item
      sharer_id: props.sharer_id, // replace with the actual ID of the uploader
    });
  };
  return (
    <div className="u-flex">
      <button
        type="submit"
        className="NewRequestInput-button u-pointer"
        value="Submit"
        onClick={handleSubmit}
      >
        Request Item
      </button>
    </div>
  );
};

const NewRequest = (props) => {
  const addRequest = (request) => {
    const body = {
      requester_id: props.requester_id,
      item_id: props.item_id,
      sharer_id: props.sharer_id,
    };
    post("/api/newrequest", body).then((requestObj) => {
      console.log("request added");
    });
  };
  return <NewRequestInput onSubmit={addRequest} />;
};

export { NewRequest };
