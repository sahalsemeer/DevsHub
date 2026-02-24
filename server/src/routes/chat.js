const express = require("express");
const authRouter = require("./auth");
const chatModel = require("../models/chat");
const { UserAuth } = require("../middleware/auth");

const router = express.Router();

router.get("/chats/:recieverId", UserAuth, async (req, res) => {
  try {
    const userId = req.user._id;
    console.log(userId);
    const { recieverId } = req.params;

    const page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;

    // Calculate the number of messages to skip from the end
    const skip = (page - 1) * limit;

    const chats = await chatModel
      .findOne({
        participants: { $all: [userId, recieverId] },
      })
      .slice('messages', [skip ? -skip - limit : -limit, limit])
      .populate({
        path: "messages.senderId",
        select: "firstName lastName",
      });

    // console.log(chats);
    if (!chats) {
      return res.status(200).json({ message: "No chats found!" });
    }
    // If the slice returns empty (e.g. page > total messages), it might still return the chat doc with empty messages
    res.json(chats); // sending the chat object with sliced messages
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message })
  }
});

module.exports = router;
