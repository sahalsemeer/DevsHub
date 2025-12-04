const express = require("express");
const { UserAuth } = require("../middleware/auth");
const ConnectionRequests = require("../models/connectionRequests");
const User = require("../models/users");
const mongoose = require("mongoose");

const requestRouter = express.Router();

requestRouter.post(
  "/connection/:status/:userId",
  UserAuth,
  async (req, res) => {
    try {
      const user = req.user;
      const FromUserId = user._id;
      const toUserId = req.params.userId;
      const connectionStatus = req.params.status;

      const allowedStatus = ["interested", "ignored"];

      if (!allowedStatus.includes(connectionStatus)) {
        throw new Error("Invalid Connection Status!");
      }

      const isUserExists = await User.findById(toUserId);

      if (!isUserExists) {
        res.status(404).json({ message: "User not Exist!" });
      }

      const ConnectionReq = new ConnectionRequests({
        FromUserId: FromUserId,
        ToUserId: toUserId,
        status: connectionStatus,
      });

      const existingUser = await ConnectionRequests.findOne({
        $or: [
          { FromUserId: FromUserId, ToUserId: toUserId },
          { FromUserId: toUserId, ToUserId: FromUserId },
        ],
      });

      if (existingUser) {
        throw new Error("Request already sent!");
      }
      await ConnectionReq.save();
      res.json({message:`${req.user.firstName} is ${connectionStatus} ${isUserExists.firstName}`})
    } catch (error) {
      console.log("Full error:", error);
      console.log("Error code:", error.code);

      if (error.code === 11000) {
        return res
          .status(400)
          .json({ error: "Connection request already exists!" });
      }

      res.status(500).json({ error: error.message });
    }
  }
);

module.exports = requestRouter;
