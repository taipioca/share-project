// Profile.tsx
import React, { useState, useEffect } from "react";
import axios from "axios"; 
import { useParams } from "@reach/router";

interface User {
    _id: string;
    firstName: string;
    lastName: string;
}

const Profile = (props) => {
    const [firstName, setFirstName] = useState<string | undefined>(undefined);
    const [lastName, setLastName] = useState<string | undefined>(undefined);
    const { userId } = useParams(); 

    useEffect(() => {
        axios.get(`/api/users/${userId}`).then((response) => { 
            const user: User = response.data;
            if (user._id) {
                setFirstName(user.firstName);
                setLastName(user.lastName);
            }
        });
    }, [userId]);

    return (
        <div>
            <h1>Profile</h1>
            <p>User ID: {userId}</p>
            <p>First Name: {firstName}</p>
            <p>Last Name: {lastName}</p>
        </div>
    );
};

export default Profile;