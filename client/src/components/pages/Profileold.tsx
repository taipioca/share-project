
import React, { useState, useEffect } from "react";
import axios from "axios"; 

interface User {
    _id: string;
    firstName: string;
    lastName: string;
}

interface ProfileProps {
    userId: string | null;
    path?: string;
}

const Profile = ({ userId }: ProfileProps) => {
    // console.log(userId)
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        if (userId) {
            axios.get(`/api/users/${userId}`).then((response) => { 
                setUser(response.data);
            }).catch((error) => {
                console.error('Failed to fetch user:', error);
            });
        }
    }, [userId]);

    if (!user) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h1>Profile</h1>
            <p>User ID: {user._id}</p>
            <p>First Name: {user.firstName}</p>
            <p>Last Name: {user.lastName}</p>
        </div>
    );
};

export default Profile;