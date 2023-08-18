const mongoose = require('mongoose')

const concursoSchema = new mongoose.Schema({
    name:{
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
       default:0

    },

    users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]

  });

  const Concurso = mongoose.model('Concurso', concursoSchema);

module.exports = Concurso;