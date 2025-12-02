const express = require("express");
const {validate} = require("../utils/validation");
const bcrypt = require("bcrypt");
const userModel = require("../models/users");

const authRouter = express.Router();

authRouter.post("/signup", async (req, res) => {
  const { firstName, lastName, emailId, password } = req.body;

  try {
    validate(req);
    console.log(req);
    const hashedPass = await bcrypt.hash(password, 10);
    const users = new userModel({
      firstName: firstName,
      lastName: lastName,
      emailId: emailId,
      password: hashedPass,
    });
    await users.save();

    res.send("User Added Succesfully!");
  } catch (error) {
    res.status(400).send(error.message);
  }
});

authRouter.post("/login", async (req, res) => {
  const { emailId, password } = req.body;

  try {
    const user = await userModel.findOne({ emailId: emailId });
    if (!user) {
      throw new Error("Invalid Credentials.");
    }
    const isPassword = await user.comparePass(password);
    console.log(isPassword);

    if (isPassword) {
      const token = await user.getJWT();
      res.cookie("token", token);
      res.send("User Login Succesfull");
    } else {
      throw new Error("Invalid Credentials.");
    }
  } catch (error) {
    res.status(401).send("ERROR:" + error.message);
  }
});


authRouter.post('/logout',(req,res) => {
   res.clearCookie('token')
   res.send('Logout Succesfully!')
})

module.exports = authRouter;
