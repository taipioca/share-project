import React, { useState, ChangeEvent, FormEvent } from "react";

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
        Image:
        <input type="file" accept="image/*" onChange={handleImageChange} />
      </label>
      {item.image && <img src={item.image} alt="Preview" />}
      <button type="submit">Add Item</button>
    </form>
  );
};

export default NewItem;
