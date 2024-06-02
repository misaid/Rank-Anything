import jsonwebtoken, { decode } from "jsonwebtoken";

// const jsonwebtoken = require('jsonwebtoken');

/**
 * 
 * @param {Object} req the request object 
 * @param {Object} res the response object
 * @param {*} next 
 * @returns 
 */
const verifyJWT = (req, res, next) => {
    // console.log(req.cookies)
    try{
    const jwt = req.cookies.jwt;
    
    if (!jwt) {
        return res.status(403).send("A token is required for authentication");
    }
    try {
        const decoded = jsonwebtoken.verify(jwt, process.env.secretKey);
        req.user = decoded;
    } catch (error) {
        return res.status(401).send("Invalid Token");
    }
    return next();} catch (error) {
        console.log(error)
    }
}

export default verifyJWT;