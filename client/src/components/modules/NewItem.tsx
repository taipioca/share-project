import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { v4 as uuidv4 } from "uuid";
import { post } from "../../utilities";
import { get } from "../../utilities";
import "./NewItem.css";

declare global {
  interface Window {
    cloudinary: any;
  }
}

const NewItemInput = ({ action, defaultValue, onSubmit }) => {
  const [item, setItem] = useState(defaultValue);
  const [isOpen, setIsOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  const actionTextMap = {
    add: "Upload a New Share",
    edit: "Edit a Share",
    delete: "Delete a Share",
  };
  const [widget, setWidget] = useState<null | { open: () => void }>(null);

  const handleChange = (event) => {
    setItem({
      ...item,
      [event.target.name]: event.target.value,
    });
  };
  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFile(event.target.files[0]);
    }
  };
  const handleSubmit = async (event) => {
    event.preventDefault();

    // Create a FormData object
    const formData = new FormData();

    // Add the file to the FormData object
    if (file) {
      formData.append("image", file);
    }

    // Add the other form fields to the FormData object
    for (const key in item) {
      formData.append(key, item[key]);
    }

    // Send the FormData object to the server
    const response = await fetch("/api/newproduct", {
      method: "POST",
      body: formData,
    });
    onSubmit && onSubmit(item);
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

  useEffect(() => {
    const widget = window.cloudinary.createUploadWidget(
      {
        cloudName: "dgph2xfcj",
        uploadPreset: "mhppaebs",
      },
      (error, result) => {
        if (!error && result && result.event === "success") {
          console.log("Done! Here is the image info: ", result.info);
          setItem((prevItem) => ({
            ...prevItem,
            image: result.info.url,
          }));
        }
      }
    );
    setWidget(widget);
  }, []);

  const openWidget = () => {
    if (widget) {
      widget.open();
    }
  };

  return (
    <>
      <button onClick={() => setIsOpen(true)}>{actionTextMap[action]}</button>
      {isOpen && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={() => setIsOpen(false)}>
              &times;
            </span>
            <form onSubmit={handleSubmit}>
              <h2>{actionTextMap[action]}</h2>
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
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    openWidget();
                  }}
                >
                  Upload Image
                </button>
                {item.image && (
                  <img src={item.image} alt="Uploaded" style={{ width: "100px", height: "auto" }} />
                )}
              </div>
              <button type="submit">Confirm and Submit</button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

const NewItem = (props) => {
  const initialItemState = {
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
    // status: {
    //   enum: "available",
    // },
  };

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
      window.location.reload();
    });
  };

  return (
    <>
      <NewItemInput action={"add"} defaultValue={initialItemState} onSubmit={addItem} />
    </>
  );
};

type Item = {
  id: string;
  image: string;
  title: string;
  description: string;
  points: number;
  minShareDays: string;
  maxShareDays: string;
  pickupLocation: string;
  returnLocation: string;
  pickupNotes: string;
  returnNotes: string;
  sharer: {
    sharer_id: String;
    sharer_name: String;
  };
};

const EditItem = ({ item_id }) => {
  const [foundItem, setFoundItem] = useState(null);

  useEffect(() => {
    get("/api/catalog").then((itemsObjs) => {
      const foundItem = itemsObjs.find((item: Item) => item.id === item_id);
      setFoundItem(foundItem);
    });
  }, []);

  const submitUpdate = (item) => {
    const body = { ...item, id: item_id };
    post("/api/updateproduct", body).then((productDetails) => {
      console.log("Returned editedItem:", productDetails);
      window.location.reload();
    });
  };

  return foundItem ? (
    <NewItemInput action={"edit"} defaultValue={foundItem} onSubmit={submitUpdate} />
  ) : null;
};
export { NewItem, EditItem };
