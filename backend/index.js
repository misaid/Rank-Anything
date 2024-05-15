import dotenv from "dotenv"

dotenv.config({ path: '/var/www/html/Rank-Anything/.env' });
import express, { request, response } from "express";
import mongoose from "mongoose";
import User from './models/user.js';
import cors from 'cors';
import bcrypt from 'bcrypt';
import jsonwebtoken from "jsonwebtoken";

const app = express();
const PORT = process.env.PORT;
const mongoDBURL = process.env.mongoDBURL;
const secretKey = process.env.secretKey;
app.use(cors())

app.use(express.json());

app.get('/', (request, response) => {
    console.log(request);
    return response.status(234).send('MSAID')
});

/**
 * User paswords are hashed with bcrypt so we have to compare the hashed password to the user input here.
 */
app.post('/login', async (request, response) => {

    try {
        // Input verification
        if (!request.body.username || !request.body.password) {
            return response.status(400).send({
                message: 'Please provide username and password',
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
            const token = jsonwebtoken.sign({ userId: user._id, username: user.username,  authLevel: 'user' }, secretKey, { expiresIn: '30d' });
            console.log("Token created");
            return response.status(200).json({ message: "Login successful", token: token});
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
app.post('/register', async (request, response) => {
    try {
        // Input verification
        if (!request.body.username ||
            !request.body.password
        ) {
            return response.status(400).send({
                message: 'send all fields',
            });
        }

        if (!(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(request.body.password))) {
            return response.status(400).send({
                message: 'Passwordrd not secure enough',
            });
        };
        const { username, password } = request.body;
        // Hashing the password on server for storage
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = {
            username: username,
            password: hashedPassword
        };
        //testing purposes
        console.log(newUser);
        const user = await User.create(newUser);
        return response.status(201).send(user);

    } catch (error) {
        console.log(error.message);
        response.status(500).send({ message: error.message });
    }
});
app.use(
    cors({
        origin: 'http://127.0.0.1:5555',
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        allowedHeaders: ['Content-Type'],
    })
);
mongoose
    .connect(mongoDBURL)
    .then(() => {
        console.log('App connected to database');
        app.listen(PORT, () => {
            console.log(`App is listening to port: ${PORT}`);
        });
    })
    .catch((error) => {
        console.log(error);
    });
