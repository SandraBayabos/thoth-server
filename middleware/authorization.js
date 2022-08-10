const jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports = async (req, res, next) => {
  try {
    const jwtToken = req.header("token");

    if (!jwtToken) {
      return res.status(4003).json("Not Authorized");
    }

    const payload = jwt.verify(jwtToken, process.env.JWTSECRET);

    req.user = payload.user;
  } catch (error) {
    console.log(error.message);
    return res.status(4003).json("Not Authorized");
  }
};
