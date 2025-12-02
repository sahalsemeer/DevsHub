const express = require("express");
const { UserAuth } = require("../middleware/auth");
const { validateAllowedItems } = require("../utils/validation");
const bcrypt = require("bcrypt");

const profileRouter = express.Router();

profileRouter.get("/profile/view", UserAuth, async (req, res) => {
  const user = req.user;
  res.send(user);
});

profileRouter.patch("/profile/edit", UserAuth, async (req, res) => {
  try {
    const allowed = validateAllowedItems(req);
    // console.log(allowed);

    if (!allowed) {
      throw new Error("only allowed items can be updated!");
    } else {
      const loggedInUser = req.user;
      Object.keys(req.body).forEach(
        (key) => (loggedInUser[key] = req.body[key])
      );

      await loggedInUser.save();

      res.json({ message: "User Updated Succesfully!", user: req.user });
    }
  } catch (error) {
    res.send(error.message);
  }
});

profileRouter.patch("/profile/password", UserAuth, async (req, res) => {
  try {
    const LoggedInUser = req.user;
    const { password } = req.body;

    const hashedPass = LoggedInUser.password;

    const isPassValid = await bcrypt.compare(password, hashedPass);

    if (!isPassValid) {
      throw new Error("Invalid Credentials!");
    }
    const { newPassword } = req.body;

    const newPass = await bcrypt.hash(newPassword, 10);
    LoggedInUser.password = newPass;

    await LoggedInUser.save();
    res.json({ message: "Password Changed Succesfully!" });
  } catch (error) {
    res.send(error.message);
  }
});

module.exports = profileRouter;
