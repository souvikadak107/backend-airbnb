
const mongoose= require('mongoose');


const homeSchema= mongoose.Schema({
  houseName:{type: String, required: true},
  price:{type: Number, required: true},
  location:{type: String, required: true},
  rating:{type: Number, required: true},
<<<<<<< HEAD
  photoUrl:{type: String},
=======
  photo:{type: String},
>>>>>>> working
  description:{type: String},
})


// homeSchema.pre('findOneAndDelete', async function(next){
//   console.log("came to pre hook while deleteing a home");
//   const homeId= this.getQuery()._id;
//   const Favourite = mongoose.model('favourites');
//   await Favourite.deleteMany({houseId: homeId});
//   next();
// })



module.exports = mongoose.model('Home', homeSchema);


/** 

    this.houseName = houseName;
    this.price = price;
    this.location = location;
    this.rating = rating;
<<<<<<< HEAD
    this.photoUrl = photoUrl;
=======
    this.photo = photo;
>>>>>>> working
    this.description = description;
    this._id = _id;
*
    save()
    find()
    findById(homeId)
    deleteById(homeId)


*/



