# Rank-Anything
Rank Anything is a personal project developed using the MERN stack (MongoDB, Express.js, React.js, Node.js). It provides users with the ability to rank items within rooms.

## Features

### Room Creation:
* Users have the ability to create rooms and personalize a list of items to be ranked. Only the creator of the room can add items. The addition or deletion of items resets the ranking.
### Room Joining:
* Users can join existing rooms by using the "Join Room" textbox or selecting a room from the list of available rooms.
### Item Ranking:
*  Users can rank items within a room. The item rankings are calculated based on the sum of all user rankings.
### Security:
* User Passwords encrypted with bcrypt and a salt. User authentication is done through JSON web tokens.
## Technologies Used
* **Frontend:** React.js
* **Backend:** Node.js, Express.js
* **Database:** MongoDB

## License
This project is licensed under the MIT License.
