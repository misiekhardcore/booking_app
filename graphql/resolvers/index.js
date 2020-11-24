const eventsResolvers = require("./events");
const bookingsResolvers = require("./bookings");
const authResolvers = require("./auth");

module.exports = {
  ...eventsResolvers,
  ...authResolvers,
  ...bookingsResolvers,
};
