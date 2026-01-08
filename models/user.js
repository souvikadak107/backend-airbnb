const mongoose= require('mongoose');
<<<<<<< HEAD
=======
const booking = require('./booking');
>>>>>>> working

const userSchema = mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  usertype: { type: String, enum: ['guest', 'host'], default:"guest" },
<<<<<<< HEAD
  favourites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Home' }]  
=======
  favourites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Home' }],
  booking: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Booking' }]  
>>>>>>> working
});

module.exports = mongoose.model('User', userSchema);