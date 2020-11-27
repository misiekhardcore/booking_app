const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../../models/user");

module.exports = {
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
      return { ...result._doc, password: null, _id: result.id };
    } catch (err) {
      throw err;
    }
  },
  login: async ({ email, password }) => {
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error("Invalid login and/or password");
    }
    const isEqual = await bcrypt.compare(password, user.password);
    if (!isEqual) {
      throw new Error("Invalid login and/or password");
    }
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      "supersecretkey",
      {
        expiresIn: "1h",
      }
    );
    return {
      userId: user.id,
      token,
      tokenExpiration: 1,
    };
  },
};
