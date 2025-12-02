const express = require("express");
const { UserAuth } = require("../middleware/auth");

const requestRouter = express.Router();

requestRouter.post("/sendConnectionRequest", UserAuth, (req, res) => {
  const user = req.user;
  res.send(user.firstName + " " + user.lastName + " send request!");
});

module.exports = requestRouter;
