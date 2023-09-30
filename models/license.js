const mongoose = require('mongoose')
const digitalLicenseSchema = new mongoose.Schema({
    licenseKey: {
      type: String,
      required: true,
      unique: true, 
    },
    issuedTo: {      
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', 
      required: true,     
    },
    issuedBy: {
      type: String,
      required: true,
    },
    issueDate: {
      type: Date,
      required: true,
    }
  });
  
  const License = mongoose.model('License', digitalLicenseSchema);
  
  module.exports = License;