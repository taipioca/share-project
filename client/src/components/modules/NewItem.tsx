import React, { useState, ChangeEvent, FormEvent } from "react";
import "./NewItem.css";

interface Item {
  id: string;
  title: string;
  description: string;
  points: number;
  minShareDays: string;
  maxShareDays: string;
  pickupLocation: string;
  returnLocation: string;
  pickupNotes: string;
  returnNotes: string;
  image: string;
}

interface NewItemProps {
  onNewItem: (item: Item) => void;
}

const NewItem = ({ onNewItem }: NewItemProps) => {
  const [item, setItem] = useState<Item>({
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
  });

  const [isOpen, setIsOpen] = useState(false);

  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setItem({
      ...item,
      [event.target.name]: event.target.value,
    });
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setItem({
          ...item,
          image: reader.result as string,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    onNewItem(item);
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
    });
    setIsOpen(false);
  };

  // ...

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
                  Upload a photo of your item
                  <input type="file" accept="image/*" onChange={handleImageChange} required />
                </label>
              </div>

              {item.image && <img src={item.image} alt="Preview" />}
              <button type="submit">Add Item</button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default NewItem;
