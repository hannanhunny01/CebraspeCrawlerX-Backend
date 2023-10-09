
const mongoose = require('mongoose')

const systemStatus = new mongoose.Schema({
    
    status:{
        type: Boolean,
        required:true,

    },
    action: {
        type: String,
        required:true,

    },
    date: {
        type: Date,
        required:true,

    },


});

const SystemStatus = mongoose.model('SystemStatus', systemStatus);
module.exports = SystemStatus;