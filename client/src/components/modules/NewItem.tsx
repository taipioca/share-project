import React, { useState, ChangeEvent, FormEvent } from "react";
import { v4 as uuidv4 } from "uuid";
import { post } from "../../utilities";
import "./NewItem.css";


const NewItemInput = (props) => {
  const [item, setItem] = useState({
    id: "",
    title: "",
    description: "",
    points: 0,
    minShareDays: "",
    maxShareDays: "",
    pickupLocation: "",
    returnLocation: "",
    pickupNotes: "",
    returnNotes: "",
    image: "",
    // sharer: {
    //   sharer_id: "",
    //   sharer_name: "",
    // },
  });

  const [isOpen, setIsOpen] = useState(false);

  const handleChange = (event) => {
    setItem({
      ...item,
      [event.target.name]: event.target.value,
    });
  };


  const handleSubmit = (event) => {
    event.preventDefault();

    props.onSubmit && props.onSubmit(item);
    setItem({
      id: "",
      title: "",
      description: "",
      points: 0,
      minShareDays: "",
      maxShareDays: "",
      pickupLocation: "",
      returnLocation: "",
      pickupNotes: "",
      returnNotes: "",
      image: "",
      // sharer: {
      //   sharer_id: "",
      //   sharer_name: "",
      // },
    });
    setIsOpen(false);
  };
    return (
      <>
        <button onClick={() => setIsOpen(true)}>Upload New Share</button>
        {isOpen && (
          <div className="modal">
            <div className="modal-content">
              <span className="close" onClick={() => setIsOpen(false)}>
                &times;
              </span>
              <form onSubmit={handleSubmit}>
                <h2>Upload a New Share</h2>
                <div className="form-row full-width">
                  <label>
                    Item Title:
                    <input
                      type="text"
                      name="title"
                      value={item.title}
                      onChange={handleChange}
                      required
                    />
                  </label>
                </div>
                <div className="form-row full-width">
                  <label>
                    Item Description:
                    <textarea
                      name="description"
                      value={item.description}
                      onChange={handleChange}
                      required
                    />
                  </label>
                </div>
                <div className="form-row third-width">
                  <label>
                    Price (points/day):
                    <input
                      type="number"
                      name="points"
                      value={item.points}
                      onChange={handleChange}
                      required
                    />
                  </label>{" "}
                  <label>
                    Minimum Share Days:
                    <input
                      type="number"
                      name="minShareDays"
                      value={item.minShareDays}
                      onChange={handleChange}
                      required
                    />
                  </label>
                  <label>
                    Maximum Share Days:
                    <input
                      type="number"
                      name="maxShareDays"
                      value={item.maxShareDays}
                      onChange={handleChange}
                      required
                    />
                  </label>{" "}
                </div>
                <div className="form-row half-width">
                  <label>
                    Pickup Location:
                    <input
                      type="text"
                      name="pickupLocation"
                      value={item.pickupLocation}
                      onChange={handleChange}
                      required
                    />
                  </label>{" "}
                  <label>
                    Return Location:
                    <input
                      type="text"
                      name="returnLocation"
                      value={item.returnLocation}
                      onChange={handleChange}
                      required
                    />
                  </label>{" "}
                </div>
                <div className="form-row half-width">
                  <label>
                    Pickup Notes:
                    <textarea
                      name="pickupNotes"
                      value={item.pickupNotes}
                      onChange={handleChange}
                      required
                    />
                  </label>
                  <label>
                    Return Notes:
                    <textarea
                      name="returnNotes"
                      value={item.returnNotes}
                      onChange={handleChange}
                      required
                    />
                  </label>{" "}
                </div>

                <div className="form-row">
                  <label>
                    The Url for a photo of your item
                    <textarea name="image" value={item.image} onChange={handleChange} required />
                  </label>
                  {/* <label>
                  Upload a photo of your item
                  <input type="file" accept="image/*" onChange={handleImageChange} required />
                </label> */}
                </div>

                {/* {item.image && <img src={item.image} alt="Preview" />} */}
                <button type="submit">Add Item</button>
              </form>
            </div>
          </div>
        )}
      </>
    );
  };


const NewItem = (props) => {
  const addItem = (item) => {
    const body = {
      ...item,
      id: uuidv4(),

      sharer: {
        sharer_id: props.sharer_id,
        sharer_name: props.sharer_name,
      },
    };
    post("/api/newproduct", body).then((productDetails) => {
      console.log("Returned addedItem:", productDetails);
    });
  };

  return <NewItemInput onSubmit={addItem} />;
};
export { NewItem };
