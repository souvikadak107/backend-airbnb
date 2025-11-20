const mongoose= require('mongoose');

const userSchema = mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  usertype: { type: String, enum: ['guest', 'host'], default:"guest" }
});

module.exports = mongoose.model('User', userSchema);