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

    const chats = await chatModel
      .findOne({
        participants: { $all: [userId, recieverId] },
      })
      .populate({
        path: "messages.senderId",
        select: "firstName lastName",
      });
    // console.log(chats);
    if (!chats) {
      return res.status(200).json({ message: "No chats found!" });
    }
    res.json({ chats });
  } catch (error) {
    console.log(error);
    return res.status(500).json({message:error.message})
  }
});

module.exports = router;
