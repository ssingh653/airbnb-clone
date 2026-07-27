const mongoose = require("mongoose");

const BookingSchema = new mongoose.Schema({
  place: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "Place" },
  user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
  checkIn: { type: String, required: true },
  checkOut: { type: String, required: true },
  name: { type: String, required: true },
  phone: { type: String, required: true },
  numberOfGuests: { type: Number, required: true },
  price: { type: Number, required: true },
});

const BookingModel = mongoose.model("Booking", BookingSchema);

module.exports = BookingModel;
