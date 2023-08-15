const asyncHandler = require("express-async-handler");
const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const dotenv = require('dotenv').config();
const User = require('../models/userModel')

exports.tokenValidator = asyncHandler(async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1]; // Remove the 'Bearer' keyword here
    } else {
        return res.status(401).json({ message: 'Authorization token not provided' });
    }

    try {
        //decoding the token
        const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
       //chcek if user exist in database after the token 
        const freshUser = await User.findById(decoded.id)
        if(!freshUser){
            return  res.status(401).json({ message: 'user not found' });
        } 
        //set the decoded user info on the request for use in subsequent middleware or routes
        req.id = freshUser.id;
     //   return res.status(200).json(req.id)
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Invalid or expired token' });
    }
});
