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
        const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
        
        const freshUser = await User.findById(decoded.id);
        if (!freshUser) {
            return res.status(401).json({ message: 'User not found' });
        }
        req.id = freshUser.id
        req.username = freshUser.username;

        if (freshUser.isAdmin) {
            next();
           // return res.status(200).json(freshUser)
        } else {
            return res.status(403).json({ message: 'Access denied: Admin privileges required' });
        }
    } catch (error) {
        return res.status(401).json({ message: 'Invalid or expired token' });
    }
});
