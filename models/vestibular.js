const mongoose = require('mongoose')

const vestUnbSchema = new mongoose.Schema({
    nome:{
        type: String,
        required:true,

    },
    vagas: {
        type: String,
        required:false,
    },

    remuneracao: {
        type: String,
        required:false,
    },
    type:{
        type:String,
        required:true
    },

    link_to_site: {
        type: String,
        required:true,

    },
    items_on_site:[{
        dates: String,
        name: String,
        link: String
      }],
    items_on_site_number: {
        type: Number,
        required:true,

    },

    users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]

  });

  const VestUnb = mongoose.model('VestUnb', vestUnbSchema);

module.exports = VestUnb;