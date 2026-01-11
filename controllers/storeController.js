
//const home = require("../models/home");
const Home = require("../models/home");
const User = require("../models/user");
const Booking= require("../models/booking.js");

exports.getIndex = (req, res, next) => {
  Home.find().then((registeredHomes) => {
    res.render("store/index", {
      registeredHomes: registeredHomes,
      pageTitle: "airbnb Home",
      currentPage: "index",
      isLoggedIn: req.isLoggedIn,
      usertype: req.usertype
    });
  });
};

exports.getHomes = (req, res, next) => {
  Home.find().then((registeredHomes) => {
    res.render("store/home-list", {
      registeredHomes: registeredHomes,
      pageTitle: "Homes List",
      currentPage: "Home",
      isLoggedIn: req.isLoggedIn,
      usertype: req.usertype
    });
  });
};

exports.getBookings = (req, res, next) => {
  if (!req.session.user) return res.redirect("/login");

  const userId = req.session.user._id;

  User.findById(userId)
    .populate({
      path: "booking",
      populate: { path: "home" }
    })
    .then(user => {
      if (!user) return res.redirect("/login");

      const bookings = (user.booking || [])
        .filter(b => b && b.home) // safety
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); // latest first

      res.render("store/bookings", {
        bookings,
        pageTitle: "My Bookings",
        currentPage: "bookings",
        isLoggedIn: req.isLoggedIn,
        usertype: req.usertype
      });
    })
    .catch(err => {
      console.log("Error fetching bookings:", err);
      res.redirect("/");
    });
};


exports.getBookHome = (req, res, next) => {
  
  const homeId = req.params.homeId;
  Home.findById(homeId).then((home) => {
    if (!home) {
      console.log("Home not found for booking.");
      res.redirect("/homes");
    } else {
      res.render("store/booking-details", {
        home: home,
        pageTitle: "Book Home",
        currentPage: "Book Home",
        isLoggedIn: req.isLoggedIn,
        user: req.session.user
      });
    }
  }); 
}


exports.postBookHome = (req, res, next) => {
  console.log("came to post booking", req.body);
  const homeId = req.params.homeId;

  if (!req.session.user) return res.redirect("/login");
  const userId = req.session.user._id;

  const { checkIn, checkOut, phone} = req.body;

  const names = req.body.guestName;
  const ages  = req.body.guestAge;

  const nameArr = Array.isArray(names) ? names : (names ? [names] : []);
  const ageArr  = Array.isArray(ages)  ? ages  : (ages  ? [ages]  : []);
    if (nameArr.length === 0 || ageArr.length === 0 || nameArr.length !== ageArr.length) {
    console.log("Invalid guest details");
    return res.redirect("/homes/" + homeId);
  }

  const guestsArr = nameArr
    .map((n, i) => ({
      name: String(n || "").trim(),
      age: Number(ageArr[i])
    }))
    .filter(g => g.name.length > 0 && !Number.isNaN(g.age));

  if (guestsArr.length < 1) {
    console.log("At least 1 guest required");
    return res.redirect("/homes/" + homeId);
  }

  Home.findById(homeId)
    .then(home => {
      if (!home) throw new Error("Home not found");

      const booking = new Booking({
        home: homeId,
        user: userId,
        guests: guestsArr,
        checkIn: new Date(checkIn),
        checkOut: new Date(checkOut),
        phone: String(phone || "").trim(),
        pricePerNight: home.price,          
        status: "pending_payment"
      });

      return booking.save();
  })
  .then((savedBooking) => {
    console.log("Booking saved successfully");
    res.redirect("/payment/" + savedBooking._id);
  })
  .catch(err => {
    console.log("Error while booking home:", err);
    res.redirect("/homes/" + homeId);
  });
};


exports.postCancelBooking = (req, res, next) => {
  const bookingId = req.params.bookingId;
  console.log("came to cancel booking", bookingId);
  if (!req.session.user) return res.redirect("/login");
  const userId = req.session.user._id;

  Booking.findById(bookingId)
    .then(booking => {
      if (!booking) {
        console.log("Booking not found for cancellation.");
        return res.redirect("/bookings");
      }
      
      // Only the owner can cancel 
      if (String(booking.user) !== String(userId)) {
        console.log("Unauthorized cancellation attempt");
        return res.redirect("/bookings");
      }

      booking.status = "cancelled";
      return booking.save();
    })
    .then(() => {
      console.log("Booking cancelled successfully");
      res.redirect("/bookings");
    })
    .catch(err => {
      console.log("Error while cancelling booking:", err);
      res.redirect("/bookings");
    });
};
       

  



exports.getFavouriteList = (req, res, next) => {
  const userId= req.session.user._id;
  const user = User.findById(userId).populate('favourites').then(user => {
    const favouriteHomes = user.favourites;
    res.render("store/favourite-list", {
      favouriteHomes: favouriteHomes,
      pageTitle: "My Favourites",
      currentPage: "favourites",
      isLoggedIn: req.isLoggedIn,
      user: req.session.user
    });
  });
};

exports.postAddToFavourite = (req, res, next) => {
  console.log("came to add to favourite", req.body);
  const homeId = req.body.id;
  const userId = req.session.user._id;

  User.findById(userId).then(user => {
    const alreadyFavourite = user.favourites.find(favHomeId => favHomeId.toString() === homeId);
    if (alreadyFavourite) {
      console.log("Home already in favourites");
      return res.redirect('/favourites');
    }
    user.favourites.push(homeId);
    return user.save().then(() => {
      console.log("Home added to favourites");
      res.redirect('/favourites');
    }); 
  })
}

exports.postRemoveFromFavourite = (req, res, next) => {
  //console.log(req.params);
  const homeId = req.params.homeId;
  const userId = req.session.user._id;
  User.findById(userId).then(user => {
    user.favourites = user.favourites.filter(favHomeId => favHomeId.toString() !== homeId);
    return user.save().then(() => {
      console.log("Home removed from favourites");
      res.redirect('/favourites');
    });
  });   
}

exports.getHomeDetails = (req, res, next) => {
  const homeId = req.params.homeId;
  Home.findById(homeId).then((home) => {
    if (!home) {
      console.log("Home not found");
      res.redirect("/homes");
    } else {
      res.render("store/home-detail", {
        home: home,
        pageTitle: "Home Detail",
        currentPage: "Home",
        isLoggedIn: req.isLoggedIn,
        user: req.session.user
      });
    }
  });
};
