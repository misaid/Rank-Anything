import dotenv from "dotenv";
dotenv.config({ path: "../.env" });
import express, { json, request, response } from "express";
import cors from "cors";
import bcrypt from "bcrypt";
import jsonwebtoken, { decode } from "jsonwebtoken";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";

// Models
import User from "./models/user.js";
// import List from "./models/rankedList.js";
import SafeUser from "./models/safeUser.js";
import Room from "./models/room.js";

// Environment variables
const PORT = process.env.PORT;
const mongoDBURL = process.env.mongoDBURL;
const secretKey = process.env.secretKey;

const app = express();
app.use(express.json());
app.use(cookieParser());

app.set("trust proxy", 1);
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type"],
    credentials: true,
  })
);

app.get("/", (request, response) => {
  console.log(request);
  return response.status(234).send("MSAID");
});

/**
 * Compares the jwt submitted with secretkey to see if it has been tamperred with
 */
app.post("/verifyjwt", async (request, response) => {
  const { jwt: token } = request.cookies;
  try {
    // Token is valid
    const decoded = jsonwebtoken.verify(token, secretKey);
    //console.log(decoded.username, ": has been verified");
    response.status(200).json({ valid: true, decoded });
  } catch (error) {
    // Token is invalid
    console.log("jwt invalid");
    response.status(401).json({ valid: false });
  }
});

/**
 * User paswords are hashed with bcrypt so we have to compare the hashed password to the user input here.
 */
app.post("/login", async (request, response) => {
  try {
    // Input verification
    if (!request.body.username || !request.body.password) {
      return response.status(400).send({
        message: "Please provide username and password",
      });
    }
    const { username, password } = request.body;

    // Checking to see if the user exists in the database
    const user = await User.findOne({ username: username });
    if (!user) {
      return response.status(404).json({ message: "User not found" });
    }

    // Comparing password hash from database with user inputted hash
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (passwordMatch) {
      //Generating a json web token
      // TODO: make http cookie from this webtoken.
      const token = jsonwebtoken.sign(
        { userId: user._id, username: user.username, authLevel: "user" },
        secretKey,
        { expiresIn: "30d" }
      );
      console.log(token);

      response.cookie("jwt", token, {
        httpOnly: true,
        secure: process.env.node_env === "production",
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
        // sameSite: 'lax',
        domain: "localhost",
        // path: '/',
      });

      console.log("Cookie created");
      return response.status(200).json({ message: "Login successful" });
    } else {
      return response.status(401).json({ message: "Incorrect password" });
    }
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
});

/**
 * User passwords are taken and if the user name is unique the password is hashed on stored.
 */
app.post("/register", async (request, response) => {
  try {
    // Input verification
    if (!request.body.username || !request.body.password) {
      return response.status(400).send({
        message: "send all fields",
      });
    }

    if (!/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(request.body.password)) {
      return response.status(400).send({
        message: "Password not secure enough",
      });
    }
    const { username, password } = request.body;
    // Hashing the password on server for storage
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = {
      username: username,
      password: hashedPassword,
    };
    User.create(newUser)
      .then((user) => {
        console.log("User created");
        response.status(200).send("User succesffuly created");
        // Create a safe user object to store in the safe user collection
        SafeUser.create({ _id: user._id, username: username })
          .then(() => {
            console.log("Safe user created");
          })
          .catch((error) => {
            console.error("Error creating safe user:", error);
            response.status(500).send("Internal Server Error");
          });
      })
      .catch((error) => {
        if (error.code === 11000 && error.keyPattern.username) {
          // Duplicate username error
          console.error("Username already exists:", error);
          response.status(400).send("Username already exists");
        } else {
          console.error("Error creating user:", error);
          response.status(500).send("Internal Server Error");
        }
      });
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
});

/**
 * User logs out by clearing the cookie
 */
app.post("/logout", async (request, response) => {
  response.clearCookie("jwt");
  return response.status(200).send("Logged out");
});
/**
 * Add room to user
 */
app.post("/user:id/room", async (request, response) => {
  // get cookies and insure user = username
  try {
    const decoded = jsonwebtoken.verify(request.cookies.jwt, secretKey);
    // console.log(decoded.userId, request.params.id);
    if (decoded.userId !== request.params.id) {
      return response.status(401).send("Unauthorized");
    } else {
      // console.log("User verified");
      try {
        const userId = request.params.id;
        const roomId = request.body.roomId;
        // Find the user with the specified username
        SafeUser.findOneAndUpdate(
          { _id: userId },
          { $addToSet: { roomids: roomId } }, // Use $addToSet to ensure uniqueness
          { new: true, upsert: false }
        )
          .then(() => {
            response.status(200).send("Room added to user successfully");
          })
          .catch((error) => {
            console.error("Error adding room to user:", error);
            response.status(500).send("Internal Server Error");
          });
        // response.status(200).send("Room added to user successfully");
      } catch (error) {
        console.error("Error adding room to user:", error);
        response.status(500).send("Internal Server Error");
      }
    }
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
});
/**
 * Get Rooms from user
 */
app.get("/user:id/rooms", async (request, response) => {
  // verify user id matches cookie
  try {
    if (!request.cookies.jwt) {
      return response.status(401).send("Unauthorized");
    }
    // console.log(request.cookies.jwt);
    if (
      jsonwebtoken.verify(request.cookies.jwt, secretKey).userId !==
      request.params.id
    ) {
      return response.status(401).send("Unauthorized");
    }
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }

  // get rooms from user
  try {
    // Find the user with the specified username
    SafeUser.findOne({ _id: request.params.id })
      .then((user) => {
        response.status(200).send(user.roomids);
      })
      .catch((error) => {
        console.error("Error fetching rooms from user:", error);
        response.status(500).send("Internal Server Error");
      });
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
});

/**
 * Add opinions to room. Handles even if there is prexisting opinions.
 */
app.post("/room:id/opinions", async (request, response) => {
  try {
    const roomId = request.params.id;
    const userOpinions = request.body;
    // console.log(typeof userOpinions, userOpinions)
    const room = await Room.findOne({ roomname: roomId });
    if (room) {
      for (const [userId, opinions] of Object.entries(userOpinions)) {
        // Find the user's opinion entry in the room
        let userOpinionEntry = room.opinions.find(
          (entry) => entry.userId === userId
        );

        // if userOpinionEntry is not found, create a new entry
        if (!userOpinionEntry) {
          userOpinionEntry = {
            userId: userId,
            opinions: new Map(room.defaultRankedList),
          };
          room.opinions.push(userOpinionEntry);
        }

        // Update the opinions
        for (const [opinionKey, opinionValue] of Object.entries(opinions)) {
          userOpinionEntry.opinions.set(opinionKey, opinionValue);
        }
      }

      // Init empty dict for avgOpinion
      const opinionSums = new Map();
      for (const key of room.defaultRankedList.keys()) {
        opinionSums.set(key, 0);
      }

      // Calculate avgOpinion
      for (const entry of room.opinions) {
        for (const [key, value] of entry.opinions.entries()) {
          opinionSums.set(key, (opinionSums.get(key) || 0) + value);
        }
      }
      room.avgOpinion = opinionSums;
      await room.save();
      response.status(200).json({ message: "Opinions updated successfully" });
    } else {
      response.status(404).json({ error: "Room not found" });
    }
  } catch (error) {
    console.error("Error adding opinion to room:", error);
    response.status(500).send("Internal Server Error");
  }
});

/**
 * get opinions from room
 */
app.get("/room:id/opinions", async (request, response) => {
  try {
    const room = await Room.findOne({ roomname: request.params.id });
    // console.log(room);
    if (!room) {
      response.status(404).send("Room not found");
      return;
    }
    response.status(200).send(room.opinions);
  } catch (error) {
    console.error("Error fetching opinions from room:", error);
    response.status(500).send("Internal Server Error");
  }
});

/**
 * Create a room
 */
app.post("/room:id", async (request, response) => {
  try {
    // console.log(request.cookies.jwt);
    if (!request.cookies.jwt) {
      return response.status(401).send("Unauthorized");
    }

    const decoded = jsonwebtoken.verify(request.cookies.jwt, secretKey);
    if (!decoded) {
      return response.status(401).send("Unauthorized");
    }

    const roomData = {
      roomname: request.params.id,
      creator: decoded.userId,
      //defaultRankedList: drl,
    };
    if (roomData.roomname.length < 3 || roomData.roomname.length > 20) {
      response
        .status(400)
        .send("Room name must be between 3 and 20 characters");
      return;
    }
    // console.log(roomData);
    Room.create(roomData)
      .then(() => {
        response.status(200).send("Room created successfully");
      })
      .catch((error) => {
        console.error("Error creating room:", error);
        response.status(500).send("Internal Server Error");
      });
    console.log("Room created", roomData.creator, roomData.roomname);
  } catch (error) {
    console.error(error.message);
    response.status(500).send({ message: error.message });
  }
});

/**
 * Find a room by name
 */
app.get("/room:id", async (request, response) => {
  try {
    const decoded = jsonwebtoken.verify(request.cookies.jwt, secretKey);
    // Find the room with the specified name
    // console.log(request.params.id)
    Room.findOne({ roomname: request.params.id })
      .then((room) => {
        // console.log(request.params.id, room);
        // if user is not in opinions, add them and set them to default ranked list
        const userOpinion = room.opinions.find(
          (opinion) => opinion.userId === decoded.userId
        );
        if (!userOpinion) {
          // If the user's opinion doesn't exist, add it with the default ranked list
          console.log("User opinion not found");
          room.opinions.push({
            userId: decoded.userId,
            opinions: room.defaultRankedList,
          });
        }
        // console.log(userOpinion)

        if (room === null) {
          response.status(500).send("Room not found");
        } else {
          if (room.users.includes(decoded.username)) {
            response.status(200).send({ room: room, userId: decoded.userId });
          } else {
            room.users.push(decoded.username);
            room
              .save()
              .then(() => {
                response
                  .status(200)
                  .send({ room: room, userId: decoded.userId });
              })
              .catch((error) => {
                console.error("Error adding user to room:", error);
                response.status(500).send("Internal Server Error");
              });
          }
        }
      })
      .catch((error) => {
        console.error("Error fetching room:", error);
        response.status(500).send("Internal Server Error");
      });
  } catch (error) {
    console.error(error.message);
    response.status(500).send({ message: error.message });
  }
});

/**
 * Add a user to a room
 */
app.post("/room:id/user", async (request, response) => {
  try {
    const room = await Room.findOneAndUpdate(
      { roomname: request.params.id },
      { $addToSet: { users: request.body.username } }, // Use $addToSet to ensure uniqueness
      { new: true, upsert: false }
    );

    response.status(200).send("User added to room successfully");
  } catch (error) {
    console.error("Error adding user to room:", error);
    response.status(500).send("Internal Server Error");
  }
});

/**
 * add item to room
 */
app.put("/room:id/item", async (request, response) => {
  try {
    if (request.cookies.jwt === null) {
      return response.status(401).send("Unauthorized");
    }

    const decoded = jsonwebtoken.verify(request.cookies.jwt, secretKey);

    if (!decoded) {
      return response.status(401).send("Unauthorized");
    }
    console.log("username: ", !decoded.username === "admin");
    Room.findOne({ roomname: request.params.id }).then((room) => {
      if (!room || decoded.userId !== room.creator) {
        if (decoded.username !== "admin") {
          response.status(401).send("Not Authorized");
          return;
        }
      }
      const item = request.body.item;
      if (item === "") {
        response.status(400).send("Item cannot be empty");
        return;
      }
      if (room.defaultRankedList.has(item)) {
        response.status(400).send("Item already exists in room");
        return;
      }
      // reset the default ranked list to orderd list 1-n
      const newRankedList = new Map();
      let i = 1;
      for (const key of room.defaultRankedList.keys()) {
        newRankedList.set(key, i);
        i++;
      }
      newRankedList.set(item, i);

      // when a new item is added to the list, the opinions and avgOpinion must be reset
      room.defaultRankedList = newRankedList;
      // set opinions all to defaultRankedList
      for (const entry of room.opinions) {
        entry.opinions = new Map(room.defaultRankedList);
      }
      room.avgOpinion = new Map(room.defaultRankedList);

      room
        .save()
        .then(() => {
          response.status(200).send("Item added to room successfully");
        })
        .catch((error) => {
          console.error("Error adding item to room:", error);
          response.status(500).send("Internal Server Error");
        });
    });
  } catch (error) {
    console.error("Error adding item to room:", error);
    response.status(500).send("Internal Server Error");
  }
});

/**
 * delete item from room
 */
app.delete("/room:id/item", async (request, response) => {
  try {
    if (request.cookies.jwt === null) {
      return response.status(401).send("Unauthorized");
    }

    const decoded = jsonwebtoken.verify(request.cookies.jwt, secretKey);

    if (!decoded) {
      return response.status(401).send("Unauthorized");
    }

    Room.findOne({ roomname: request.params.id }).then((room) => {
      if (!room || decoded.userId !== room.creator) {
        if (decoded.username !== "admin") {
          response.status(401).send("Not Authorized");
          return;
        }
      }
      console.log("room found + authorized");

      let item = request.body.item;
      if (item === "") {
        // get the last item from the dictionary
        item = Array.from(room.defaultRankedList.keys()).pop();
      }

      // if the item is not in the list, return an error
      if (!room.defaultRankedList.has(item)) {
        response.status(400).send("Item not found in room");
        return;
      }
      console.log("item to delete: ", item);
      // reset the default ranked list to orderd list 1-n
      const newRankedList = new Map();
      let i = 1;
      for (const key of room.defaultRankedList.keys()) {
        if (key !== item) {
          newRankedList.set(key, i);
          i++;
        }
      }

      // when an item is removed from the list, the opinions and avgOpinion must be reset
      room.defaultRankedList = newRankedList;
      // set opinions all to defaultRankedList
      for (const entry of room.opinions) {
        entry.opinions = new Map(room.defaultRankedList);
      }
      room.avgOpinion = new Map(room.defaultRankedList);

      room
        .save()
        .then(() => {
          response.status(200).send("Item deleted from room successfully");
        })
        .catch((error) => {
          console.error("Error deleting item from room:", error);
          response.status(500).send("Internal Server Error");
        });
    });
  } catch (error) {
    console.error("Error deleting item from room:", error);
    response.status(500).send("Internal Server Error");
  }
});
/**
 * Connect to the database and start the server
 */
mongoose
  .connect(mongoDBURL)
  .then(() => {
    console.log("App connected to database");
    app.listen(PORT, () => {
      console.log(`App is listening to port: ${PORT}`);
    });
  })
  .catch((error) => {
    console.log(error);
  });
