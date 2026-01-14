const Home = require("../models/home");
const User = require("../models/user");
const Booking = require("../models/booking");

const mongoose = require("mongoose");


exports.getCheckout = async (req, res) => {
  try {
    const userId = req.user._id;
    const bookingId = req.params.bookingId;
    const booking = await Booking.findById(bookingId).populate('home');
    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    if (String(booking.user) !== String(userId)) {
      return res.status(403).json({ error: "Unauthorized access to this booking" });
    }

    const home = booking.home;
    return res.status(200).json({
      message: "Checkout details",
      booking: booking,
      home: home
    });

  } catch (err) {
    console.error("getCheckout error:", err);
    return res.status(500).json({
      error: "Failed to load checkout",
      details: err.message
    });
  }
}

exports.getConfirmCheckoutSession = async (req, res) => {
  try {
    const userId = req.user._id;
    const bookingId = req.params.bookingId;

    const bookingDoc = await Booking.findById(bookingId);
    if (!bookingDoc) {
      return res.status(404).json({ error: "Booking not found" });
    }

    if (String(bookingDoc.user) !== String(userId)) {
      return res.status(403).json({ error: "Unauthorized confirmation attempt" });
    }

    if (bookingDoc.status !== "pending_payment") {
      return res.status(400).json({ error: "Booking cannot be confirmed" });
    }

    bookingDoc.status = "confirmed";
    await bookingDoc.save();

    return res.status(200).json({
      message: "Booking confirmed successfully",
      booking: bookingDoc
    });

  } catch (err) {
    console.error("postConfirmCheckoutSession error:", err);
    return res.status(500).json({
      error: "Failed to confirm booking",
      details: err.message
    });
  }
} 

exports.getPayLaterCheckoutSession = async (req, res) => {
  try {
    const userId = req.user._id;
    const bookingId = req.params.bookingId;

    const bookingDoc = await Booking.findById(bookingId);
    if (!bookingDoc) {
      return res.status(404).json({ error: "Booking not found" });
    }

    if (String(bookingDoc.user) !== String(userId)) {
      return res.status(403).json({ error: "Unauthorized access to this booking" });
    }

    if (bookingDoc.status !== "pending_payment") {
      return res.status(400).json({ error: "Booking cannot be set to pay later" });
    }

    bookingDoc.status = "pay_later";
    await bookingDoc.save();

    return res.status(200).json({
      message: "Booking set to pay later successfully",
      booking: bookingDoc
    });

  } catch (err) {
    console.error("postPayLaterCheckoutSession error:", err);
    return res.status(500).json({
      error: "Failed to set booking to pay later",
      details: err.message
    });
  }
} 

exports.deleteCancelCheckoutSession = async (req, res) => {

  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const userId = req.user._id;
    const bookingId = req.params.bookingId;

    const bookingDoc = await Booking.findById(bookingId);
    if (!bookingDoc) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ error: "Booking not found" });
    }
    
    if (String(bookingDoc.user) !== String(userId)) {
      await session.abortTransaction();
      session.endSession();
      return res.status(403).json({ error: "Unauthorized cancellation attempt" });
    }   
    await Booking.deleteOne({ _id: bookingId }).session(session);
    await User.findByIdAndUpdate(userId, { $pull: { bookings: bookingId } }).session(session);

    await session.commitTransaction();
    session.endSession();

    return res.status(200).json({
      message: "Booking cancelled successfully"
    });

  } catch (err) {
    console.error("postCancelCheckoutSession error:", err);
    return res.status(500).json({
      error: "Failed to cancel booking",
      details: err.message
    });
  }
}      