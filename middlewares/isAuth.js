const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  req.userId = "";
  const authHeader = req.headers.authorization;
  if (!authHeader || authHeader === "") {
    req.isAuth = false;
    return next();
  }
  const token = authHeader.split(" ")[1];
  if (!token || token === "") {
    req.isAuth = false;
    return next();
  }
  let decodedToken;
  try {
    decodedToken = jwt.verify(token, "supersecretkey");
  } catch (err) {
    req.isAuth = false;
    return next();
  }
  if (!decodedToken) {
    req.isAuth = false;
  }
  req.isAuth = true;
  req.userId = decodedToken.userId;
  next();
};
