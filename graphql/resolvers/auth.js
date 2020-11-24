const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../../modules/user");

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
      return { ...result._doc, password: null };
    } catch (err) {
      throw err;
    }
  },
  login: async ({ email, password }) => {
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error("Invalid login and/or password1");
    }
    const isEqual = await bcrypt.compare(password, user.password);
    if (!isEqual) {
      throw new Error("Invalid login and/or password2");
    }
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      "supersecretkey",
      {
        expiresIn: "1h",
      }
    );
    return {
      userId: (await user).id,
      token,
      tokenExpiration: 1,
    };
  },
};
