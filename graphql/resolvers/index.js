const bcrypt = require("bcrypt");

const Event = require("../../modules/event");
const User = require("../../modules/user");

const events = async (eventIds) => {
  const events = await Event.find({ _id: { $in: eventIds } });
  try {
    events.map((event) => {
      return {
        ...event._doc,
        date: new Date(event._doc.date).toISOString(),
        creator: user.bind(this, event._doc.creator),
      };
    });
    return events;
  } catch (err) {
    throw err;
  }
};

const user = async (userId) => {
  try {
    const user = await User.findById(userId);
    return {
      ...user._doc,
      createdEvents: events.bind(this, user._doc.createdEvents),
    };
  } catch (err) {
    throw err;
  }
};

module.exports = {
  events: async () => {
    try {
      const events = await Event.find();
      return events.map((event) => ({
        ...event._doc,
        date: new Date(event._doc.date).toISOString(),
        creator: user.bind(this, event._doc.creator),
      }));
    } catch (err) {
      throw err;
    }
  },
  createEvent: async ({ eventInput: { title, description, price, date } }) => {
    const event = new Event({
      title: title,
      description: description,
      price: price,
      date: new Date(date),
      creator: "5fbd03a34707393c14051246",
    });
    let createdEvent;
    try {
      const result = await event.save();
      createdEvent = {
        ...result._doc,
        date: new Date(event._doc.date).toISOString(),
        creator: user.bind(this, result._doc.creator),
      };
      const creator = await User.findById("5fbd03a34707393c14051246");
      if (!creator) {
        throw new Error("User not found");
      }
      creator.createdEvents.push(event);
      await creator.save();
      return { ...createdEvent };
    } catch (err) {
      throw err;
    }
  },
  createUser: async ({ userInput: { email, password } }) => {
    try {
      const user = await User.findOne({ email });
      if (user) {
        throw new Error("User already exists");
      }
      const hashed = await bcrypt.hash(password, 12);
      const user_1 = new User({
        email: email,
        password: hashed,
      });
      const result = await user_1.save();
      return { ...result._doc, password: null };
    } catch (err) {
      throw err;
    }
  },
};
