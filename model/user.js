const mongoose = require('mongoose');

const Schema = mongoose.Schema;


// Create SCHEMA

const userSchema = new Schema({
      fullname: {
          type: String,
          required: true
      },
      email: {
         type: String,
         required: true
      },
      password: {
          type: String,
          required: true
      },
      date: {
          type: String,
          default: Date.now 
      }
})

module.exports = User= mongoose.model('user', userSchema)
