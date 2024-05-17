import dotenv from "dotenv"

dotenv.config({ path: '/var/www/html/Rank-Anything/.env' });
import express, { request, response } from "express";
import mongoose from "mongoose";
import User from './models/user.js';
import cors from 'cors';
import bcrypt from 'bcrypt';
import jsonwebtoken, { decode } from 'jsonwebtoken';
import cookieParser from 'cookie-parser';

const app = express();
const PORT = process.env.PORT;
const mongoDBURL = process.env.mongoDBURL;
const secretKey = process.env.secretKey;
app.use(cookieParser());

app.use(express.json());
app.use(
    cors({
        origin: ['http://localhost:5173', "http://localhost:5555"],
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        allowedHeaders: ['Content-Type'],
        credentials: true,
    })
);

app.get('/', (request, response) => {
    console.log(request);
    return response.status(234).send('MSAID')
});


/**
 * Compares the jwt submitted with secretkey to see if it has been tamperred with
 */
app.post('/verifyjwt', async (request, response) => {
    const { jwt: token } = request.cookies;
    console.log(request.cookies)
    try {
        // Token is valid
        const decoded = jsonwebtoken.verify(token, secretKey);
        const { username, userId, authLevel } = decoded
        console.log(decoded)
        response.status(200).json({ valid: true, decoded });
        console.log("jwt verified")
    } catch (error) {
        // Token is invalid
        console.log("jwt invalid")
        response.status(401).json({ valid: false });
    }
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
            // TODO: make http cookie from this webtoken.
            const token = jsonwebtoken.sign({ userId: user._id, username: user.username, authLevel: 'user' }, secretKey, { expiresIn: '30d' });
            console.log("Token created");
            const expirationDate = new Date();
            expirationDate.setDate(expirationDate.getDate() + 30);
            response.cookie('jwt', token, { httpOnly: false, secure: false, expires: expirationDate});
            console.log("Cookie created")
            response.send('Logged in successfully');
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
                message: 'Password not secure enough',
            });
        };
        const { username, password } = request.body;
        // Hashing the password on server for storage
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = {
            username: username,
            password: hashedPassword
        };
        const user = await User.create(newUser);
        return response.status(201).send("User succesffuly created");

    } catch (error) {
        console.log(error.message);
        response.status(500).send({ message: error.message });
    }
});


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
