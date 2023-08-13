const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    username : {
        type : String,
        required : true,
    },
    email : {
        type : String,
        required : true,
        unique : true,
    },
    password : {
        type : String,
        required : true
    },
    phone : {
        type : String,
        required : true
    },
    isPremium :{
        type:Boolean,
        required:false,
        default:false
    },
    pasUnb :{
        type:[String],
        required:false,

    },
    VestUnb :{
        type:[String],
        required:false
    }
    ,
    isAdmin:{
        type:Boolean,
        default:false,
        required:false
    }



})

const User = mongoose.model('User', userSchema);

module.exports = User;