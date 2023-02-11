
const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    doc_submitted: Boolean,
    is_verified: Boolean,
    is_activated: Boolean,
    username: String,
    password: String,
    full_name: String,
    email: String,
    country: String,
    user_type: String,
    doc_address_filename: {
      type: String,
      default: '',
    },
    doc_id_filename: {
      type: String,
      default: '',
    }
  })
  
  module.exports = mongoose.model('User', userSchema);