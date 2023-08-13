const mongoose = require('mongoose')

const pasUnbSchema = new mongoose.Schema({
    subprograma:{
        type: String,
        required:true,

    },
    stage_pas: {
        type: Number,
        required:true,
    },

    year_pas: {
        type: Number,
        required:true,
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

  const PasUnb = mongoose.model('PasUnb', pasUnbSchema);

module.exports = PasUnb;