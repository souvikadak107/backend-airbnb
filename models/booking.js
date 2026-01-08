const mongoose = require("mongoose");

const guestSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    age: { type: Number, required: true, min: 0, max: 120 }
  },
  { _id: false }
);

const bookingSchema = new mongoose.Schema(
  {
    home: { type: mongoose.Schema.Types.ObjectId, ref: "Home", required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

    guests: {
      type: [guestSchema],
      validate: {
        validator: (arr) => Array.isArray(arr) && arr.length >= 1,
        message: "At least 1 guest is required."
      }
    },

    phone: {
      type: String,
      required: true,
      trim: true,
      match: [/^[0-9]{10}$/, "Phone must be 10 digits"]
    },

    checkIn: { type: Date, required: true },
    checkOut: { type: Date, required: true },
    pricePerNight: { type: Number, required: true },
    totalPrice: { type: Number, default: 0 },

    status: {
      type: String,
      enum: ["pending_payment", "confirmed", "paylater", "cancelled"],
      default: "pending_payment"
    }
  },
  { timestamps: true }
);

bookingSchema.index({ home: 1, checkIn: 1, checkOut: 1 });

bookingSchema.pre("save", function (next) {
  if (!this.isModified("checkIn") && !this.isModified("checkOut")) {
    return next();
  }

  const nights =
    (this.checkOut.getTime() - this.checkIn.getTime()) /
    (1000 * 60 * 60 * 24);

  if (nights <= 0) { 
    return next(new Error("Invalid booking dates"));
  }

  this.totalPrice = nights * this.pricePerNight;
  next();
});



module.exports = mongoose.model("Booking", bookingSchema);
