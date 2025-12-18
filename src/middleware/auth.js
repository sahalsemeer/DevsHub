const userModel = require("../models/users");
const jwt = require("jsonwebtoken");

const UserAuth = async (req, res, next) => {
  

  try {
    const { token } = req.cookies;
    if (!token) {
      res.status(401).json({ message: "Token Must be Provided" });
    }

    const AccessToken = jwt.verify(token, "qaz123#wwxcvb");

    const { id } = AccessToken;

    const user = await userModel.findById(id);

    if (user) {
      req.user = user;
      next();
    } else {
      throw new Error("User does not exist!");
    }
  } catch (error) {
    res.status(401).send(error.message);
  }
};

module.exports = {
  UserAuth,
};
