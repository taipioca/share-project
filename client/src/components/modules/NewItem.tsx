import React, { useState } from "react";

const NewItem = ({ onNewItem }) => {
  const [item, setItem] = useState({
    title: "",
    description: "",
    points: "",
    minShareDays: "",
    maxShareDays: "",
    pickupLocation: "",
    returnLocation: "",
    pickupNotes: "",
    returnNotes: "",
    image: "",
  });

  const handleChange = (e) => {
    setItem({
      ...item,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onNewItem(item);
    setItem({
      title: "",
      description: "",
      points: "",
      minShareDays: "",
      maxShareDays: "",
      pickupLocation: "",
      returnLocation: "",
      pickupNotes: "",
      returnNotes: "",
      image: "",
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Upload a new share</h2>
      <label>
        Title:
        <input type="text" name="title" value={item.title} onChange={handleChange} />
      </label>
      <label>
        Description:
        <textarea name="description" value={item.description} onChange={handleChange} />
      </label>
      <label>
        Price (points/day):
        <input type="number" name="points" value={item.points} onChange={handleChange} />
      </label>
      <label>
        Minimum Share Days:
        <input
          type="number"
          name="minShareDays"
          value={item.minShareDays}
          onChange={handleChange}
        />
      </label>
      <label>
        Maximum Share Days:
        <input
          type="number"
          name="maxShareDays"
          value={item.maxShareDays}
          onChange={handleChange}
        />
      </label>
      <label>
        Pickup Location:
        <input
          type="text"
          name="pickupLocation"
          value={item.pickupLocation}
          onChange={handleChange}
        />
      </label>{" "}
      <label>
        Pickup Notes:
        <textarea name="pickupNotes" value={item.pickupNotes} onChange={handleChange} />
      </label>
      <label>
        Return Location:
        <input
          type="text"
          name="returnLocation"
          value={item.returnLocation}
          onChange={handleChange}
        />
      </label>{" "}
      <label>
        Return Notes:
        <textarea name="returnNotes" value={item.returnNotes} onChange={handleChange} />
      </label>
      <label>
        Upload an image of your item:
        <input type="file" name="image" accept="image/*" onChange={handleChange} />
      </label>
      <button type="submit">Submit</button>
    </form>
  );
};

export default NewItem;
