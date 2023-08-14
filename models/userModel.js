const mongoose = require('mongoose')
 const bcrypt = require('bcryptjs')
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
userSchema.pre('save', async function(next){
    // only run this funtciotn if password was modified
    if (!this.isModified('password') ) {return next();}
    // hash the password with cost of 12 
    else { this.password =  await bcrypt.hash(this.password,12)
    next()
    }
})

userSchema.methods.correctPassword = async function (password, hashedpassword) {
    return await bcrypt.compare(password, hashedpassword);
};


const User = mongoose.model('User', userSchema);

module.exports = User;