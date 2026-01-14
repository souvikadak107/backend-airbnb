const Home = require("../models/home");
const User = require("../models/user");
const Booking= require("../models/booking.js");
const user = require("../models/user");


exports.getCheckout = (req, res, next) => {
  const bookingId = req.params.bookingId;
  Booking.findById(bookingId).populate('home').then(booking => {
    if (!booking) {
      console.log("Booking not found for checkout.");
      return res.redirect("/bookings");
    }

    const home = booking.home;
    res.render("payment/payments", {
      home: home,
      booking: booking,
      pageTitle: "Checkout",
      currentPage: "checkout",
      isLoggedIn: req.isLoggedIn,
      user: req.session.user
    });
  });
};

exports.postConfirmCheckoutSession = (req, res, next) => {
  if (!req.session.user) return res.redirect("/login");

  const bookingId = req.params.bookingId;
  const userId = req.session.user._id;

  Booking.findById(bookingId)
    .then(bookingDoc => {
      if (!bookingDoc) {
        console.log("Booking not found for confirmation.");
        return res.redirect("/bookings");
      }

     
      if (String(bookingDoc.user) !== String(userId)) {
        console.log("Unauthorized confirmation attempt");
        return res.redirect("/bookings");
      }

      if (bookingDoc.status !== "pending_payment") {
        return res.redirect("/bookings");
      }

      bookingDoc.status = "confirmed";
      return bookingDoc.save();
    })
    .then(savedBooking => {
      if (!savedBooking || res.headersSent) return;

      return User.findById(userId)
        .then(userDoc => {
          if (!userDoc) return res.redirect("/login");

          // avoid duplicates
          if (!userDoc.booking.some(id => String(id) === String(savedBooking._id))) {
            userDoc.booking.push(savedBooking._id);
          }

          return userDoc.save();
        })
        .then(() => {
          if (!res.headersSent) res.redirect("/bookings");
        });
    })
    .catch(err => {
      console.log("Error confirming booking:", err);
      if (!res.headersSent) res.redirect("/bookings");
    });
};



exports.postCancelCheckoutSession = (req, res, next) => {
  if (!req.session.user) return res.redirect("/login");

  const bookingId = req.params.bookingId;
  const userId = req.session.user._id;

  Booking.findById(bookingId)
    .then(bookingDoc => {
      if (!bookingDoc) {
        console.log("Booking not found for confirmation.");
        return res.redirect("/bookings");
      }

     
      if (String(bookingDoc.user) !== String(userId)) {
        console.log("Unauthorized confirmation attempt");
        return res.redirect("/bookings");
      }

      const homeId = bookingDoc.home;
      console.log("homeId:", homeId);

      

      
      
      return Booking.findByIdAndDelete(bookingId).then(() => {
        console.log("Pending booking deleted successfully.");
        res.redirect("/homes/" + homeId);
      });
    })
  .catch(err => {
    console.log("Error confirming booking:", err);
    res.redirect("/bookings");
  });   
}


exports.postPayLaterCheckoutSession = (req, res, next) => {
  if (!req.session.user) return res.redirect("/login");

  const bookingId = req.params.bookingId;
  const userId = req.session.user._id;

  Booking.findById(bookingId)
    .then(bookingDoc => {
      if (!bookingDoc) {
        console.log("Booking not found for pay later.");
        return res.redirect("/bookings");
      }

     
      if (String(bookingDoc.user) !== String(userId)) {
        console.log("Unauthorized pay later attempt");
        return res.redirect("/bookings");
      } 
      
      if (bookingDoc.status !== "pending_payment") {
        return res.redirect("/bookings");
      }

      bookingDoc.status = "paylater";
      return bookingDoc.save();
    } )
    .then(savedBooking => {
      if (!savedBooking || res.headersSent) return;

      return User.findById(userId)
        .then(userDoc => {
          if (!userDoc) return res.redirect("/login");

          // avoid duplicates
          if (!userDoc.booking.some(id => String(id) === String(savedBooking._id))) {
            userDoc.booking.push(savedBooking._id);
          }

          return userDoc.save();
        })
        .then(() => {
          if (!res.headersSent) res.redirect("/bookings");
        });
    })
    .catch(err => {
      console.log("Error processing pay later booking:", err);
      if (!res.headersSent) res.redirect("/bookings");
    });
};