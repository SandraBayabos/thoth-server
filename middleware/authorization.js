const jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports = async (req, res, next) => {
  try {
    const bearerHeader = req.headers["authorization"];

    if (typeof bearerHeader !== "undefined") {
      const bearer = bearerHeader.split(" ");
      const bearerToken = bearer[1];
      req.token = bearerToken;

      if (!bearerToken) {
        return res.status(403).json("Not Authorized");
      } else {
        const payload = jwt.verify(bearerToken, process.env.JWTSECRET);
        req.user = payload.user;
        next();
      }
    }
  } catch (error) {
    return res.status(403).json("Not Authorized");
  }
};
