
const mongoose= require('mongoose');


const homeSchema= mongoose.Schema({
  houseName:{type: String, required: true},
  price:{type: Number, required: true},
  location:{type: String, required: true},
  rating:{type: Number, required: true},
  photo:{type: String},
  photoPublicId:{type: String},
  description:{type: String},
  owner : { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
},{timestamps: true})





module.exports = mongoose.model('Home', homeSchema);





