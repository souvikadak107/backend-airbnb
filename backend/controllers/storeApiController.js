const User = require("../models/user");
const Home = require("../models/home");
const Booking = require("../models/booking");


const mongoose = require("mongoose");


exports.getIndex = (req, res) => {
  Home.find().then((registeredHomes) => { 
    res.status(200).json({ registeredHomes });
  }).catch(err => {
    res.status(500).json({ error: "Failed to fetch homes" });
  });
};

exports.getHomes = (req, res) => {
  Home.find().then((registeredHomes) => { 
    res.status(200).json({ registeredHomes ,
      count: registeredHomes.length
    });
  }).catch(err => {
    res.status(500).json({ error: "Failed to fetch homes" });
  });
};

exports.getHomeDetails = async (req, res) => {
  const homeId = req.params.homeId;
  try{

    const homeDetails = await Home.findById(homeId);
    if(!homeDetails){
      return  res.status(404).json({ error: "Home not found" });
    }
    res.status(200).json({ homeDetails });
  }
  catch(err){
      console.error("getHomeDetails error:", err);
      return res.status(500).json({
        error: "Failed to fetch home details",
        details: err.message
      });
  }
}


exports.getFavorites = async (req, res) => {
  try{
    const userId = req.user._id;
    const UserFavorites = await User.findById(userId).populate({"path":"favourites",
      model: "Home"
    });

    if(!UserFavorites){
      return res.status(404).json({ error: "User or favorites not found" });
    }

    res.status(200).json({
      data: UserFavorites.favourites || [],
      count: (UserFavorites.favourites || []).length
    }); 
  }
  catch(error){
    console.error("getFavorites error:", error);
    return res.status(500).json({
      error: "Failed to fetch favorites",
      details: error.message
    });
  } 
}

exports.postAddToFavorites = async (req, res) => {
  const homeId = req.params.homeId;
  try{
    const userId = req.user._id;
    const user = await User.findById(userId);
    if(!user){
      return res.status(404).json({
        error: "user not found"
      })
    }
    if(user.favourites.some(id => id.equals(homeId))){
      return res.status(400).json({
        error: "Home already in favorites"
      });
    }
    user.favourites.push(homeId);
    await user.save();
    return res.status(200).json({
      message: "Home added to favorites successfully"
    });

  }
  catch(error){
    console.error("addToFavorites error:", error);
    return res.status(500).json({
      error: "Failed to add to favorites",
      details: error.message
    });
  }

}

exports.removeFromFavorites = async (req, res) => {
  const homeId = req.params.homeId;
  try{
    const userId = req.user._id;  
    const user = await User.findById(userId);
    if(!user){
      return res.status(404).json({
        error: "user not found"
      })
    }
    const index = user.favourites.findIndex( id => id.equals(homeId));
    if(index === -1){
      return res.status(400).json({
        error: "Home is not in favorites"
      });
    }

    user.favourites.splice(index, 1);
    await user.save();
    return res.status(200).json({
      message: "Home removed from favorites successfully"
    });
  }
  catch(error){
    console.error("removeFromFavorites error:", error);
    return res.status(500).json({
      error: "Failed to remove from favorites",
      details: error.message
    });
  }

}

exports.getBookings = async (req, res) => {
  try {
      const userId = req.user._id;
      const userBooking = await User.findById(userId).populate({
        path: "booking",
        populate: { path: "home" }
      });
      //console.log(userBooking.booking);

      if(!userBooking){
        return res.status(404).json({ error: "User or bookings not found" });
      }

      res.status(200).json({ 
        userId: userId,
        data: userBooking.booking || [],
        count: (userBooking.booking || []).length
      });
  } catch (error) {
      console.error("getBookings error:", error);
      return res.status(500).json({
        error: "Failed to fetch bookings",
        details: error.message
      });
  }

}

exports.getCreateBooking = async (req, res) => {
  const homeId = req.params.homeId;
  try {
      const homeDetails = await Home.findById(homeId);
      if(!homeDetails){
        return res.status(404).json({ error: "Home not found" });
      }
      res.status(200).json({ homeDetails });
  } catch (error) {
      console.error("getCreateBooking error:", error);
      return res.status(500).json({
        error: "Failed to fetch home details for booking",
        details: error.message
      });
  }
}

exports.postCreateBooking = async (req, res) => {
  const homeId = req.params.homeId;
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
      const userId = req.user._id;
      
      const homeDetails = await Home.findById(homeId);
      if(!homeDetails){
        return res.status(404).json({ error: "Home not found" });
      }

      const {guests , checkIn, checkOut, phone} = req.body;

      if(!guests || !Array.isArray(guests) || guests.length === 0){
        return res.status(422).json({ error: "At least one guest is required" });
      }

      if(!phone || !/^[0-9]{10}$/.test(phone) || phone.length !== 10 || !checkIn || !checkOut){
        return res.status(422).json({ error: "Invalid phone number or check-in/check-out dates" });
      }

      const pricePerNight = homeDetails.price;


      const conflictingBooking = await Booking.findOne({
        home: (homeId),
        status: { $ne: "cancelled" },
        checkIn: { $lt: new Date(checkOut) },
        checkOut: { $gt: new Date(checkIn) }
      }).session(session);

      if(conflictingBooking){
        return res.status(409).json({ error: "The selected dates are not available for booking" });
      }

      const newBooking = await Booking.create(
        [
          {
          home: (homeId),
          user: (userId),
          guests: guests,
          phone: phone,
          checkIn: new Date(checkIn),
          checkOut: new Date(checkOut),
          pricePerNight: pricePerNight,
          status: "pending_payment"
          }
        ],
        { session }
      );  

      await User.findByIdAndUpdate(
        userId,
        { $push: { booking: newBooking[0]._id } },
        { session }
      );

      await session.commitTransaction();
      session.endSession();

      res.status(201).json({
        message: "Booking created successfully",
        booking: newBooking[0]
      });

  }
    catch(error){
      console.error("postCreateBooking error:", error);
      return res.status(500).json({
        error: "Failed to create booking",
        details: error.message
      });
    }
}

exports.postCancelBooking = (req, res) => {
  const bookingId = req.params.bookingId;
  const userId = req.user._id;

  const bookingExits = Booking.findById(bookingId).then(booking => {
    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }
    
    // Only the owner can cancel 
    if (String(booking.user) !== String(userId)) {
      return res.status(403).json({ error: "Unauthorized cancellation attempt" });
    }

    booking.status = "cancelled";
    return booking.save();
  })
  .then(() => {
    return res.status(200).json({ message: "Booking cancelled successfully" });
  })
  .catch((error) => {  
      console.error("postCreateBooking error:", error);
      return res.status(500).json({
        error: "Failed to Cancel booking",
        details: error.message
      });
    });

}