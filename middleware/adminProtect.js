const asyncHandler = require("express-async-handler");
const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const dotenv = require('dotenv').config();
const User = require('../models/userModel');

exports.adminProtect = asyncHandler(async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1]; // Remove the 'Bearer' keyword here
    } else {
        return res.status(401).json({ message: 'Authorization token not provided' });
    }

    try {
        // Decoding the token
        const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

        // Check if user exists in the database after decoding the token
        const freshUser = await User.findById(decoded.id);
        if (!freshUser) {
            return res.status(401).json({ message: 'User not found' });
        }

        // Set the decoded user info on the request for use in subsequent middleware or routes
        req.user = freshUser;

        // Check if the user is an admin
        if (freshUser.isAdmin) {
            return res.status(200).json(freshUser)
           // return next(); // Proceed to the next middleware/route
        } else {
            return res.status(403).json({ message: 'Access denied: Admin privileges required' });
        }
    } catch (error) {
        return res.status(401).json({ message: 'Invalid or expired token' });
    }
});
