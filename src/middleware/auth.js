const userModel = require("../models/users");
const jwt = require("jsonwebtoken");

const UserAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    // console.log(token);

    const AccessToken = jwt.verify(token, "qaz123#wwxcvb");
    // console.log(AccessToken);
    const { id } = AccessToken;
    // console.log(id);

    const user = await userModel.findById(id);
    console.log(user);
    if (user) {
      req.user = user;
      next();
    } else {
      throw new Error("User does not exist!");
    }
  } catch (error) {
    res.send(error.message);
  }
};

module.exports = {
  UserAuth,
};
