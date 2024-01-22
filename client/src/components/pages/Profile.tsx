import React, { useState, useEffect } from "react";
import { get } from "../../utilities";
import NewItem from "../modules/NewItem";
import "../../utilities.css";
import { Link, navigate } from "@reach/router";
import { v4 as uuidv4 } from "uuid";

interface User {
  _id: string;
  name: string;
  picture: string;
  firstName: string;
  lastName: string;
}

type Item = {
  id: string;
  userId: string;
  image: string;
  title: string;
  points: number;
};

const Profile = (props) => {
  const [user, setUser] = useState<User>(); // Provide a type for the user state variable
  const [items, setItems] = useState<Item[]>([]);

  useEffect(() => {
    document.title = "Profile Page";
    get(`/api/user`, { userid: props.userId }).then((userObj) => setUser(userObj));
  }, []);

  useEffect(() => {
    const savedItems = localStorage.getItem("items");
    if (savedItems) {
      setItems(JSON.parse(savedItems));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("items", JSON.stringify(items));
  }, [items]);

  const handleNewItem = (item: Item) => {
    setItems((prevItems) => {
        const newItems = [...prevItems, { ...item, userId: user!._id, userFirstName: user!.firstName, userLastName: user!.lastName }];
        localStorage.setItem("items", JSON.stringify(newItems));
      return newItems;
    });
    navigate("/catalog"); // Redirect to the catalog page
  };

  if (!user) {
    return <div> Loading! </div>;
  }

  const userItems = items.filter((item) => item.userId === user._id);
console.log(user._id)

  return (
    <>
      <div className="Profile-avatarContainer">
        <img className="Profile-avatar" alt="Profile picture" src={user.picture} />
        <h2 className="Profile-name">{user.name}</h2>
      </div>
      <NewItem onNewItem={handleNewItem} />
      <div className="Profile-items">
        {userItems.map((item) => (
          <div key={item.id} className="Profile-item">
            <h3>{item.title}</h3>
            {/* Add more item properties as needed */}
          </div>
        ))}
      </div>
    </>
  );
};

export default Profile;
