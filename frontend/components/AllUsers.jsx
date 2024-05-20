import React from 'react';

const AllUsers = ({ userList }) => { 
    return (
        <div>
            <h1>All Users: </h1>
            <ul>
                {userList.map((username, index) => (
                    <li key={index}>{username}</li>
                ))}
            </ul>
        </div>
    );
};

export default AllUsers;
