const mongoose = require('mongoose')
 const bcrypt = require('bcryptjs')
 const crypto = require('crypto')
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
        required : false,
        unique :true
    },
    telegram:{
         type:String,
         required:false,
         unique:true

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
    vestUnb :{
        type:[String],
        required:false
    },
    concurso :{
        type:[String],
        required:false
    }
    ,
    isAdmin:{
        type:Boolean,
        default:false,
        required:false
    },

    phoneNotifications: {
        type: Boolean,
        default: false,
      },
    telegramNotifications: {
        type: Boolean,
        default: false,
      },
    emailNotifications: {
        type: Boolean,
        default: false,
      },

    passwordResetToken:String,
    passwordResetExpire:Date



})
userSchema.pre('save', async function(next){
    // only run this funtciotn if password was modified
    if (!this.isModified('password')  ) {return next();}
    // hash the password with cost of 12 
    else { this.password =  await bcrypt.hash(this.password,12)
    next()
    }
})

userSchema.methods.correctPassword = async function (password, hashedpassword) {
    return await bcrypt.compare(password, hashedpassword);
};

userSchema.methods.createPasswordResetToken = function(){
    const resetToken = crypto.randomBytes(32).toString('hex');
   this.passwordResetToken=  crypto.createHash('sha256').update(resetToken).digest('hex')

   this.passwordResetExpire = Date.now() + 10*60*1000;
   return resetToken;
    
}



const User = mongoose.model('User', userSchema);

module.exports = User;