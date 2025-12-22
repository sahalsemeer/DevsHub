const express = require("express");
const { UserAuth } = require("../middleware/auth");
const ConnectionsRequests = require("../models/connectionRequests");
const { data } = require("react-router-dom");
const userModel = require("../models/users");

const userRouter = express.Router();
const selectFields = "firstName lastName age gender photoURL about skills";

userRouter.get("/user/requests/received", UserAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    // console.log(loggedInUser._id);

    const connectionRequest = await ConnectionsRequests.find({
      ToUserId: loggedInUser._id,
      status: "interested",
    }).populate({ path: "FromUserId", select: selectFields });

    const data = connectionRequest;

    res.json({ data });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

userRouter.get("/user/requests/connections", UserAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const connections = await ConnectionsRequests.find({
      $or: [
        { FromUserId: loggedInUser._id, status: "accepted" },
        { ToUserId: loggedInUser._id, status: "accepted" },
      ],
    })
      .populate({ path: "FromUserId", select: selectFields })
      .populate({ path: "ToUserId", select: selectFields });

    // console.log(connections);

    const data = connections.map((item) => {
      if (item.FromUserId._id.equals(loggedInUser._id)) {
        return item.ToUserId;
      }
      return item.FromUserId;
    });

    res.json({ data });
  } catch (error) {
    res.json({ message: error.message });
  }
});

userRouter.get("/user/feed", UserAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const limit = parseInt(req.query.limit) || 10;
    const page = parseInt(req.query.page) || 1;

    const skip = (page - 1) * limit;


    const connectionRequests = await ConnectionsRequests.find({
      $or: [{ FromUserId: loggedInUser }, { ToUserId: loggedInUser }],
    });

    const hiddenUsers = new Set();

    connectionRequests.forEach((connection) => {
      hiddenUsers.add(connection.FromUserId);
      hiddenUsers.add(connection.ToUserId);
    });

    const UsersOnFeed = await userModel
      .find({
        $and: [
          { _id: { $nin: Array.from(hiddenUsers) } },
          { _id: { $ne: loggedInUser._id } },
        ],
      }).skip(skip).limit(limit)
      .select(selectFields);

    res.send(UsersOnFeed);
  } catch (error) {
    res.send(error.message);
  }
});

module.exports = userRouter;
