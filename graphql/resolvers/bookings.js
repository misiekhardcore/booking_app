const Event = require("../../modules/event");
const Booking = require("../../modules/booking");
const { transformBooking, transformEvent } = require("./merge");
const isAuth = require("../../middlewares/isAuth");

module.exports = {
  bookings: async (args, { isAuth }) => {
    if (!isAuth) {
      throw new Error("You are not authenticated");
    }
    try {
      const bookings = await Booking.find();
      return bookings.map((booking) => {
        return transformBooking(booking);
      });
    } catch (err) {
      throw err;
    }
  },
  bookEvent: async ({ eventId }, { isAuth, userId }) => {
    if (!isAuth) {
      throw new Error("You are not authenticated");
    }
    try {
      const event = await Event.findOne({ _id: eventId });
      const booking = new Booking({
        user: userId,
        event,
      });
      const result = await booking.save();
      return transformBooking(result);
    } catch (err) {
      throw err;
    }
  },
  cancelBooking: async ({ bookingId }, { isAuth }) => {
    if (!isAuth) {
      throw new Error("You are not authenticated");
    }
    try {
      const booking = await Booking.findById(bookingId).populate("event");
      const event = transformEvent(booking.event);
      await Booking.deleteOne({ _id: bookingId });
      return event;
    } catch (err) {
      throw err;
    }
  },
};
